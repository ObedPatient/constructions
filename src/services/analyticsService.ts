import api from './api';

export const analyticsService = {
  async getMonthlyVisitors() {
    const response = await api.get('/analytics/visitors/monthly');
    return response.data;
  },

  async getTotalVisitors() {
    const response = await api.get('/analytics/visitors/total');
    return response.data;
  },
};
