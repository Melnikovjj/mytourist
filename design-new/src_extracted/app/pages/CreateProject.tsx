import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const CreateProject = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">New Trip</h1>
      </header>

      <GlassCard className="p-6 space-y-4">
        <Input label="Trip Name" placeholder="e.g. Altai Expedition" />
        <Input label="Dates" placeholder="Select dates" />
        <Input label="Location" placeholder="Where are you going?" />
        
        <div className="pt-4">
          <Button className="w-full">Create Trip</Button>
        </div>
      </GlassCard>
    </div>
  );
};
