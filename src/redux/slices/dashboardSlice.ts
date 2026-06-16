import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analyticsService';

export const fetchMonthlyVisitors = createAsyncThunk('dashboard/fetchMonthlyVisitors', async () => {
  return await analyticsService.getMonthlyVisitors();
});

export const fetchTotalVisitors = createAsyncThunk('dashboard/fetchTotalVisitors', async () => {
  return await analyticsService.getTotalVisitors();
});

interface VisitorData {
  month: string;
  visitors: number;
}

interface TotalVisitorsData {
  total: number;
  lastMonth: number;
  growth: number;
}

interface DashboardState {
  monthlyVisitors: VisitorData[];
  totalVisitors: TotalVisitorsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  monthlyVisitors: [
    { month: 'Jan', visitors: 0 },
    { month: 'Feb', visitors: 0 },
    { month: 'Mar', visitors: 0 },
    { month: 'Apr', visitors: 0 },
    { month: 'May', visitors: 0 },
    { month: 'Jun', visitors: 0 },
    { month: 'Jul', visitors: 0 },
    { month: 'Aug', visitors: 0 },
    { month: 'Sep', visitors: 0 },
    { month: 'Oct', visitors: 0 },
    { month: 'Nov', visitors: 0 },
    { month: 'Dec', visitors: 0 },
  ],
  totalVisitors: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyVisitors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyVisitors = action.payload;
      })
      .addCase(fetchMonthlyVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch monthly visitors';
      })
      .addCase(fetchTotalVisitors.fulfilled, (state, action) => {
        state.totalVisitors = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
