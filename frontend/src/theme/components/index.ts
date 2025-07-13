import { Components } from '@mui/material';
import { ButtonOverrides } from '@/theme/components/button';
import { CardOverrides } from '@/theme/components/card';
import { IconButtonOverrides } from '@/theme/components/iconButton';
import { InputLabelOverrides } from '@/theme/components/inputLabel';
import { OutlinedInputOverrides } from '@/theme/components/outlinedInput';
import { TextFieldOverrides } from '@/theme/components/textfield';
import { PaperOverrides } from '@/theme/components/paper';

export const components: Components = {
  MuiButton: ButtonOverrides,
  MuiCard: CardOverrides,
  MuiIconButton: IconButtonOverrides,
  MuiInputLabel: InputLabelOverrides,
  MuiOutlinedInput: OutlinedInputOverrides,
  MuiTextField: TextFieldOverrides,
  MuiPaper: PaperOverrides,
};
