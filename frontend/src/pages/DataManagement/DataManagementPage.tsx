import { useNavigate } from 'react-router-dom';

export function DataManagementPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 1rem',
            boxSizing: 'border-box',
            overflowY: 'auto'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '600px',
                padding: '2.5rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Политика обработки данных
                    </h1>
                    <button 
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'rgba(0,0,0,0.05)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: 'var(--text-secondary)'
                        }}
                    >
                        Назад
                    </button>
                </div>

                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    <p>Данный документ описывает, как «Походный Сборщик» обрабатывает и хранит данные пользователей. Приложение разработано с приоритетом на безопасность и минимальный сбор персональной информации.</p>

                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Авторизация и Пароли</h2>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><b>Без паролей:</b> Приложение <b>не хранит</b> и не запрашивает пароли пользователей.</li>
                        <li style={{ marginBottom: '0.5rem' }}><b>OAuth 2.0:</b> Для входа используются доверенные сервисы-провайдеры (Yandex ID и Mail.ru ID).</li>
                        <li><b>Безопасность:</b> При авторизации мы получаем от провайдера только уникальный идентификатор и базовую информацию (имя, почта), необходимую для работы личного кабинета.</li>
                    </ul>

                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Хранение данных</h2>
                    <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><b>База данных:</b> Все данные (походы, списки снаряжения, меню) хранятся в защищенной облачной базе данных на платформе Railway.</li>
                        <li><b>Персональные данные:</b> В базе хранятся:
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                <li>Имя и фамилия (указанные в профиле)</li>
                                <li>Электронная почта</li>
                                <li>Вес (необходим для расчета нагрузки на рюкзак)</li>
                                <li>Пол и возраст (расчет калорийности питания)</li>
                            </ul>
                        </li>
                    </ul>

                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Проекты и Совместный доступ</h2>
                    <p>Данные о походах являются приватными и доступны только создателю проекта и участникам, присоединившимся по уникальной ссылке или коду приглашения.</p>

                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Удаление данных</h2>
                    <p>Пользователь имеет право в любой момент удалить свой аккаунт или созданные им проекты. При удалении проекта все связанные с ним данные стираются из базы данных.</p>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '2rem 0 1rem 0' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-caption)', textAlign: 'center' }}>
                        Приложение разработано в соответствии с концепцией безопасного планирования спортивных туристических походов.
                    </p>
                </div>
            </div>
        </div>
    );
}
