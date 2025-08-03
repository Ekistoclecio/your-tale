import { alpha, Box, Grid, useTheme } from '@mui/material';
import { AttributeInput } from '@/components/molecules';

const attributes = [
  {
    name: 'character_sheet.attributes.strength',
    label: 'Força',
    abbreviation: 'FOR',
    color: '#d32f2f',
  },
  {
    name: 'character_sheet.attributes.dexterity',
    label: 'Destreza',
    abbreviation: 'DES',
    color: '#388e3c',
  },
  {
    name: 'character_sheet.attributes.constitution',
    label: 'Constituição',
    abbreviation: 'CON',
    color: '#f57c00',
  },
  {
    name: 'character_sheet.attributes.intelligence',
    label: 'Inteligência',
    abbreviation: 'INT',
    color: '#1976d2',
  },
  {
    name: 'character_sheet.attributes.wisdom',
    label: 'Sabedoria',
    abbreviation: 'SAB',
    color: '#7A6FA1',
  },
  {
    name: 'character_sheet.attributes.charisma',
    label: 'Carisma',
    abbreviation: 'CAR',
    color: '#c2185b',
  },
];

export const AttributesForm = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        background: '#664B70',
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.4)}`,
      }}
    >
      <Grid container spacing={2}>
        {attributes.map((attribute) => (
          <Grid size={{ xs: 12, sm: 6, md: 2 }} key={attribute.name}>
            <AttributeInput
              name={attribute.name}
              label={attribute.label}
              abbreviation={attribute.abbreviation}
              color={attribute.color}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

AttributesForm.displayName = 'AttributesForm';
