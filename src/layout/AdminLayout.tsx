import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderOpen, MessageSquare, Building2,
  LogOut, Menu, X, ChevronRight, Bell, Search, Tags, BriefcaseBusiness, Milestone, Users, Handshake
} from 'lucide-react';
import type { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { fetchMessages } from '../redux/slices/contactSlice';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/project-categories', label: 'Project Categories', icon: Tags },
  { href: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
  { href: '/admin/milestones', label: 'Milestones', icon: Milestone },
  { href: '/admin/team', label: 'Leadership Team', icon: Users },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: ChevronRight },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/company', label: 'Company Profile', icon: Building2 },
];

export default function AdminLayout() {
  const { user, token } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { messages } = useSelector((s: RootState) => s.contact);
  const unread = messages.filter((m) => !m.isRead).length;

  useEffect(() => {
    if (token) dispatch(fetchMessages());
  }, [dispatch, token]);

  if (!token || !user) return <Navigate to="/admin/login" replace />;

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href + '/') || location.pathname === href;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[linear-gradient(180deg,#111111_0%,#15181c_100%)] flex flex-col transition-all duration-300 shrink-0 border-r border-white/10`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img
            src="/build_max.jpeg"
            alt="Builders Max Construction Ltd"
            className="w-9 h-9 object-contain rounded-md bg-white p-0.5 shrink-0 shadow-lg shadow-black/20"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">Builders Max Admin</p>
              <p className="text-white/40 text-xs truncate">{user.email}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-2">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 mb-1 transition-all duration-200 group relative ${
                active
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {item.href === '/admin/messages' && unread > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
                {active && !sidebarOpen && (
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pb-4 border-t border-white/10 pt-4">
          <Link
            to="/"
          className="flex items-center gap-3 px-3 py-3 text-white/60 hover:text-white hover:bg-white/10 transition-all mb-1"
        >
            <ChevronRight size={18} className="shrink-0 rotate-180" />
            {sidebarOpen && <span className="text-sm">Back to Site</span>}
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-3 py-3 text-white/60 hover:text-red-400 hover:bg-white/10 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur border-b border-gray-200/80 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 dark:bg-gray-700 pl-9 pr-4 py-2 text-sm rounded-none w-64 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shadow-accent/20">
                {user.name[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
