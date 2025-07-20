import { useState } from 'react';
import { TextField } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import * as S from './styles';

interface EditableFieldProps {
  label: string;
  value: string;
  field: 'name' | 'email';
  onSave: (field: 'name' | 'email', value: string) => void;
  loading?: boolean;
}

export const EditableField = ({ label, value, field, onSave, loading }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setFieldValue(value);
    setError('');
  };

  const handleSave = () => {
    // Validação
    if (!fieldValue.trim()) {
      setError(`${label} não pode estar vazio`);
      return;
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue.trim())) {
        setError('Email inválido');
        return;
      }
    }

    setError('');
    onSave(field, fieldValue.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFieldValue(value);
    setError('');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <S.FieldContainer>
      <TextField
        fullWidth
        label={label}
        value={fieldValue}
        onChange={(e) => {
          setFieldValue(e.target.value);
          if (error) setError('');
        }}
        onKeyDown={handleKeyPress}
        disabled={!isEditing || loading}
        error={!!error}
        helperText={error}
        slotProps={{
          input: {
            readOnly: !isEditing,
          },
        }}
      />
      <S.ActionButton
        onClick={isEditing ? handleSave : handleEdit}
        disabled={loading}
        color={isEditing ? 'primary' : 'default'}
      >
        {isEditing ? <SaveIcon color="secondary" /> : <EditIcon color="secondary" />}
      </S.ActionButton>
    </S.FieldContainer>
  );
};
