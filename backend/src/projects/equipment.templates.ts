export const equipmentTemplates: Record<string, { category: string; name: string; weight: number; isGroupItem: boolean }[]> = {
    // Hiking Summer
    'hiking_summer': [
        { category: 'Одежда', name: 'Треккинговые ботинки', weight: 1.2, isGroupItem: false },
        { category: 'Одежда', name: 'Влагозащитная куртка', weight: 0.4, isGroupItem: false },
        { category: 'Лагерь', name: 'Палатка 2-местная', weight: 2.5, isGroupItem: true },
        { category: 'Сон', name: 'Спальник (летний)', weight: 0.8, isGroupItem: false },
        { category: 'Снаряжение', name: 'Треккинговые палки', weight: 0.5, isGroupItem: false },
        { category: 'Аптечка', name: 'Индивидуальная аптечка', weight: 0.3, isGroupItem: false },
    ],
    // Hiking Winter
    'hiking_winter': [
        { category: 'Одежда', name: 'Зимние ботинки', weight: 1.5, isGroupItem: false },
        { category: 'Одежда', name: 'Пуховик', weight: 0.8, isGroupItem: false },
        { category: 'Одежда', name: 'Термобелье', weight: 0.3, isGroupItem: false },
        { category: 'Сон', name: 'Спальник (зимний, -15)', weight: 1.8, isGroupItem: false },
        { category: 'Лагерь', name: 'Зимняя палатка', weight: 3.5, isGroupItem: true },
        { category: 'Снаряжение', name: 'Снегоступы', weight: 1.2, isGroupItem: false },
    ],
    // Ski Winter
    'ski_winter': [
        { category: 'Снаряжение', name: 'Лыжи туристические', weight: 2.5, isGroupItem: false },
        { category: 'Снаряжение', name: 'Лыжные палки', weight: 0.5, isGroupItem: false },
        { category: 'Снаряжение', name: 'Лыжная мазь', weight: 0.2, isGroupItem: true },
        { category: 'Одежда', name: 'Ветрозащитный костюм', weight: 0.9, isGroupItem: false },
        { category: 'Сон', name: 'Зимний спальник', weight: 1.8, isGroupItem: false },
        { category: 'Лагерь', name: 'Печка-щепочница', weight: 1.2, isGroupItem: true },
    ],
    // Water Summer
    'water_summer': [
        { category: 'Снаряжение', name: 'Спасжилет', weight: 0.8, isGroupItem: false },
        { category: 'Снаряжение', name: 'Весло', weight: 1.0, isGroupItem: false },
        { category: 'Снаряжение', name: 'Гермомешок 50л', weight: 0.5, isGroupItem: false },
        { category: 'Снаряжение', name: 'Катамаран/Байдарка', weight: 15.0, isGroupItem: true },
        { category: 'Одежда', name: 'Неопреновые носки', weight: 0.2, isGroupItem: false },
        { category: 'Одежда', name: 'Влагозащитный костюм', weight: 0.6, isGroupItem: false },
    ],
};

// Fallback general items if specific combo is not found
export const defaultEquipment = [
    { category: 'Сон', name: 'Спальник', weight: 1.0, isGroupItem: false },
    { category: 'Сон', name: 'Коврик-пенка', weight: 0.4, isGroupItem: false },
    { category: 'Снаряжение', name: 'Рюкзак', weight: 1.5, isGroupItem: false },
    { category: 'Еда', name: 'КЛМН (Кружка, ложка, миска, нож)', weight: 0.3, isGroupItem: false },
    { category: 'Лагерь', name: 'Палатка', weight: 3.0, isGroupItem: true },
    { category: 'Лагерь', name: 'Котелок', weight: 0.8, isGroupItem: true }
];
