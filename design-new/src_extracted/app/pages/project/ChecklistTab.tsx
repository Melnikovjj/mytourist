import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

const initialTasks = [
  { id: 1, text: 'Download offline maps', done: true },
  { id: 2, text: 'Check weather forecast', done: false },
  { id: 3, text: 'Notify relatives about route', done: false },
  { id: 4, text: 'Buy insurance', done: false },
  { id: 5, text: 'Charge power banks', done: false },
];

export const ChecklistTab = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <GlassCard 
          key={task.id} 
          className="p-3 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
          onClick={() => toggleTask(task.id)}
        >
          <div 
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
              task.done 
                ? 'bg-[#2F80ED] border-[#2F80ED] text-white' 
                : 'border-gray-300'
            }`}
          >
            <Check size={12} strokeWidth={3} className={`transform transition-transform ${task.done ? 'scale-100' : 'scale-0'}`} />
          </div>
          <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-[#1C1C1E]'}`}>
            {task.text}
          </span>
        </GlassCard>
      ))}

      <button className="w-full py-3 mt-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center gap-2 hover:border-[#2F80ED]/50 hover:text-[#2F80ED] transition-colors">
        <Plus size={20} />
        <span className="font-medium text-sm">Add Task</span>
      </button>
    </div>
  );
};
