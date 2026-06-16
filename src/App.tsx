import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/store';
import type { AppDispatch, RootState } from './redux/store';
import { fetchCompanyProfile } from './redux/slices/companySlice';
import { fetchProjects } from './redux/slices/projectSlice';
import { fetchProjectCategories } from './redux/slices/projectCategorySlice';
import { fetchMilestones, fetchPartners, fetchServices, fetchTeam } from './redux/slices/contentSlice';
import { fetchCurrentAdmin } from './redux/slices/authSlice';

import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';
import LoadingScreen from './components/common/LoadingScreen';
import AppToaster from './components/common/AppToaster';

// Lazy-load all pages for code splitting
const HomePage = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/About'));
const ServicesPage = lazy(() => import('./pages/Services'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetails'));
const ContactPage = lazy(() => import('./pages/Contact'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLoginPage = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/Admin/Projects'));
const AdminProjectCategories = lazy(() => import('./pages/Admin/ProjectCategories'));
const AdminServices = lazy(() => import('./pages/Admin/Services'));
const AdminMilestones = lazy(() => import('./pages/Admin/Milestones'));
const AdminTeam = lazy(() => import('./pages/Admin/Team'));
const AdminPartners = lazy(() => import('./pages/Admin/Partners'));
const AdminMessages = lazy(() => import('./pages/Admin/Messages'));
const AdminCompany = lazy(() => import('./pages/Admin/Company'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-accent flex items-center justify-center font-display font-bold text-white">R</div>
        <div className="w-32 h-0.5 bg-gray-100 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-accent animate-[loadingBar_1s_ease-in-out_infinite]" style={{ animation: 'loadingBar 1s ease-in-out infinite' }} />
        </div>
      </div>
    </div>
  );
}

function BootstrapData() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    dispatch(fetchCompanyProfile());
    dispatch(fetchProjects());
    dispatch(fetchProjectCategories());
    dispatch(fetchServices());
    dispatch(fetchMilestones());
    dispatch(fetchTeam());
    dispatch(fetchPartners());
    if (token) dispatch(fetchCurrentAdmin());
  }, [dispatch, token]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <BootstrapData />
      <AppToaster />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="project-categories" element={<AdminProjectCategories />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="milestones" element={<AdminMilestones />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="company" element={<AdminCompany />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
