'use client';

import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import * as S from '../styles';
import { Note } from '@/schemas/entities/notes';
import { useState } from 'react';
import {
  useCreateSessionNote,
  useDeleteSessionNote,
  useUpdateSessionNote,
} from '@/queries/notes/mutation';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

interface ChatNotesProps {
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
}

export const ChatNotes = ({ notes, onUpdateNotes }: ChatNotesProps) => {
  const [newNote, setNewNote] = useState<Omit<Note, 'id'>>({
    title: '',
    content: '',
  });
  const [editingNote, setEditingNote] = useState<boolean>(false);
  const [editingNoteData, setEditingNoteData] = useState<Note | null>(null);
  const { id: sessionId } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync: createNote } = useCreateSessionNote(sessionId as string);
  const { mutateAsync: deleteNote } = useDeleteSessionNote();
  const { mutateAsync: updateNote } = useUpdateSessionNote();

  const handleEditNote = (note: Note) => {
    setEditingNote(true);
    setEditingNoteData(note);
  };

  const handleDeleteNote = async (id: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await deleteNote({ noteId: id });
      enqueueSnackbar('Anotação deletada com sucesso', { variant: 'success' });
      const updatedNotes = notes.filter((n) => n.id !== id);
      onUpdateNotes(updatedNotes);
    } catch {
      enqueueSnackbar('Erro ao deletar anotação', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const createdNote = await createNote(newNote);
      enqueueSnackbar('Anotação criada com sucesso', { variant: 'success' });
      onUpdateNotes([...notes, createdNote]);
      setNewNote({
        title: '',
        content: '',
      });
    } catch {
      enqueueSnackbar('Erro ao criar anotação', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (note: Note | null) => {
    if (isLoading || !note) return;
    try {
      setIsLoading(true);
      await updateNote({
        noteId: note.id,
        data: {
          title: note.title,
          content: note.content,
        },
      });
      enqueueSnackbar('Anotação atualizada com sucesso', { variant: 'success' });
      const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
      onUpdateNotes(updatedNotes);
      setEditingNote(false);
      setEditingNoteData(null);
    } catch {
      enqueueSnackbar('Erro ao atualizar anotação', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(false);
  };

  return (
    <>
      <S.NotesSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2">Suas Anotações</Typography>
          <Typography variant="caption">
            {notes.length} {notes.length === 1 ? 'anotação' : 'anotações'}
          </Typography>
        </Box>

        <S.NotesList>
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <S.NoteItem>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '8px',
                      }}
                    >
                      {note.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {note.content.length > 100
                        ? `${note.content.substring(0, 100)}...`
                        : note.content}
                    </Typography>
                    {/* <Typography variant="caption" color="text.disabled">
                    {formatNoteDate(note.timestamp)}
                  </Typography> */}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => handleEditNote(note)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </S.NoteItem>
              </motion.div>
            ))}
          </AnimatePresence>

          {notes.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <NotesIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">Nenhuma anotação ainda</Typography>
              <Typography variant="caption">Adicione sua primeira anotação abaixo</Typography>
            </Box>
          )}
        </S.NotesList>
      </S.NotesSection>

      <Divider />

      <S.AddNoteForm>
        <TextField
          placeholder="Título da anotação"
          value={editingNote ? editingNoteData?.title : newNote.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            editingNote
              ? // @ts-expect-error - editingNoteData is not null
                setEditingNoteData({ ...editingNoteData, title: e.target.value })
              : setNewNote({ ...newNote, title: e.target.value })
          }
          size="small"
          fullWidth
        />
        <TextField
          placeholder="Conteúdo da anotação"
          value={editingNote ? editingNoteData?.content : newNote.content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            editingNote
              ? // @ts-expect-error - editingNoteData is not null
                setEditingNoteData({ ...editingNoteData, content: e.target.value })
              : setNewNote({ ...newNote, content: e.target.value })
          }
          multiline
          rows={3}
          size="small"
          fullWidth
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {editingNote && (
            <Button variant="outlined" size="small" onClick={handleCancelEdit} fullWidth>
              Cancelar
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={editingNote ? <EditIcon /> : <AddIcon />}
            onClick={editingNote ? () => handleUpdateNote(editingNoteData) : handleAddNote}
            disabled={
              editingNote
                ? !editingNoteData?.title.trim() || !editingNoteData?.content.trim()
                : !newNote.title.trim() || !newNote.content.trim()
            }
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} /> : editingNote ? 'Salvar' : 'Adicionar'}
          </Button>
        </Box>
      </S.AddNoteForm>
    </>
  );
};
