import { useProjectStore } from '../../../store/projectStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Crown, ShieldCheck, User } from '@phosphor-icons/react';

export function ParticipantsTab() {
    const { currentProject } = useProjectStore();

    if (!currentProject) return null;

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner': return <Crown size={14} weight="fill" className="text-yellow-500" />;
            case 'editor': return <ShieldCheck size={14} weight="fill" className="text-blue-500" />;
            default: return <User size={14} />;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'owner': return 'Организатор';
            case 'editor': return 'Участник'; // Simplification
            case 'viewer': return 'Наблюдатель';
            default: return role;
        }
    };

    return (
        <div className="space-y-4">
            <GlassCard className="p-4 bg-white/40 dark:bg-white/5">
                <h3 className="font-semibold text-[var(--text-primary)] mb-4">Участники ({currentProject.members.length})</h3>

                <div className="space-y-3">
                    {currentProject.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <Avatar
                                src={member.user.avatarUrl}
                                fallback={member.user.firstName?.[0] || member.user.username?.[0] || '?'}
                                size="md"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-[var(--text-primary)]">
                                    {member.user.firstName || member.user.username || 'Без имени'} {member.user.lastName}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                    {getRoleIcon(member.role)}
                                    {getRoleLabel(member.role)}
                                </div>
                            </div>
                            {member.user.telegramId && (
                                <Badge variant="outline" className="text-[10px] opacity-70">
                                    TG
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </GlassCard>

            <div className="flex flex-col gap-3 items-center">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-full text-center">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Код приглашения:</p>
                    <p className="font-mono font-bold text-[var(--text-primary)] text-lg select-all mb-2">{currentProject.inviteCode}</p>
                    <button 
                        onClick={() => {
                            const link = `${window.location.origin}/join/${currentProject.inviteCode}`;
                            navigator.clipboard.writeText(link);
                            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
                            alert('Ссылка для вступления скопирована!');
                        }}
                        className="text-xs text-blue-500 font-bold uppercase tracking-wider hover:underline"
                    >
                        Копировать ссылку для вступления
                    </button>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] text-center px-4">
                    Отправьте этот код или ссылку друзьям, чтобы они могли присоединиться к вашему походу.
                </p>
            </div>
        </div>
    );
}
