import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '../../types';
import { projectService } from '../../services/projectService';

interface ProjectState {
  projects: Project[];
  filteredProjects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  activeCategory: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}

const initialState: ProjectState = {
  projects: [],
  filteredProjects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  activeCategory: 'all',
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
};

function applyFilters(state: ProjectState) {
  state.filteredProjects = state.projects.filter((p) => {
    const catMatch = state.activeCategory === 'all' || p.category === state.activeCategory;
    const searchMatch = !state.searchQuery || p.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });
}

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await projectService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load projects');
  }
});

export const fetchProjectBySlug = createAsyncThunk('projects/fetchBySlug', async (slug: string, { rejectWithValue }) => {
  try {
    const response = await projectService.getBySlug(slug);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load project');
  }
});

export const createProject = createAsyncThunk('projects/create', async (data: Omit<Project, 'id'>, { rejectWithValue }) => {
  try {
    const response = await projectService.create(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const createProjectWithImages = createAsyncThunk('projects/createWithImages', async (data: FormData, { rejectWithValue }) => {
  try {
    const response = await projectService.createWithImages(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const saveProject = createAsyncThunk('projects/update', async (project: Project, { rejectWithValue }) => {
  try {
    const response = await projectService.update(project.id, project);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

export const saveProjectWithImages = createAsyncThunk('projects/updateWithImages', async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
  try {
    const response = await projectService.updateWithImages(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update project');
  }
});

export const removeProject = createAsyncThunk('projects/delete', async (id: string, { rejectWithValue }) => {
  try {
    await projectService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      applyFilters(state);
    },
    selectProject: (state, action: PayloadAction<string>) => {
      state.selectedProject = state.projects.find((p) => p.slug === action.payload) || null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
      applyFilters(state);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
      applyFilters(state);
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.projects = action.payload;
        applyFilters(state);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action: PayloadAction<Project>) => {
        state.selectedProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.unshift(action.payload);
        applyFilters(state);
      })
      .addCase(createProjectWithImages.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.unshift(action.payload);
        applyFilters(state);
      })
      .addCase(saveProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        applyFilters(state);
      })
      .addCase(saveProjectWithImages.fulfilled, (state, action: PayloadAction<Project>) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
        applyFilters(state);
      })
      .addCase(removeProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        applyFilters(state);
      });
  },
});

export const { setCategory, setSearchQuery, selectProject, setPage, addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;
