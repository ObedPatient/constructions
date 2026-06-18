import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FolderOpen, Images, MessageSquare, TrendingUp } from 'lucide-react';
import type { RootState } from '../../redux/store';
import type { AppDispatch } from '../../redux/store';
import { fetchMonthlyVisitors, fetchTotalVisitors } from '../../redux/slices/dashboardSlice';

const COLORS = ['#005AA7', '#1A1A1A', '#D9D9D9', '#FFFFFF'];

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((s: RootState) => s.projects);
  const { messages } = useSelector((s: RootState) => s.contact);
  const { categories } = useSelector((s: RootState) => s.projectCategories);
  const { monthlyVisitors, totalVisitors } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchMonthlyVisitors());
    dispatch(fetchTotalVisitors());
  }, [dispatch]);

  const unread = messages.filter((m) => !m.isRead).length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const ongoing = projects.filter((p) => p.status === 'ongoing').length;
  const projectImages = projects.reduce((total, project) => total + project.images.length, 0);
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const projectsByCategory = projects.reduce<{ category: string; count: number }[]>((items, project) => {
    const name = categoryNames.get(project.category) ?? project.category;
    const existing = items.find((item) => item.category === name);
    if (existing) {
      existing.count += 1;
    } else {
      items.push({ category: name, count: 1 });
    }
    return items;
  }, []);

  const totalVisitorCount = totalVisitors?.total || 0;
  const visitorGrowth = totalVisitors?.growth || 0;
  const visitorLabel = totalVisitorCount > 1000 ? `${(totalVisitorCount / 1000).toFixed(1)}K` : totalVisitorCount.toString();

  const STATS = [
    { label: 'Total Projects', value: projects.length, sub: `${completed} completed · ${ongoing} ongoing`, icon: FolderOpen, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Project Photos', value: projectImages, sub: 'Uploaded to projects', icon: Images, color: 'bg-secondary text-primary dark:bg-white/10 dark:text-white' },
    { label: 'Total Messages', value: messages.length, sub: `${unread} unread`, icon: MessageSquare, color: 'bg-primary/5 text-primary dark:bg-white/10 dark:text-white' },
    { label: 'Monthly Visitors', value: visitorLabel, sub: `${visitorGrowth > 0 ? '+' : ''}${visitorGrowth}% vs last month`, icon: TrendingUp, color: 'bg-secondary text-primary dark:bg-white/10 dark:text-white' },
  ];

  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-none flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
              <div className="text-gray-800 dark:text-gray-300 font-medium text-sm mt-1">{stat.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{stat.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Visitors chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-gray-800 dark:text-white">Monthly Visitors</h2>
            <span className="text-xs text-accent bg-accent/10 dark:bg-white/10 dark:text-white px-2 py-1">+12% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyVisitors}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005AA7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#005AA7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '0' }} />
              <Area type="monotone" dataKey="visitors" stroke="#005AA7" strokeWidth={2} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Projects by category pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-6">Projects by Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={projectsByCategory} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="count">
                {projectsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {projectsByCategory.map((item, i) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                </div>
                <span className="font-medium text-gray-800 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent messages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-bold text-gray-800 dark:text-white">Recent Messages</h2>
          <a href="/admin/messages" className="text-accent text-sm hover:underline">View all</a>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {recentMessages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 px-6 py-4 ${!msg.isRead ? 'bg-accent/5' : ''}`}>
              <div className="w-9 h-9 bg-primary dark:bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm shadow-black/10">
                {msg.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-white text-sm">{msg.name}</span>
                  {!msg.isRead && <span className="w-2 h-2 bg-accent rounded-full" />}
                </div>
                <p className="text-gray-500 text-xs">{msg.subject}</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{msg.message}</p>
              </div>
              <span className="text-gray-400 text-xs shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
