import { useProjectStore } from '../../../store/projectStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useState } from 'react';

export function CalendarTab() {
    const { currentProject } = useProjectStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!currentProject) return null;

    const startDate = currentProject.startDate ? new Date(currentProject.startDate) : null;
    const endDate = currentProject.endDate ? new Date(currentProject.endDate) : null;

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
    // Adjust for Monday start (Russian locale usually starts Monday)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startOffset }, (_, i) => i);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isDateInRange = (day: number) => {
        if (!startDate || !endDate) return false;
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Normalize times
        const check = checkDate.setHours(0, 0, 0, 0);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(0, 0, 0, 0);
        return check >= start && check <= end;
    };

    const isStart = (day: number) => {
        if (!startDate) return false;
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate.toDateString() === startDate.toDateString();
    };

    const isEnd = (day: number) => {
        if (!endDate) return false;
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return checkDate.toDateString() === endDate.toDateString();
    };

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    return (
        <div className="space-y-4">
            <GlassCard className="p-4 bg-white/40 dark:bg-white/5">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/20 rounded-full text-[var(--text-primary)]">
                        <CaretLeft size={20} />
                    </button>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/20 rounded-full text-[var(--text-primary)]">
                        <CaretRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                        <div key={d} className="text-xs text-[var(--text-secondary)] py-1">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {emptyDays.map(i => <div key={`empty-${i}`} />)}
                    {days.map(day => {
                        const inRange = isDateInRange(day);
                        const start = isStart(day);
                        const end = isEnd(day);

                        let bgClass = '';
                        if (start || end) bgClass = 'bg-[#2F80ED] text-white shadow-lg';
                        else if (inRange) bgClass = 'bg-[#2F80ED]/20 text-[#2F80ED]';
                        else bgClass = 'hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)]';

                        return (
                            <div key={day} className={`
                                aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                ${bgClass}
                            `}>
                                {day}
                            </div>
                        );
                    })}
                </div>
            </GlassCard>

            <div className="flex gap-4 text-xs text-[var(--text-secondary)] px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2F80ED]" />
                    <span>Старт/Финиш</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2F80ED]/20" />
                    <span>В походе</span>
                </div>
            </div>
        </div>
    );
}
