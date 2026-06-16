import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ContactMessage } from '../../types';
import { contactService } from '../../services/contactService';

interface ContactState {
  messages: ContactMessage[];
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export const submitContactForm = createAsyncThunk('contact/submit', async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>, { rejectWithValue }) => {
  try {
    const response = await contactService.submit(data);
    return response.data as ContactMessage;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const fetchMessages = createAsyncThunk('contact/fetchMessages', async (_, { rejectWithValue }) => {
  try {
    const response = await contactService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load messages');
  }
});

export const markMessageRead = createAsyncThunk('contact/markRead', async (id: string, { rejectWithValue }) => {
  try {
    const response = await contactService.markRead(id);
    return response.data as ContactMessage;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update message');
  }
});

export const removeMessage = createAsyncThunk('contact/delete', async (id: string, { rejectWithValue }) => {
  try {
    await contactService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete message');
  }
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: { messages: [], isLoading: false, isSubmitted: false, error: null } as ContactState,
  reducers: {
    markRead: (state, action: PayloadAction<string>) => {
      const m = state.messages.find((m) => m.id === action.payload);
      if (m) m.isRead = true;
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    resetSubmit: (state) => {
      state.isSubmitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action: PayloadAction<ContactMessage>) => {
        state.isLoading = false;
        state.isSubmitted = true;
        state.messages.unshift(action.payload);
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<ContactMessage[]>) => {
        state.messages = action.payload;
      })
      .addCase(markMessageRead.fulfilled, (state, action: PayloadAction<ContactMessage>) => {
        const idx = state.messages.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.messages[idx] = action.payload;
      })
      .addCase(removeMessage.fulfilled, (state, action: PayloadAction<string>) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      });
  },
});

export const { markRead, deleteMessage, resetSubmit } = contactSlice.actions;
export default contactSlice.reducer;
