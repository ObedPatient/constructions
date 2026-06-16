import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Milestone, Partner, Service, TeamMember } from '../../types';
import { milestoneService, partnerService, serviceContentService, teamService } from '../../services/contentService';

interface ContentState {
  services: Service[];
  milestones: Milestone[];
  team: TeamMember[];
  partners: Partner[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  services: [],
  milestones: [],
  team: [],
  partners: [],
  isLoading: false,
  error: null,
};

const errorMessage = (err: any, fallback: string) => err.response?.data?.message || fallback;

export const fetchServices = createAsyncThunk('content/fetchServices', async (_, { rejectWithValue }) => {
  try {
    const response = await serviceContentService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to load services'));
  }
});

export const createService = createAsyncThunk('content/createService', async (data: Omit<Service, 'id'> | FormData, { rejectWithValue }) => {
  try {
    const response = await serviceContentService.create(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to create service'));
  }
});

export const saveService = createAsyncThunk('content/saveService', async ({ id, data }: { id: string; data: Partial<Omit<Service, 'id'>> | FormData }, { rejectWithValue }) => {
  try {
    const response = await serviceContentService.update(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to update service'));
  }
});

export const removeService = createAsyncThunk('content/removeService', async (id: string, { rejectWithValue }) => {
  try {
    await serviceContentService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to delete service'));
  }
});

export const fetchMilestones = createAsyncThunk('content/fetchMilestones', async (_, { rejectWithValue }) => {
  try {
    const response = await milestoneService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to load milestones'));
  }
});

export const createMilestone = createAsyncThunk('content/createMilestone', async (data: Omit<Milestone, 'id'>, { rejectWithValue }) => {
  try {
    const response = await milestoneService.create(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to create milestone'));
  }
});

export const saveMilestone = createAsyncThunk('content/saveMilestone', async ({ id, data }: { id: string; data: Partial<Omit<Milestone, 'id'>> }, { rejectWithValue }) => {
  try {
    const response = await milestoneService.update(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to update milestone'));
  }
});

export const removeMilestone = createAsyncThunk('content/removeMilestone', async (id: string, { rejectWithValue }) => {
  try {
    await milestoneService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to delete milestone'));
  }
});

export const fetchTeam = createAsyncThunk('content/fetchTeam', async (_, { rejectWithValue }) => {
  try {
    const response = await teamService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to load leadership team'));
  }
});

export const createTeamMember = createAsyncThunk('content/createTeamMember', async (data: Omit<TeamMember, 'id'> | FormData, { rejectWithValue }) => {
  try {
    const response = await teamService.create(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to create team member'));
  }
});

export const saveTeamMember = createAsyncThunk('content/saveTeamMember', async ({ id, data }: { id: string; data: Partial<Omit<TeamMember, 'id'>> | FormData }, { rejectWithValue }) => {
  try {
    const response = await teamService.update(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to update team member'));
  }
});

export const removeTeamMember = createAsyncThunk('content/removeTeamMember', async (id: string, { rejectWithValue }) => {
  try {
    await teamService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to delete team member'));
  }
});

export const fetchPartners = createAsyncThunk('content/fetchPartners', async (_, { rejectWithValue }) => {
  try {
    const response = await partnerService.getAll();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to load partners'));
  }
});

export const createPartner = createAsyncThunk('content/createPartner', async (data: Omit<Partner, 'id'> | FormData, { rejectWithValue }) => {
  try {
    const response = await partnerService.create(data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to create partner'));
  }
});

export const savePartner = createAsyncThunk('content/savePartner', async ({ id, data }: { id: string; data: Partial<Omit<Partner, 'id'>> | FormData }, { rejectWithValue }) => {
  try {
    const response = await partnerService.update(id, data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to update partner'));
  }
});

export const removePartner = createAsyncThunk('content/removePartner', async (id: string, { rejectWithValue }) => {
  try {
    await partnerService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(errorMessage(err, 'Failed to delete partner'));
  }
});

function upsertById<T extends { id: string }>(items: T[], item: T) {
  const index = items.findIndex((current) => current.id === item.id);
  if (index === -1) items.push(item);
  else items[index] = item;
  items.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.services = action.payload;
      })
      .addCase(createService.fulfilled, (state, action: PayloadAction<Service>) => {
        upsertById(state.services, action.payload);
      })
      .addCase(saveService.fulfilled, (state, action: PayloadAction<Service>) => {
        upsertById(state.services, action.payload);
      })
      .addCase(removeService.fulfilled, (state, action: PayloadAction<string>) => {
        state.services = state.services.filter((service) => service.id !== action.payload);
      })
      .addCase(fetchMilestones.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.milestones = action.payload;
      })
      .addCase(createMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        upsertById(state.milestones, action.payload);
      })
      .addCase(saveMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        upsertById(state.milestones, action.payload);
      })
      .addCase(removeMilestone.fulfilled, (state, action: PayloadAction<string>) => {
        state.milestones = state.milestones.filter((milestone) => milestone.id !== action.payload);
      })
      .addCase(fetchTeam.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.team = action.payload;
      })
      .addCase(createTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        upsertById(state.team, action.payload);
      })
      .addCase(saveTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        upsertById(state.team, action.payload);
      })
      .addCase(removeTeamMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.team = state.team.filter((member) => member.id !== action.payload);
      })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.partners = action.payload;
      })
      .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        upsertById(state.partners, action.payload);
      })
      .addCase(savePartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        upsertById(state.partners, action.payload);
      })
      .addCase(removePartner.fulfilled, (state, action: PayloadAction<string>) => {
        state.partners = state.partners.filter((partner) => partner.id !== action.payload);
      });
  },
});

export default contentSlice.reducer;
