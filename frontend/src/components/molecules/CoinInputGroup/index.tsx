'use client';

import { Grid, TextField } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTheme } from '@mui/material/styles';

import { Wrapper, Header, HeaderTitle, CoinFieldWrapper, CoinIcon } from './styles';
import { useFormContext } from 'react-hook-form';

const coinConfig = [
  { name: 'character_sheet.coins.copper', label: 'Cobre (CP)', color: '#b87333', icon: '🟫' },
  { name: 'character_sheet.coins.silver', label: 'Prata (PP)', color: '#c0c0c0', icon: '⚪' },
  { name: 'character_sheet.coins.electrum', label: 'Electro (EP)', color: '#ffd700', icon: '🟡' },
  { name: 'character_sheet.coins.gold', label: 'Ouro (PO)', color: '#ffd700', icon: '🟡' },
  { name: 'character_sheet.coins.platinum', label: 'Platina (PP)', color: '#e5e4e2', icon: '⚪' },
];

export const CoinInputGroup = () => {
  const theme = useTheme();
  const { register } = useFormContext();

  return (
    <Wrapper>
      <Header>
        <MonetizationOnIcon fontSize="medium" sx={{ color: theme.palette.secondary.light }} />
        <HeaderTitle>Moedas</HeaderTitle>
      </Header>

      <Grid container spacing={2}>
        {coinConfig.map((coin) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={coin.name}>
            <CoinFieldWrapper>
              <CoinIcon sx={{ color: coin.color }}>{coin.icon}</CoinIcon>
              <TextField
                {...register(coin.name, { valueAsNumber: true })}
                label={coin.label}
                type="number"
                fullWidth
                size="small"
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
            </CoinFieldWrapper>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

CoinInputGroup.displayName = 'CoinInputGroup';
