import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { pool } from './utils/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import loanRoutes from './routes/loan.routes';
import transactionRoutes from './routes/transaction.routes';
import companyRoutes from './routes/company.routes';
import currencyRoutes from './routes/currency.routes';
import messageRoutes from './routes/message.routes';
import { triggerCurrencyUpdate, scheduleCurrencyUpdate } from './controllers/currency.controller';
import { verifyToken, authorizeRoles } from './middleware/auth.middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/loan-applications', loanRoutes);
app.use('/transactions', transactionRoutes);
app.use('/currencies', currencyRoutes);
app.use('/companies', companyRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/messages', messageRoutes);

// Start scheduled currency update
scheduleCurrencyUpdate();

// Test DB connection on startup
(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('📦 DB connected at:', result.rows[0].now);
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
})();

app.get('/', (_req, res) => {
  res.send('Kredithub Backend is running ✅');
});

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [senderId, receiverId, content]
      );
      const message = result.rows[0];
      // Emit message to both sender's and receiver's rooms
      io.to(`user_${senderId}`).to(`user_${receiverId}`).emit('newMessage', message);
    } catch (error) {
      console.error('Socket sendMessage DB error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
