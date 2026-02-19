import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash, Fire } from '@phosphor-icons/react';
import { useMealStore } from '../../store/mealStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const mealTypeLabels: Record<string, string> = {
    breakfast: '🌅 Завтрак', lunch: '☀️ Обед', dinner: '🌙 Ужин', snack: '🍎 Перекус',
};

export function MealsPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { meals, nutrition, loading, fetchMeals, createMeal, deleteMeal, addProduct, deleteProduct, fetchNutrition } = useMealStore();
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
        <div className="min-h-screen pb-24 pt-4 px-4 space-y-6">
            <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors text-white mb-2"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1C1C1E] mb-1">🍽 Питание</h1>
                <p className="text-[#1C1C1E]/60 text-sm">Планировщик раскладки</p>
            </div>

            {/* Nutrition summary */}
            {nutrition && (
                <GlassCard className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50">
                    <div className="flex items-center gap-2 mb-3 text-orange-600">
                        <Fire size={18} weight="fill" />
                        <span className="font-semibold text-sm">Общая нутриция</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Ккал</div>
                            <div className="font-bold text-gray-800">{Math.round(nutrition.totals?.calories || 0)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Белки</div>
                            <div className="font-bold text-gray-800">{Math.round(nutrition.totals?.protein || 0)}г</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Жиры</div>
                            <div className="font-bold text-gray-800">{Math.round(nutrition.totals?.fat || 0)}г</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Углев</div>
                            <div className="font-bold text-gray-800">{Math.round(nutrition.totals?.carbs || 0)}г</div>
                        </div>
                    </div>
                    <div className="text-xs text-center mt-3 text-orange-600/70 font-medium bg-orange-200/20 py-1 rounded-lg">
                        Общий вес: {nutrition.totals?.weightKg || 0} кг • {nutrition.memberCount} участников
                    </div>
                </GlassCard>
            )}

            <Button size="sm" fullWidth onClick={() => setShowAddMeal(true)}>
                <Plus size={16} className="mr-2" /> Добавить приём пищи
            </Button>

            {/* Meals by day */}
            {Array.from(days.entries()).sort(([a], [b]) => a - b).map(([day, dayMeals]) => (
                <div key={day} className="space-y-3">
                    <h3 className="font-semibold text-sm text-gray-500 ml-1">День {day}</h3>
                    <div className="space-y-3">
                        {dayMeals.map((meal) => (
                            <GlassCard key={meal.id} className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                    <span className="font-semibold text-sm text-gray-800">{mealTypeLabels[meal.mealType]}</span>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-500" onClick={() => setShowAddProduct(meal.id)}>
                                            <Plus size={14} weight="bold" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                                            onClick={() => { deleteMeal(meal.id); if (projectId) fetchMeals(projectId); }}>
                                            <Trash size={14} weight="bold" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {meal.products?.map((p) => (
                                        <div key={p.id} className="flex items-center justify-between text-sm group">
                                            <span className="text-gray-700">{p.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400">{p.gramsPerPerson}г/чел</span>
                                                <span className="text-xs text-gray-400">{p.caloriesPer100g} ккал/100г</span>
                                                <button onClick={() => { deleteProduct(p.id); if (projectId) { fetchMeals(projectId); fetchNutrition(projectId); } }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity">
                                                    <Trash size={12} weight="fill" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!meal.products || meal.products.length === 0) && (
                                        <p className="text-xs text-gray-400 italic text-center py-2">Нет продуктов</p>
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
                    <div className="text-lg font-medium text-gray-900">Раскладка пуста</div>
                    <p className="text-sm text-gray-500">Добавьте приёмы пищи по дням</p>
                </div>
            )}

            {/* Add Meal Modal */}
            <AnimatePresence>
                {showAddMeal && (
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddMeal(false)}>
                        <motion.div className="bg-white w-full rounded-t-[32px] p-6 pb-10"
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                            <h2 className="text-xl font-bold mb-6">Добавить приём пищи</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-1 block">День</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number" min={1}
                                        value={mealForm.dayNumber} onChange={(e) => setMealForm({ ...mealForm, dayNumber: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-1 block">Тип</label>
                                    <select className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" value={mealForm.mealType}
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
                    <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-end"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddProduct(null)}>
                        <motion.div className="bg-white w-full rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                            <h2 className="text-xl font-bold mb-6">Добавить продукт</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-1 block">Название</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Гречка, макароны..."
                                        value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Граммы/чел</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number"
                                            value={productForm.gramsPerPerson} onChange={(e) => setProductForm({ ...productForm, gramsPerPerson: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Ккал/100г</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number"
                                            value={productForm.caloriesPer100g} onChange={(e) => setProductForm({ ...productForm, caloriesPer100g: parseFloat(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Белки</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number"
                                            value={productForm.protein} onChange={(e) => setProductForm({ ...productForm, protein: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Жиры</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number"
                                            value={productForm.fat} onChange={(e) => setProductForm({ ...productForm, fat: parseFloat(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Углев</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200" type="number"
                                            value={productForm.carbs} onChange={(e) => setProductForm({ ...productForm, carbs: parseFloat(e.target.value) })} />
                                    </div>
                                </div>
                                <Button fullWidth size="lg" onClick={handleAddProduct} className="mt-2">Добавить продукт</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
