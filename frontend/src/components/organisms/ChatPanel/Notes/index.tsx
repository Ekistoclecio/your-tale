'use client';

import { Box, Typography, IconButton, Divider, Button, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import * as S from '../styles';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface ChatNotesProps {
  notes: Note[];
  noteTitle: string;
  noteContent: string;
  editingNote: string | null;
  setNoteTitle: (v: string) => void;
  setNoteContent: (v: string) => void;
  handleAddNote: () => void;
  handleEditNote: (note: Note) => void;
  handleDeleteNote: (id: string) => void;
  handleCancelEdit: () => void;
  formatNoteDate: (d: Date) => string;
}

export const ChatNotes = ({
  notes,
  noteTitle,
  noteContent,
  editingNote,
  setNoteTitle,
  setNoteContent,
  handleAddNote,
  handleEditNote,
  handleDeleteNote,
  handleCancelEdit,
  formatNoteDate,
}: ChatNotesProps) => (
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
                    variant="subtitle1"
                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {note.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {note.content.length > 100
                      ? `${note.content.substring(0, 100)}...`
                      : note.content}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatNoteDate(note.timestamp)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => handleEditNote(note)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteNote(note.id)}>
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
        value={noteTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteTitle(e.target.value)}
        size="small"
        fullWidth
      />
      <TextField
        placeholder="Conteúdo da anotação"
        value={noteContent}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteContent(e.target.value)}
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
          onClick={handleAddNote}
          disabled={!noteTitle.trim() || !noteContent.trim()}
          fullWidth
        >
          {editingNote ? 'Salvar' : 'Adicionar'}
        </Button>
      </Box>
    </S.AddNoteForm>
  </>
);
