import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Business } from '../types';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  businesses: Business[];
  activeBusiness: Business | null;
  loading: boolean;
  setActiveBusinessId: (id: number) => void;
  createBusiness: (name: string, industry: string, currency?: string) => Promise<Business>;
  refreshBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBusinesses = async () => {
    if (!isAuthenticated) {
      setBusinesses([]);
      setActiveBusiness(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/businesses/');
      const bizList: Business[] = res.data;
      setBusinesses(bizList);

      if (bizList.length > 0) {
        const storedId = localStorage.getItem('active_business_id');
        const found = bizList.find((b) => b.id === Number(storedId));
        if (found) {
          setActiveBusiness(found);
        } else {
          setActiveBusiness(bizList[0]);
          localStorage.setItem('active_business_id', bizList[0].id.toString());
        }
      } else {
        setActiveBusiness(null);
      }
    } catch (err) {
      console.error('Failed to load businesses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [isAuthenticated]);

  const setActiveBusinessId = (id: number) => {
    const found = businesses.find((b) => b.id === id);
    if (found) {
      setActiveBusiness(found);
      localStorage.setItem('active_business_id', id.toString());
    }
  };

  const createBusiness = async (name: string, industry: string, currency = 'INR') => {
    const res = await api.post('/businesses/', { name, industry, currency });
    const newBiz: Business = res.data;
    await fetchBusinesses();
    setActiveBusinessId(newBiz.id);
    return newBiz;
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        activeBusiness,
        loading,
        setActiveBusinessId,
        createBusiness,
        refreshBusinesses: fetchBusinesses,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
  return context;
};
