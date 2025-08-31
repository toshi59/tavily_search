'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        results,
        setResults,
        isLoading,
        setIsLoading,
        progress,
        setProgress,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};