"use client"
import Header from '@/components/Header';
import LandingPage from '@/components/LandingPage';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    document.title = "ChillBill - Your Personal Finance Manager";
  }, []);

  return (
  <>
    <Header />
    <LandingPage />
  </>
  );
}
