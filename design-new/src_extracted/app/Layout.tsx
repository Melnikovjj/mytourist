import React from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from './components/ui/BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen pb-24 font-sans text-[#1C1C1E]">
      <div className="fixed top-0 left-0 right-0 h-safe-top z-50 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      
      <main className="px-4 pt-6 max-w-md mx-auto">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}
