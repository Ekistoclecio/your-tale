import Flag from '@/assets/icons/flag.svg';
import Battle from '@/assets/icons/battle.svg';
import AiRobo from '@/assets/icons/ai-robo.svg';
import Schedule from '@/assets/icons/schedule.svg';
import PersonIcon from '@mui/icons-material/Person';

export const BadgeVariants = {
  active: {
    label: 'Ativa',
    color: 'success' as const,
    icon: Battle,
  },
  ended: {
    label: 'Encerrada',
    color: 'default' as const,
    icon: Flag,
  },
  not_started: {
    label: 'Agendada',
    color: 'warning' as const,
    icon: Schedule,
  },
  ai: {
    label: 'Mestre: IA',
    color: 'info' as const,
    icon: AiRobo,
  },
  human: {
    label: 'Mestre: Humano',
    color: 'secondary' as const,
    icon: PersonIcon,
  },
};
