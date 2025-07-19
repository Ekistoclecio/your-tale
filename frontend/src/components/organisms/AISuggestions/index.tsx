'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AutoAwesome, Casino, Landscape, PersonAdd } from '@mui/icons-material';
import { animationVariants } from '@/constants/animation';
import * as S from './styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Typography } from '@mui/material';

interface Suggestion {
  id: string;
  phrase: string;
  actions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    phrase: 'Posso criar um NPC para sua campanha atual.',
    actions: [
      {
        id: 'npc',
        label: 'Gerar NPC',
        icon: <PersonAdd />,
        onClick: () => console.log('Gerar NPC'),
      },
      {
        id: 'scenario',
        label: 'Descrever cenário',
        icon: <Landscape />,
        onClick: () => console.log('Descrever cenário'),
      },
      {
        id: 'event',
        label: 'Improvisar evento',
        icon: <Casino />,
        onClick: () => console.log('Improvisar evento'),
      },
    ],
  },
  {
    id: '2',
    phrase: 'Que tal adicionar um tesouro lendário à sua aventura?',
    actions: [
      {
        id: 'treasure',
        label: 'Criar tesouro',
        icon: <AutoAwesome />,
        onClick: () => console.log('Criar tesouro'),
      },
      {
        id: 'dungeon',
        label: 'Gerar masmorra',
        icon: <Landscape />,
        onClick: () => console.log('Gerar masmorra'),
      },
      {
        id: 'puzzle',
        label: 'Criar enigma',
        icon: <Casino />,
        onClick: () => console.log('Criar enigma'),
      },
    ],
  },
  {
    id: '3',
    phrase: 'Sua campanha precisa de um vilão memorável.',
    actions: [
      {
        id: 'villain',
        label: 'Criar vilão',
        icon: <PersonAdd />,
        onClick: () => console.log('Criar vilão'),
      },
      {
        id: 'lair',
        label: 'Covil do vilão',
        icon: <Landscape />,
        onClick: () => console.log('Covil do vilão'),
      },
      {
        id: 'plot',
        label: 'Arco narrativo',
        icon: <AutoAwesome />,
        onClick: () => console.log('Arco narrativo'),
      },
    ],
  },
];

export const AISuggestions = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const suggestion = suggestions[currentSuggestion];

  const handleSetCurrentSuggestion = (index: number) => {
    setCurrentSuggestion(index);
  };

  return (
    <motion.div {...animationVariants.fadeSlideIn} style={{ width: '100%' }}>
      <S.Container>
        <S.IconContainer>
          <AutoAwesomeIcon color="secondary" />
        </S.IconContainer>

        <S.Content>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSuggestion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            >
              <Typography variant="subtitle1">{suggestion.phrase}</Typography>
            </motion.div>
          </AnimatePresence>

          <S.ActionGroup>
            {suggestion.actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              >
                <S.ActionButton variant="outlined" startIcon={action.icon} onClick={action.onClick}>
                  {action.label}
                </S.ActionButton>
              </motion.div>
            ))}
          </S.ActionGroup>
        </S.Content>

        <S.IndicatorGroup>
          {suggestions.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}
              onClick={() => handleSetCurrentSuggestion(index)}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                animate={index === currentSuggestion ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <S.Indicator active={index === currentSuggestion} />
              </motion.div>
            </motion.div>
          ))}
        </S.IndicatorGroup>
      </S.Container>
    </motion.div>
  );
};
