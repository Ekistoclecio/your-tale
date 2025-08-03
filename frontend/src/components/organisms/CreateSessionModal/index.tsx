'use client';

import {
  DialogActions,
  Divider,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import {
  createSessionSchema,
  type CreateSessionFormData,
} from '@/schemas/form-validation/createSessionForm';
import Scroll from '@/assets/icons/scroll.svg';
import * as S from './styles';
import { BasicInfos } from '@/components/organisms/CreateSessionModal/BasicInfos';
import { AccessRules } from '@/components/organisms/CreateSessionModal/AccessRules';
import { SessionMasterConfig } from '@/components/organisms/CreateSessionModal/SessionMasterConfig';
import { Scheduling } from '@/components/organisms/CreateSessionModal/Scheduling';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useCreateSession } from '@/queries/session/mutation';
import { useRouter } from 'next/navigation';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateSessionModal = ({ open, onClose }: CreateSessionModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createSession } = useCreateSession();

  const methods = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      is_public: true,
      join_after_start: true,
      player_limit: 4,
      is_ai_master: false,
      ai_theme: '',
      ai_narrative_style: '',
      ai_campaign_description: '',
      start_date: null as unknown as Date,
    },
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = methods;

  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods.formState.errors]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateSessionFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const newSession = {
        title: data.title,
        description: data.description,
        is_public: data.is_public,
        join_after_start: data.join_after_start,
        player_limit: data.player_limit,
        is_ai_master: data.is_ai_master,
        start_date: data.start_date
          ? new Date(data.start_date).toISOString()
          : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };
      if (data.is_ai_master) {
        newSession.description = `
        Tema da história: ${data.ai_theme}
        Estilo narrativo que o mestre deve seguir: ${data.ai_narrative_style}
        Descrição introdutória da campanha: ${data.ai_campaign_description}. ${data.description}
        `;
      }
      console.log(newSession);
      const session = await createSession(newSession as unknown as CreateSessionFormData);
      router.push(`/session/${session.id}/create_character`);
      enqueueSnackbar('Sessão criada com sucesso', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao criar sessão', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <S.ModalContainer open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          <S.ModalContent>
            {/* Header */}
            <S.Header>
              <Scroll width={32} height={32} />
              <Typography variant="h4">Criar nova sessão</Typography>
            </S.Header>

            <Typography sx={{ mb: 3, textAlign: 'center' }}>
              Configure os detalhes da sua aventura antes de convidar seus aliados.
            </Typography>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormProvider {...methods}>
                <S.ContentContainer direction={isMobile ? 'column' : 'row'} spacing={3}>
                  {/* Coluna Esquerda */}
                  <S.ContentColumn>
                    {/* Seção: Informações Gerais */}
                    <S.Section>
                      <S.SectionTitle variant="h6">
                        <BookIcon sx={{ mr: 1 }} />
                        Informações Gerais
                      </S.SectionTitle>
                      <BasicInfos />
                    </S.Section>

                    {/* Seção: Regras e Acesso */}
                    <S.Section>
                      <S.SectionTitle variant="h6">
                        <GroupIcon sx={{ mr: 1 }} />
                        Regras e Acesso
                      </S.SectionTitle>
                      <AccessRules />
                    </S.Section>
                  </S.ContentColumn>

                  {/* Coluna Direita */}
                  <S.ContentColumn>
                    {/* Seção: Mestre da Sessão */}
                    <S.Section>
                      <S.SectionTitle variant="h6">
                        <PersonIcon sx={{ mr: 1 }} />
                        Mestre da Sessão
                      </S.SectionTitle>
                      <SessionMasterConfig />
                    </S.Section>

                    {/* Seção: Agendamento */}
                    <S.Section>
                      <S.SectionTitle variant="h6">
                        <ScheduleIcon sx={{ mr: 1 }} />
                        Agendamento
                      </S.SectionTitle>
                      <Scheduling />
                    </S.Section>
                  </S.ContentColumn>
                </S.ContentContainer>

                {/* Footer */}
                <Divider sx={{ my: 3 }} />

                <DialogActions sx={{ px: 0 }}>
                  <S.CancelButton
                    animationVariant="subtleBounce"
                    variant="text"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancelar
                  </S.CancelButton>

                  <S.SubmitButton
                    variant="contained"
                    type="submit"
                    disabled={loading || !isValid}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Criando...' : 'Criar Sessão'}
                  </S.SubmitButton>
                </DialogActions>
              </FormProvider>
            </form>
          </S.ModalContent>
        </motion.div>
      </S.ModalContainer>
    </AnimatePresence>
  );
};
