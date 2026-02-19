import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share2, Backpack, Utensils, CheckSquare, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { GearTab } from './project/GearTab';
import { FoodTab } from './project/FoodTab';
import { ChecklistTab } from './project/ChecklistTab';

export const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'gear' | 'food' | 'checklist'>('gear');

  // Mock data
  const project = {
    title: 'Elbrus Ascent',
    type: 'Alpinism',
    dates: 'Aug 15 - 24',
    location: 'Caucasus Mountains',
    participants: [
      { id: 1, name: 'Alex', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
      { id: 2, name: 'Maria', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
      { id: 3, name: 'John', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
      { id: 4, name: 'Kate', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100' },
    ]
  };

  return (
    <div className="pb-24 space-y-6">
      {/* Header Navigation */}
      <header className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Trip Details</h1>
        <button className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform">
          <Share2 size={20} />
        </button>
      </header>

      {/* Project Info Card */}
      <GlassCard className="p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4AC7FA]/20 to-[#2F80ED]/20 rounded-bl-full -mr-8 -mt-8 blur-2xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div>
            <Badge status="info" className="mb-2">{project.type}</Badge>
            <h2 className="text-2xl font-bold text-[#1C1C1E]">{project.title}</h2>
            <p className="text-[#1C1C1E]/60 text-sm flex items-center gap-2 mt-1">
              <span>{project.dates}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>{project.location}</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {project.participants.map((p) => (
                <Avatar key={p.id} src={p.image} size="sm" className="border-2 border-white ring-2 ring-white/50" />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                +2
              </div>
            </div>
            <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">Invite</Button>
          </div>
        </div>
      </GlassCard>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-3 flex flex-col items-center justify-center text-center bg-white/30">
          <span className="text-xs text-[#1C1C1E]/50 mb-1">Base Weight</span>
          <span className="text-lg font-semibold text-[#1C1C1E]">8.4 kg</span>
        </GlassCard>
        <GlassCard className="p-3 flex flex-col items-center justify-center text-center bg-white/30">
          <span className="text-xs text-[#1C1C1E]/50 mb-1">Total Pack</span>
          <span className="text-lg font-semibold text-[#1C1C1E]">14.2 kg</span>
        </GlassCard>
        <GlassCard className="p-3 flex flex-col items-center justify-center text-center bg-white/30">
          <span className="text-xs text-[#1C1C1E]/50 mb-1">Food/Day</span>
          <span className="text-lg font-semibold text-[#1C1C1E]">650 g</span>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-black/5 rounded-2xl backdrop-blur-sm relative">
        {(['gear', 'food', 'checklist'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative z-10 ${
              activeTab === tab ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/50 hover:text-[#1C1C1E]/70'
            }`}
          >
            {tab === 'gear' && <Backpack size={16} />}
            {tab === 'food' && <Utensils size={16} />}
            {tab === 'checklist' && <CheckSquare size={16} />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
        
        {/* Animated background for active tab */}
        <motion.div 
          className="absolute top-1 bottom-1 bg-white shadow-sm rounded-xl z-0"
          initial={false}
          animate={{
            left: activeTab === 'gear' ? '4px' : activeTab === 'food' ? '33.33%' : '66.66%',
            width: 'calc(33.33% - 2.66px)',
            x: activeTab === 'gear' ? 0 : activeTab === 'food' ? 0 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'gear' && <GearTab />}
            {activeTab === 'food' && <FoodTab />}
            {activeTab === 'checklist' && <ChecklistTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
