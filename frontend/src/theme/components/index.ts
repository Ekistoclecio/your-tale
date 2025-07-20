import { Components } from '@mui/material';
import { ButtonOverrides } from '@/theme/components/button';
import { CardOverrides } from '@/theme/components/card';
import { IconButtonOverrides } from '@/theme/components/iconButton';
import { InputLabelOverrides } from '@/theme/components/inputLabel';
import { OutlinedInputOverrides } from '@/theme/components/outlinedInput';
import { TextFieldOverrides } from '@/theme/components/textfield';
import { PaperOverrides } from '@/theme/components/paper';
import { LinkOverrides } from '@/theme/components/link';
import { ToggleButtonOverrides } from '@/theme/components/toggleButton';
import { SwitchOverrides } from '@/theme/components/switch';
import { SliderOverrides } from '@/theme/components/slider';
import { RadioOverrides } from '@/theme/components/radio';
import { FormLabelOverrides } from '@/theme/components/formLabel';
import { MenuItemOverrides } from '@/theme/components/menuItem';

export const components: Components = {
  MuiButton: ButtonOverrides,
  MuiCard: CardOverrides,
  MuiIconButton: IconButtonOverrides,
  MuiInputLabel: InputLabelOverrides,
  MuiOutlinedInput: OutlinedInputOverrides,
  MuiTextField: TextFieldOverrides,
  MuiPaper: PaperOverrides,
  MuiLink: LinkOverrides,
  MuiToggleButton: ToggleButtonOverrides,
  MuiSwitch: SwitchOverrides,
  MuiSlider: SliderOverrides,
  MuiRadio: RadioOverrides,
  MuiFormLabel: FormLabelOverrides,
  MuiMenuItem: MenuItemOverrides,
};
