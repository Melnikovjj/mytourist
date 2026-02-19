import React from 'react';
import { Settings, Award, Map, ChevronRight, Share } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router';

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Profile</h1>
        <button 
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform"
        >
          <Settings size={20} />
        </button>
      </header>

      <div className="flex flex-col items-center">
        <Avatar 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
          size="xl" 
          glow 
          className="mb-4"
        />
        <h2 className="text-2xl font-bold text-[#1C1C1E]">Alex Hiker</h2>
        <p className="text-[#1C1C1E]/60 text-sm">@alex_hikes</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#4AC7FA]/10 flex items-center justify-center text-[#4AC7FA] mb-2">
            <Map size={20} />
          </div>
          <span className="text-2xl font-bold">12</span>
          <span className="text-xs text-[#1C1C1E]/50">Hikes Completed</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759] mb-2">
            <Award size={20} />
          </div>
          <span className="text-2xl font-bold">450</span>
          <span className="text-xs text-[#1C1C1E]/50">Kilometers</span>
        </GlassCard>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-3">Invite Friends</h3>
        <GlassCard className="p-4 bg-gradient-to-r from-[#4AC7FA] to-[#2F80ED] text-white">
           <div className="flex justify-between items-center">
             <div>
               <p className="font-medium text-sm text-white/90">Your unique code</p>
               <p className="text-2xl font-bold font-mono tracking-widest mt-1">HK-8921</p>
             </div>
             <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
               <Share size={20} />
             </button>
           </div>
        </GlassCard>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Settings</h3>
        <div className="space-y-2">
           <GlassCard 
             className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
             onClick={() => navigate('/settings')}
           >
             <span className="font-medium">App Settings</span>
             <ChevronRight size={20} className="text-gray-400" />
           </GlassCard>
           <GlassCard className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform">
             <span className="font-medium">Privacy Policy</span>
             <ChevronRight size={20} className="text-gray-400" />
           </GlassCard>
        </div>
      </section>
    </div>
  );
};
