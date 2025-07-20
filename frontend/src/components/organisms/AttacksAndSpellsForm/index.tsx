import { useState } from 'react';
import { Box, Grid, Typography, Button, Divider, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Add,
  AutoAwesome as AutoAwesomeIcon,
  SportsKabaddi as SportsKabaddiIcon,
} from '@mui/icons-material';
import { AttackForm } from './AttackForm';
import { Attack } from './AttackForm/index';
import { AttackCard } from './AttackCard';
import { MagicForm, Spell } from './MagicForm';
import { MagicCard } from './MagicCard';

export const AttacksAndSpellsForm = () => {
  const theme = useTheme();
  const { control } = useFormContext();
  const [showAttackForm, setShowAttackForm] = useState(false);
  const [showSpellForm, setShowSpellForm] = useState(false);

  const {
    fields: attackFields,
    append: appendAttack,
    remove: removeAttack,
  } = useFieldArray({
    control,
    name: 'attacks',
  });

  const {
    fields: spellFields,
    append: appendSpell,
    remove: removeSpell,
  } = useFieldArray({
    control,
    name: 'spells',
  });

  return (
    <Box
      component={motion.div}
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      {/* Ataques */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsKabaddiIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Ataques
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowAttackForm(true)}
            size="small"
            color="secondary"
          >
            Adicionar Ataque
          </Button>
        </Box>

        {attackFields.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Nenhum ataque adicionado ainda.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {attackFields.map((field, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={field.id}>
                <AttackCard
                  attack={field as unknown as Attack}
                  index={index}
                  removeAttack={removeAttack}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Formulário para adicionar ataque */}
        {showAttackForm && (
          <AttackForm
            setShowAttackForm={setShowAttackForm}
            appendAttack={appendAttack}
            attackFields={attackFields as unknown as Attack[]}
          />
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Magias */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
            <Typography variant="h6" fontWeight="bold" color="secondary.light">
              Magias
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setShowSpellForm(true)}
            size="small"
            color="secondary"
          >
            Adicionar Magia
          </Button>
        </Box>

        {spellFields.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Nenhuma magia adicionada ainda.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {spellFields.map((field, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={field.id}>
                <MagicCard
                  spell={field as unknown as Spell}
                  index={index}
                  removeSpell={removeSpell}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Formulário para adicionar magia */}
        {showSpellForm && (
          <MagicForm
            setShowSpellForm={setShowSpellForm}
            appendSpell={appendSpell}
            spellFields={spellFields as unknown as Spell[]}
          />
        )}
      </Box>
    </Box>
  );
};

AttacksAndSpellsForm.displayName = 'AttacksAndSpellsForm';
