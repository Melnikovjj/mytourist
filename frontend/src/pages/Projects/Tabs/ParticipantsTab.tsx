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

            <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)]">
                    Код приглашения: <span className="font-mono font-bold text-[var(--text-primary)] select-all">{currentProject.inviteCode}</span>
                </p>
            </div>
        </div>
    );
}
