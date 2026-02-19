declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name?: string;
                        last_name?: string;
                        username?: string;
                        photo_url?: string;
                    };
                    start_param?: string;
                };
                ready: () => void;
                expand: () => void;
                close: () => void;
                colorScheme: 'light' | 'dark';
                themeParams: Record<string, string>;
                MainButton: {
                    text: string;
                    show: () => void;
                    hide: () => void;
                    onClick: (cb: () => void) => void;
                    offClick: (cb: () => void) => void;
                    enable: () => void;
                    disable: () => void;
                    showProgress: (leaveActive?: boolean) => void;
                    hideProgress: () => void;
                    isVisible: boolean;
                    isActive: boolean;
                    setText: (text: string) => void;
                };
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (cb: () => void) => void;
                    offClick: (cb: () => void) => void;
                };
                HapticFeedback: {
                    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
                    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
                    selectionChanged: () => void;
                };
            };
        };
    }
}

export interface User {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    weight: number | null;
    isOnboarded: boolean;
    experienceLevel: string | null;
    inviteCode?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string | null;
    type: 'hiking' | 'ski' | 'water';
    season: 'winter' | 'spring' | 'summer' | 'autumn';
    startDate: string | null;
    endDate: string | null;
    inviteCode: string | null;
    ownerId: string;
    createdAt: string;
    members: ProjectMember[];
    readiness?: number;
    role?: string;
}

export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    role: 'owner' | 'editor' | 'viewer';
    user: User;
}

export interface EquipmentItem {
    id: string;
    name: string;
    weight: number;
    category: string;
    isGroupItem: boolean;
}

export interface ProjectEquipment {
    id: string;
    projectId: string;
    equipmentId: string;
    assignedToId: string | null;
    status: 'planned' | 'packed';
    customWeight: number | null;
    equipment: EquipmentItem;
    assignedTo: User | null;
}

export interface Meal {
    id: string;
    projectId: string;
    dayNumber: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    products: MealProduct[];
}

export interface MealProduct {
    id: string;
    mealId: string;
    name: string;
    gramsPerPerson: number;
    caloriesPer100g: number;
    protein: number;
    fat: number;
    carbs: number;
}

export interface ChecklistItem {
    id: string;
    type: 'equipment' | 'food';
    name: string;
    assignedTo?: string;
    assignedToName?: string;
    checked: boolean;
    category?: string;
    weight?: number;
}

export interface WeightReport {
    members: MemberWeight[];
    summary: {
        totalEquipmentWeight: number;
        totalFoodWeight: number;
        totalWeight: number;
        averagePerPerson: number;
    };
}

export interface MemberWeight {
    userId: string;
    userName: string;
    userWeight: number;
    equipmentWeight: number;
    foodWeight: number;
    totalWeight: number;
    maxWeight: number;
    isOverloaded: boolean;
    loadPercentage: number;
}

export interface Notification {
    id: string;
    userId: string;
    projectId: string | null;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
