import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const Scheduling = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Data de início da sessão (opcional)"
            value={field.value}
            onChange={field.onChange}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
                helperText: 'Deixe em branco para iniciar imediatamente',
              },
            }}
          />
        )}
      />
    </>
  );
};
