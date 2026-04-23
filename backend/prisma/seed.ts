import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ── Equipment Catalog ─────────────────────────────
    const equipmentData = [
        // Укрытие
        { name: 'Палатка 2-местная', weight: 2.5, category: 'Укрытие', isGroupItem: true },
        { name: 'Палатка 3-местная', weight: 3.2, category: 'Укрытие', isGroupItem: true },
        { name: 'Тент', weight: 0.8, category: 'Укрытие', isGroupItem: true },
        { name: 'Колышки для палатки', weight: 0.3, category: 'Укрытие', isGroupItem: true },

        // Сон
        { name: 'Спальный мешок (лето)', weight: 1.0, category: 'Сон', isGroupItem: false },
        { name: 'Спальный мешок (зима)', weight: 2.0, category: 'Сон', isGroupItem: false },
        { name: 'Каремат', weight: 0.4, category: 'Сон', isGroupItem: false },
        { name: 'Надувной коврик', weight: 0.6, category: 'Сон', isGroupItem: false },
        { name: 'Подушка надувная', weight: 0.1, category: 'Сон', isGroupItem: false },

        // Кухня
        { name: 'Горелка газовая', weight: 0.3, category: 'Кухня', isGroupItem: true },
        { name: 'Газовый баллон 230г', weight: 0.37, category: 'Кухня', isGroupItem: true },
        { name: 'Котелок 2л', weight: 0.4, category: 'Кухня', isGroupItem: true },
        { name: 'Кружка', weight: 0.1, category: 'Кухня', isGroupItem: false },
        { name: 'Ложка/вилка', weight: 0.05, category: 'Кухня', isGroupItem: false },
        { name: 'Нож', weight: 0.15, category: 'Кухня', isGroupItem: false },
        { name: 'Термос 1л', weight: 0.5, category: 'Кухня', isGroupItem: false },
        { name: 'Бутылка для воды', weight: 0.15, category: 'Кухня', isGroupItem: false },
        { name: 'Фильтр для воды', weight: 0.3, category: 'Кухня', isGroupItem: true },

        // Навигация
        { name: 'Компас', weight: 0.05, category: 'Навигация', isGroupItem: false },
        { name: 'Карта', weight: 0.1, category: 'Навигация', isGroupItem: true },
        { name: 'GPS-навигатор', weight: 0.2, category: 'Навигация', isGroupItem: true },

        // Одежда
        { name: 'Дождевик', weight: 0.3, category: 'Одежда', isGroupItem: false },
        { name: 'Флисовая куртка', weight: 0.4, category: 'Одежда', isGroupItem: false },
        { name: 'Мембранная куртка', weight: 0.5, category: 'Одежда', isGroupItem: false },
        { name: 'Треккинговые ботинки', weight: 1.2, category: 'Одежда', isGroupItem: false },
        { name: 'Сменные носки (пара)', weight: 0.08, category: 'Одежда', isGroupItem: false },
        { name: 'Шапка/бафф', weight: 0.05, category: 'Одежда', isGroupItem: false },
        { name: 'Перчатки', weight: 0.1, category: 'Одежда', isGroupItem: false },

        // Разное
        { name: 'Рюкзак 60л', weight: 1.8, category: 'Разное', isGroupItem: false },
        { name: 'Фонарик налобный', weight: 0.1, category: 'Разное', isGroupItem: false },
        { name: 'Батарейки запасные', weight: 0.1, category: 'Разное', isGroupItem: false },
        { name: 'Репеллент', weight: 0.15, category: 'Разное', isGroupItem: true },
        { name: 'Солнцезащитный крем', weight: 0.1, category: 'Разное', isGroupItem: true },
        { name: 'Верёвка 10м', weight: 0.3, category: 'Разное', isGroupItem: true },
        { name: 'Гермомешок', weight: 0.15, category: 'Разное', isGroupItem: false },
        { name: 'Треккинговые палки', weight: 0.5, category: 'Разное', isGroupItem: false },
        { name: 'Сидушка', weight: 0.05, category: 'Разное', isGroupItem: false },

        // Аптечка (Групповая)
        { name: 'Перчатки медицинские (4 пары)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Маска медицинская (6 шт)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Кровоостанавливающий жгут (Эсмарха)', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Бинты марлевые (5 шт разного размера)', weight: 0.15, category: 'Аптечка', isGroupItem: true },
        { name: 'Косынка медицинская', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Салфетки стерильные (2 пачки)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Спиртовые салфетки (20 шт)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Бинт эластичный', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Гемостатическая губка', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Гипотермический охлаждающий пакет', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Термоодеяло', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Ножницы Листера', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Лейкопластырь рулонный / бактерицидный', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Хлоргексидин / Антисептик', weight: 0.2, category: 'Аптечка', isGroupItem: true },
        { name: 'Обезболивающие (Анальгин/Цитрамон/Ибупрофен)', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Спазмолитики (Дротаверин/Но-шпа)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'ЖКТ (Лоперамид/Смекта/Полисорб)', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Мази (Вольтарен/Декспантенол)', weight: 0.1, category: 'Аптечка', isGroupItem: true },
        { name: 'Антигистаминные (Лоратадин)', weight: 0.05, category: 'Аптечка', isGroupItem: true },
        { name: 'Термометр медицинский', weight: 0.05, category: 'Аптечка', isGroupItem: true },

        // Аптечка (Личная)
        { name: 'Личная аптечка (Бинт, пластырь, таблетки)', weight: 0.2, category: 'Аптечка', isGroupItem: false },

        // Зимнее
        { name: 'Лыжи', weight: 3.5, category: 'Зимнее', isGroupItem: false },
        { name: 'Снегоступы', weight: 2.0, category: 'Зимнее', isGroupItem: false },
        { name: 'Термобельё комплект', weight: 0.4, category: 'Зимнее', isGroupItem: false },

        // Водное
        { name: 'Спасательный жилет', weight: 0.8, category: 'Водное', isGroupItem: false },
        { name: 'Весло', weight: 1.0, category: 'Водное', isGroupItem: false },
        { name: 'Гидрокостюм', weight: 1.5, category: 'Водное', isGroupItem: false },
    ];

    for (const item of equipmentData) {
        const existing = await prisma.equipmentItem.findFirst({
            where: { name: item.name }
        });
        if (!existing) {
            await prisma.equipmentItem.create({ data: item });
        }
    }

    console.log(`✅ Created ${equipmentData.length} equipment items`);
    console.log('🌱 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
