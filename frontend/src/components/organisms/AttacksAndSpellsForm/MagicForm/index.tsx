import {
  Grid,
  MenuItem,
  Button,
  useTheme,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { StyledCard, HeaderBox, HeaderTitle, ActionsBox } from '../formStyles';

const spellSchools = [
  'Abjuração',
  'Conjuração',
  'Divinação',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
];

export interface Spell {
  name: string;
  level: number;
  school: string;
  prepared: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

interface MagicFormProps {
  setShowSpellForm: (show: boolean) => void;
  appendSpell: (spell: Spell) => void;
  spellFields: Spell[];
}

export const MagicForm = ({ setShowSpellForm, appendSpell, spellFields }: MagicFormProps) => {
  const theme = useTheme();
  const { register, control } = useFormContext();
  const handleAddSpell = () => {
    appendSpell({
      name: '',
      level: 0,
      school: 'Evocação',
      prepared: false,
      castingTime: '',
      range: '',
      components: '',
      duration: '',
      description: '',
    });
    setShowSpellForm(false);
  };
  return (
    <StyledCard>
      <HeaderBox>
        <AutoFixHighIcon sx={{ color: theme.palette.secondary.light }} />
        <HeaderTitle>Nova Magia</HeaderTitle>
      </HeaderBox>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.name`)}
            label="Nome da Magia"
            placeholder="ex: Bola de Fogo"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.level`)}
            label="Nível"
            type="number"
            slotProps={{
              htmlInput: {
                min: 0,
                max: 9,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name={`spells.${spellFields.length}.school`}
            control={control}
            defaultValue={spellSchools[0]} // ou '' se preferir iniciar vazio
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id={`spell-school-label-${spellFields.length}`}>Escola</InputLabel>
                <Select
                  {...field}
                  labelId={`spell-school-label-${spellFields.length}`}
                  label="Escola"
                >
                  {spellSchools.map((school) => (
                    <MenuItem key={school} value={school}>
                      {school}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.castingTime`)}
            label="Tempo de Conjuração"
            placeholder="ex: 1 ação"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.range`)}
            label="Alcance"
            placeholder="ex: 150 pés"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.components`)}
            label="Componentes"
            placeholder="ex: V, S, M"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            {...register(`spells.${spellFields.length}.duration`)}
            label="Duração"
            placeholder="ex: Instantânea"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register(`spells.${spellFields.length}.description`)}
            label="Descrição"
            placeholder="Descrição da magia"
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
      <ActionsBox>
        <Button variant="contained" onClick={handleAddSpell}>
          Adicionar
        </Button>
        <Button variant="outlined" onClick={() => setShowSpellForm(false)}>
          Cancelar
        </Button>
      </ActionsBox>
    </StyledCard>
  );
};
