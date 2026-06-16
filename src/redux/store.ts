import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import companyReducer from './slices/companySlice';
import contactReducer from './slices/contactSlice';
import contentReducer from './slices/contentSlice';
import dashboardReducer from './slices/dashboardSlice';
import projectCategoryReducer from './slices/projectCategorySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    company: companyReducer,
    contact: contactReducer,
    content: contentReducer,
    dashboard: dashboardReducer,
    projectCategories: projectCategoryReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
