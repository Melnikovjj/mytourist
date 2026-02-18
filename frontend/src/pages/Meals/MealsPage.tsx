import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash, Fire } from '@phosphor-icons/react';
import { useMealStore } from '../../store/mealStore';

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
        <div className="page">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(`/project/${projectId}`)}>
                <ArrowLeft size={16} /> Назад
            </button>

            <div className="page-header">
                <h1 className="page-title">🍽 Питание</h1>
                <p className="page-subtitle">Планировщик раскладки</p>
            </div>

            {/* Nutrition summary */}
            {nutrition && (
                <div className="glass-card-static" style={{ padding: '16px', marginBottom: '20px' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Fire size={18} color="var(--color-warning)" />
                        <span className="font-semibold text-sm">Общая нутриция</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="text-xs text-muted">Ккал</div>
                            <div className="font-bold">{Math.round(nutrition.totals?.calories || 0)}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="text-xs text-muted">Белки</div>
                            <div className="font-bold">{Math.round(nutrition.totals?.protein || 0)}г</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="text-xs text-muted">Жиры</div>
                            <div className="font-bold">{Math.round(nutrition.totals?.fat || 0)}г</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div className="text-xs text-muted">Углев</div>
                            <div className="font-bold">{Math.round(nutrition.totals?.carbs || 0)}г</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted mt-2" style={{ textAlign: 'center' }}>
                        Общий вес: {nutrition.totals?.weightKg || 0} кг • {nutrition.memberCount} участников
                    </div>
                </div>
            )}

            <button className="btn btn-accent btn-sm btn-full mb-3" onClick={() => setShowAddMeal(true)}>
                <Plus size={16} /> Добавить приём пищи
            </button>

            {/* Meals by day */}
            {Array.from(days.entries()).sort(([a], [b]) => a - b).map(([day, dayMeals]) => (
                <div key={day} style={{ marginBottom: '20px' }}>
                    <h3 className="font-semibold mb-2">День {day}</h3>
                    <div className="list-gap">
                        {dayMeals.map((meal) => (
                            <motion.div key={meal.id} className="glass-card-static" style={{ padding: '16px' }}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">{mealTypeLabels[meal.mealType]}</span>
                                    <div className="flex gap-2">
                                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}
                                            onClick={() => setShowAddProduct(meal.id)}>
                                            <Plus size={14} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}
                                            onClick={() => { deleteMeal(meal.id); if (projectId) fetchMeals(projectId); }}>
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                </div>
                                {meal.products?.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between" style={{ padding: '6px 0', borderTop: '1px solid var(--glass-border)' }}>
                                        <span className="text-sm">{p.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted">{p.gramsPerPerson}г/чел</span>
                                            <span className="text-xs text-secondary">{p.caloriesPer100g} ккал/100г</span>
                                            <button onClick={() => { deleteProduct(p.id); if (projectId) { fetchMeals(projectId); fetchNutrition(projectId); } }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}>
                                                <Trash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!meal.products || meal.products.length === 0) && (
                                    <p className="text-xs text-muted" style={{ padding: '8px 0' }}>Нет продуктов</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {meals.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-state-icon">🍽</div>
                    <div className="empty-state-title">Раскладка пуста</div>
                    <div className="empty-state-text">Добавьте приёмы пищи по дням</div>
                </div>
            )}

            {/* Add Meal Modal */}
            <AnimatePresence>
                {showAddMeal && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddMeal(false)}>
                        <motion.div className="modal-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-handle" />
                            <h2 className="modal-title">Добавить приём пищи</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="input-label">День</label>
                                    <input className="input" type="number" min={1} value={mealForm.dayNumber}
                                        onChange={(e) => setMealForm({ ...mealForm, dayNumber: parseInt(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Тип</label>
                                    <select className="select" value={mealForm.mealType}
                                        onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value })}>
                                        <option value="breakfast">Завтрак</option>
                                        <option value="lunch">Обед</option>
                                        <option value="dinner">Ужин</option>
                                        <option value="snack">Перекус</option>
                                    </select>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-full btn-lg mt-4" onClick={handleCreateMeal}>
                                Добавить
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddProduct && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowAddProduct(null)}>
                        <motion.div className="modal-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-handle" />
                            <h2 className="modal-title">Добавить продукт</h2>
                            <div className="form-group">
                                <label className="input-label">Название</label>
                                <input className="input" placeholder="Гречка, макароны..." value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="input-label">Граммы/чел</label>
                                    <input className="input" type="number" value={productForm.gramsPerPerson}
                                        onChange={(e) => setProductForm({ ...productForm, gramsPerPerson: parseFloat(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Ккал/100г</label>
                                    <input className="input" type="number" value={productForm.caloriesPer100g}
                                        onChange={(e) => setProductForm({ ...productForm, caloriesPer100g: parseFloat(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="input-label">Белки</label>
                                    <input className="input" type="number" value={productForm.protein}
                                        onChange={(e) => setProductForm({ ...productForm, protein: parseFloat(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Жиры</label>
                                    <input className="input" type="number" value={productForm.fat}
                                        onChange={(e) => setProductForm({ ...productForm, fat: parseFloat(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Углев</label>
                                    <input className="input" type="number" value={productForm.carbs}
                                        onChange={(e) => setProductForm({ ...productForm, carbs: parseFloat(e.target.value) })} />
                                </div>
                            </div>
                            <button className="btn btn-primary btn-full btn-lg mt-4" onClick={handleAddProduct}>
                                Добавить продукт
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
