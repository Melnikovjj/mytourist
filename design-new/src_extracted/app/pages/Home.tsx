import React from 'react';
import { motion } from 'motion/react';
import { Plus, Users, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router';

const projects = [
  {
    id: 1,
    title: 'Elbrus Ascent',
    date: 'Aug 15 - 24',
    participants: 4,
    progress: 75,
    type: 'Alpinism',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Lake Baikal Trail',
    date: 'Sep 10 - 18',
    participants: 6,
    progress: 30,
    type: 'Hiking',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
  },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1E]">Hello, Alex</h1>
          <p className="text-[#1C1C1E]/60 text-sm">Ready for your next adventure?</p>
        </div>
        <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" glow />
      </header>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard 
          className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
          onClick={() => navigate('/create')}
        >
          <div className="w-10 h-10 rounded-full bg-[#4AC7FA]/10 flex items-center justify-center text-[#4AC7FA]">
            <Plus size={24} />
          </div>
          <span className="font-medium text-sm">New Trip</span>
        </GlassCard>
        
        <GlassCard 
          className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
            <Users size={24} />
          </div>
          <span className="font-medium text-sm">Join Party</span>
        </GlassCard>
      </div>

      {/* Projects List */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-semibold">My Trips</h2>
          <button className="text-[#2F80ED] text-sm font-medium">See All</button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <GlassCard 
              key={project.id}
              className="p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="relative h-32">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <Badge status="neutral" className="mb-2 backdrop-blur-md bg-white/20 border-white/30 text-white">
                    {project.type}
                  </Badge>
                  <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm text-[#1C1C1E]/70">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} />
                    <span>{project.participants} people</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-[#1C1C1E]/60">
                    <span>Preparation</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar progress={project.progress} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Upcoming Invitation */}
      <GlassCard className="p-4 flex items-center gap-4 bg-gradient-to-br from-[#4AC7FA]/10 to-[#2F80ED]/10 border-[#2F80ED]/20">
        <div className="w-10 h-10 rounded-full bg-[#2F80ED] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#2F80ED]/30">
          <MapPin size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">Invite pending</h4>
          <p className="text-xs text-[#1C1C1E]/60">Altai Mountains • Aug 2024</p>
        </div>
        <Button size="sm" variant="primary" className="h-8 px-3 text-xs">Accept</Button>
      </GlassCard>
    </div>
  );
};
