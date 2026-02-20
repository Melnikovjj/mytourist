import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, Fire } from '@phosphor-icons/react';
import { useMealStore } from '../../../store/mealStore';
import { useParams } from 'react-router-dom';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const mealTypeLabels: Record<string, string> = {
    breakfast: '🌅 Завтрак', lunch: '☀️ Обед', dinner: '🌙 Ужин', snack: '🍎 Перекус',
};

export function FoodTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { meals, nutrition, loading, fetchMeals, createMeal, deleteMeal, addProduct, deleteProduct, fetchNutrition, applyTemplate } = useMealStore();
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState<string | null>(null);
    const [mealForm, setMealForm] = useState({ dayNumber: 1, mealType: 'breakfast' });
    const [productForm, setProductForm] = useState({ name: '', gramsPerPerson: 0, caloriesPer100g: 0, protein: 0, fat: 0, carbs: 0 });

    useEffect(() => {
        if (projectId) {
            fetchMeals(projectId);
            fetchNutrition(projectId);
        }
    }, [projectId]);

    const handleCreateMeal = async () => {
        if (projectId) {
            await createMeal(projectId, mealForm);
            setShowAddMeal(false);
        }
    };

    const handleApplyTemplate = async () => {
        if (projectId) {
            if (window.confirm('Это удалит текущие приемы пищи и сгенерирует стандартное меню. Продолжить?')) {
                await applyTemplate(projectId);
                await fetchNutrition(projectId);
                window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
            }
        }
    };

    const handleAddProduct = async () => {
        if (showAddProduct && productForm.name) {
            await addProduct(showAddProduct, productForm);
            setShowAddProduct(null);
            setProductForm({ name: '', gramsPerPerson: 0, caloriesPer100g: 0, protein: 0, fat: 0, carbs: 0 });
            if (projectId) {
                fetchMeals(projectId);
                fetchNutrition(projectId);
            }
        }
    };

    // Group meals by day
    const days = new Map<number, typeof meals>();
    meals.forEach((m) => {
        const arr = days.get(m.dayNumber) || [];
        arr.push(m);
        days.set(m.dayNumber, arr);
    });

    return (
        <div className="space-y-6">
            {/* Nutrition summary */}
            {nutrition && (
                <GlassCard className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-500/20">
                    <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400">
                        <Fire size={18} weight="fill" />
                        <span className="font-semibold text-sm">Питание (сводка)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Ккал</div>
                            <div className="font-bold text-[var(--text-primary)]">{Math.round(nutrition.totals?.calories || 0)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Белки</div>
                            <div className="font-bold text-[var(--text-primary)]">{Math.round(nutrition.totals?.protein || 0)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Жиры</div>
                            <div className="font-bold text-[var(--text-primary)]">{Math.round(nutrition.totals?.fat || 0)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Угл</div>
                            <div className="font-bold text-[var(--text-primary)]">{Math.round(nutrition.totals?.carbs || 0)}</div>
                        </div>
                    </div>
                    <div className="text-xs text-center mt-3 text-orange-600/70 dark:text-orange-300/70 font-medium bg-orange-200/20 dark:bg-orange-500/10 py-1 rounded-lg">
                        Общий вес: {nutrition.totals?.weightKg || 0} кг • {nutrition.memberCount} уч.
                    </div>
                </GlassCard>
            )}

            <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => setShowAddMeal(true)}>
                    <Plus size={16} className="mr-2" /> Добавить прием
                </Button>
                <Button size="sm" variant="secondary" className="flex-1 bg-orange-500/10 text-orange-600 border border-orange-500/20 hover:bg-orange-500/20 dark:bg-orange-900/40 dark:text-orange-400" onClick={handleApplyTemplate}>
                    Сгенерировать шаблон
                </Button>
            </div>

            {/* Meals by day */}
            {Array.from(days.entries()).sort(([a], [b]) => a - b).map(([day, dayMeals]) => (
                <div key={day} className="space-y-3">
                    <h3 className="font-semibold text-sm text-[var(--text-secondary)] ml-1">День {day}</h3>
                    <div className="space-y-3">
                        {dayMeals.map((meal) => (
                            <GlassCard key={meal.id} className="p-4 bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/10 pb-2">
                                    <span className="font-semibold text-sm text-[var(--text-primary)]">{mealTypeLabels[meal.mealType]}</span>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg text-blue-500" onClick={() => setShowAddProduct(meal.id)}>
                                            <Plus size={14} weight="bold" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"
                                            onClick={() => { deleteMeal(meal.id); if (projectId) fetchMeals(projectId); }}>
                                            <Trash size={14} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {meal.products?.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between text-sm group">
                                            <span className="text-[var(--text-primary)]">{p.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-[var(--text-muted)]">{p.gramsPerPerson}г</span>
                                                <span className="text-xs text-[var(--text-muted)]">{p.caloriesPer100g} ккал</span>
                                                <button onClick={() => { deleteProduct(p.id); if (projectId) { fetchMeals(projectId); fetchNutrition(projectId); } }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 transition-opacity">
                                                    <Trash size={12} weight="fill" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!meal.products || meal.products.length === 0) && (
                                        <p className="text-xs text-[var(--text-muted)] italic text-center py-2">Продукты не добавлены</p>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ))}

            {meals.length === 0 && !loading && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">🍽</div>
                    <div className="text-lg font-medium text-[var(--text-primary)]">План питания пуст</div>
                    <p className="text-sm text-[var(--text-secondary)]">Добавьте приемы пищи для расчета</p>
                </div>
            )}

            {/* Add Meal Modal */}
            <AnimatePresence>
                {showAddMeal && (
                    <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddMeal(false)}>
                        <motion.div className="bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-white/20 w-full rounded-t-[32px] p-6 pb-10 shadow-2xl"
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-1 bg-gray-300/50 rounded-full mx-auto mb-6" />
                            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Добавить Прием Пищи</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Номер дня</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number" min={1}
                                        value={mealForm.dayNumber} onChange={(e) => setMealForm({ ...mealForm, dayNumber: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Тип приема</label>
                                    <select className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" value={mealForm.mealType}
                                        onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value })}>
                                        <option value="breakfast">Завтрак</option>
                                        <option value="lunch">Обед</option>
                                        <option value="dinner">Ужин</option>
                                        <option value="snack">Перекус</option>
                                    </select>
                                </div>
                                <Button fullWidth size="lg" onClick={handleCreateMeal} className="mt-2">Добавить</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddProduct && (
                    <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddProduct(null)}>
                        <motion.div className="bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-white/20 w-full rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto shadow-2xl"
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-1 bg-gray-300/50 rounded-full mx-auto mb-6" />
                            <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Добавить Продукт</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Название продукта</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" placeholder="Напр. Овсянка"
                                        value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Грамм/чел</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number"
                                            value={productForm.gramsPerPerson} onChange={(e) => setProductForm({ ...productForm, gramsPerPerson: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Ккал/100г</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number"
                                            value={productForm.caloriesPer100g} onChange={(e) => setProductForm({ ...productForm, caloriesPer100g: parseFloat(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Белки</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number"
                                            value={productForm.protein} onChange={(e) => setProductForm({ ...productForm, protein: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Жиры</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number"
                                            value={productForm.fat} onChange={(e) => setProductForm({ ...productForm, fat: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Углеводы</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-black/5 dark:border-white/10 text-[var(--text-primary)] focus:bg-white/80 dark:focus:bg-black/40 transition-colors" type="number"
                                            value={productForm.carbs} onChange={(e) => setProductForm({ ...productForm, carbs: parseFloat(e.target.value) })} />
                                    </div>
                                </div>
                                <Button fullWidth size="lg" onClick={handleAddProduct} className="mt-2">Добавить Продукт</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
