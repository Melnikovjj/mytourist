import React from 'react';
import { Plus, Flame, Scale } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

const meals = [
  { day: 1, type: 'Breakfast', name: 'Oatmeal w/ Berries', cal: 450, weight: 120 },
  { day: 1, type: 'Lunch', name: 'Trail Mix & Jerky', cal: 380, weight: 150 },
  { day: 1, type: 'Dinner', name: 'Pasta Carbonara', cal: 650, weight: 180 },
  { day: 2, type: 'Breakfast', name: 'Scrambled Eggs (Dried)', cal: 400, weight: 100 },
];

export const FoodTab = () => {
  return (
    <div className="space-y-6">
      {/* Daily Stats */}
      <GlassCard className="p-4 bg-gradient-to-r from-[#FF9F0A]/10 to-[#FF3B30]/10 border-[#FF9F0A]/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-sm text-[#1C1C1E]">Daily Average</h3>
          <span className="text-xs text-[#1C1C1E]/50">Target: 2500 kcal</span>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[#FF9F0A]/20 flex items-center justify-center text-[#FF9F0A]">
               <Flame size={16} />
             </div>
             <div>
               <p className="text-sm font-bold">2,450</p>
               <p className="text-xs text-[#1C1C1E]/50">kcal</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[#34C759]/20 flex items-center justify-center text-[#34C759]">
               <Scale size={16} />
             </div>
             <div>
               <p className="text-sm font-bold">650</p>
               <p className="text-xs text-[#1C1C1E]/50">grams</p>
             </div>
          </div>
        </div>
      </GlassCard>

      {/* Meals List */}
      <div className="space-y-4">
        {[1, 2].map((day) => (
          <div key={day} className="space-y-2">
            <h4 className="text-xs font-semibold text-[#1C1C1E]/50 uppercase tracking-wider ml-1">Day {day}</h4>
            {meals.filter(m => m.day === day).map((meal, idx) => (
              <GlassCard key={idx} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#2F80ED] font-medium mb-0.5">{meal.type}</p>
                  <p className="text-sm font-medium text-[#1C1C1E]">{meal.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{meal.cal} kcal</p>
                  <p className="text-xs text-[#1C1C1E]/50">{meal.weight}g</p>
                </div>
              </GlassCard>
            ))}
            {day === 2 && (
               <button className="w-full py-2 text-xs font-medium text-[#2F80ED] bg-[#2F80ED]/10 rounded-xl hover:bg-[#2F80ED]/20 transition-colors">
                 + Add Meal for Day {day}
               </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
