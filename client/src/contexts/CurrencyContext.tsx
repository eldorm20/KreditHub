import { createContext, useContext, useState, ReactNode } from "react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatAmount: (amount: number, showSymbol?: boolean) => string;
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.85 },
  { code: "UZS", name: "Uzbekistan Som", symbol: "сўм", exchangeRate: 12500 },
  { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.73 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem("selectedCurrency", JSON.stringify(currency));
  };

  const convertAmount = (amount: number, fromCurrency: string = "USD"): number => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = selectedCurrency.exchangeRate;
    return (amount / fromRate) * toRate;
  };

  const formatAmount = (amount: number, showSymbol: boolean = true): string => {
    const converted = convertAmount(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: selectedCurrency.code === 'UZS' ? 0 : 2,
      maximumFractionDigits: selectedCurrency.code === 'UZS' ? 0 : 2,
    }).format(converted);
    
    return showSymbol ? `${selectedCurrency.symbol}${formatted}` : formatted;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      currencies,
      setCurrency,
      convertAmount,
      formatAmount
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}