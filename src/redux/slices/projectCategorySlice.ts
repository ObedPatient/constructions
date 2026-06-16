import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectCategory } from '../../types';
import { projectCategoryService } from '../../services/projectCategoryService';

interface ProjectCategoryState {
  categories: ProjectCategory[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectCategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchProjectCategories = createAsyncThunk('projectCategories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await projectCategoryService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load project categories');
  }
});

export const createProjectCategory = createAsyncThunk(
  'projectCategories/create',
  async (data: { name: string; slug?: string }, { rejectWithValue }) => {
    try {
      const response = await projectCategoryService.create(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create category');
    }
  }
);

export const saveProjectCategory = createAsyncThunk(
  'projectCategories/update',
  async ({ id, data }: { id: string; data: { name?: string; slug?: string } }, { rejectWithValue }) => {
    try {
      const response = await projectCategoryService.update(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update category');
    }
  }
);

export const removeProjectCategory = createAsyncThunk('projectCategories/delete', async (id: string, { rejectWithValue }) => {
  try {
    await projectCategoryService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
  }
});

const projectCategorySlice = createSlice({
  name: 'projectCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectCategories.fulfilled, (state, action: PayloadAction<ProjectCategory[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchProjectCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProjectCategory.fulfilled, (state, action: PayloadAction<ProjectCategory>) => {
        state.categories.push(action.payload);
        state.categories.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(saveProjectCategory.fulfilled, (state, action: PayloadAction<ProjectCategory>) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) state.categories[index] = action.payload;
        state.categories.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(removeProjectCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      });
  },
});

export default projectCategorySlice.reducer;
