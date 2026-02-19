import React, { useState } from 'react';
import { ChevronLeft, Bell, Scale, Moon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/ui/GlassCard';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { Input } from '../components/ui/Input';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#1C1C1E]/50 uppercase tracking-wider ml-1">Preferences</h2>
        
        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF9F0A]/10 flex items-center justify-center text-[#FF9F0A]">
              <Bell size={18} />
            </div>
            <span className="font-medium">Notifications</span>
          </div>
          <ToggleSwitch checked={notifications} onChange={setNotifications} />
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C1C1E]/10 flex items-center justify-center text-[#1C1C1E]">
              <Moon size={18} />
            </div>
            <span className="font-medium">Dark Mode (Beta)</span>
          </div>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
        </GlassCard>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#1C1C1E]/50 uppercase tracking-wider ml-1">Personal Data</h2>
        
        <GlassCard className="p-4 space-y-4">
           <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
              <Scale size={18} />
            </div>
            <span className="font-medium">Body Weight (kg)</span>
          </div>
          <p className="text-xs text-[#1C1C1E]/60 mb-2">Used for calculating max pack weight.</p>
          <Input type="number" defaultValue={75} placeholder="75" />
        </GlassCard>
      </section>

      <div className="pt-8">
        <p className="text-center text-xs text-[#1C1C1E]/40">Version 1.0.0 (Build 24)</p>
      </div>
    </div>
  );
};
