import React from 'react';
import { motion } from 'motion/react';
import { Check, AlertTriangle, Plus } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';

const items = [
  { id: 1, name: 'Tent (MSR Hubba)', weight: 1.54, packed: true, assignedTo: 'Alex' },
  { id: 2, name: 'Sleeping Bag', weight: 0.95, packed: true, assignedTo: 'Alex' },
  { id: 3, name: 'Sleeping Pad', weight: 0.45, packed: false, assignedTo: 'Alex' },
  { id: 4, name: 'Stove System', weight: 0.38, packed: false, assignedTo: 'Maria' },
  { id: 5, name: 'First Aid Kit', weight: 0.25, packed: true, assignedTo: 'John' },
  { id: 6, name: 'Water Filter', weight: 0.30, packed: false, assignedTo: 'Alex' },
];

export const GearTab = () => {
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  const bodyWeight = 75; // Mock user weight
  const weightRatio = (totalWeight / bodyWeight) * 100;
  const isOverweight = weightRatio > 25;

  return (
    <div className="space-y-4">
      {/* Weight Warning */}
      {isOverweight && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-orange-50/50 border border-orange-200/50 text-orange-700 p-3 rounded-2xl flex items-start gap-3 backdrop-blur-sm"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block">Pack is too heavy!</span>
            Total weight is {weightRatio.toFixed(1)}% of your body weight. Recommended limit is 25%.
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-3 flex items-center justify-between group active:scale-[0.99] transition-transform">
            <div className="flex items-center gap-3">
              <button 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.packed 
                    ? 'bg-[#34C759] border-[#34C759] text-white' 
                    : 'border-gray-300 hover:border-[#34C759]/50'
                }`}
              >
                {item.packed && <Check size={14} strokeWidth={3} />}
              </button>
              <div>
                <p className={`text-sm font-medium ${item.packed ? 'text-gray-400 line-through' : 'text-[#1C1C1E]'}`}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{item.weight} kg</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{item.assignedTo}</span>
                </div>
              </div>
            </div>
            
            <Badge status={item.packed ? 'success' : 'neutral'} className="text-[10px] px-2 py-0.5">
              {item.packed ? 'Packed' : 'Pending'}
            </Badge>
          </GlassCard>
        ))}
      </div>

      <button className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center gap-2 hover:border-[#2F80ED]/50 hover:text-[#2F80ED] transition-colors">
        <Plus size={20} />
        <span className="font-medium text-sm">Add Item</span>
      </button>
    </div>
  );
};
