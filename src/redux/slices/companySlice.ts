import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CompanyProfile } from '../../types';
import { companyService } from '../../services/companyService';

interface CompanyState {
  profile: CompanyProfile;
  isLoading: boolean;
  isSaved: boolean;
  error: string | null;
}

export const fetchCompanyProfile = createAsyncThunk('company/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await companyService.get();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load company profile');
  }
});

export const saveCompanyProfile = createAsyncThunk('company/save', async (data: Partial<CompanyProfile>, { rejectWithValue }) => {
  try {
    const response = await companyService.update(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save company profile');
  }
});

const companySlice = createSlice({
  name: 'company',
  initialState: {
    profile: {
      companyName: '',
      tagline: '',
      description: '',
      mission: '',
      vision: '',
      phone: '',
      email: '',
      address: '',
      socialLinks: {},
      foundedYear: 0,
      projectsCompleted: 0,
      clientsSatisfied: 0,
      yearsExperience: 0,
      awardsWon: 0,
    },
    isLoading: false,
    isSaved: false,
    error: null,
  } as CompanyState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<CompanyProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isSaved = true;
    },
    resetSaved: (state) => {
      state.isSaved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action: PayloadAction<CompanyProfile>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveCompanyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveCompanyProfile.fulfilled, (state, action: PayloadAction<CompanyProfile>) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isSaved = true;
      })
      .addCase(saveCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProfile, resetSaved } = companySlice.actions;
export default companySlice.reducer;
