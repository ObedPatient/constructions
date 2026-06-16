import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { createService, removeService, saveService } from '../../redux/slices/contentSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Service } from '../../types';
import { notify } from '../../utils/toast';

const ICON_OPTIONS = ['Building2', 'Layers', 'Hammer', 'Network', 'ClipboardList', 'Lightbulb'];

const emptyForm = {
  title: '',
  description: '',
  icon: 'Building2',
  features: '',
  sortOrder: 0,
};

export default function AdminServices() {
  const dispatch = useDispatch<AppDispatch>();
  const { services } = useSelector((state: RootState) => state.content);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const filtered = services.filter((service) =>
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
  };

  const startEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features.join(', '),
      sortOrder: service.sortOrder ?? 0,
    });
    setError('');
  };

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required');
      notify.warning('Title and description are required');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
      features: form.features.split(',').map((feature) => feature.trim()).filter(Boolean),
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (editing) {
        await dispatch(saveService({ id: editing.id, data: payload })).unwrap();
        notify.success('Service updated successfully');
      } else {
        await dispatch(createService(payload)).unwrap();
        notify.success('Service created successfully');
      }
      resetForm();
    } catch (err) {
      setError(String(err));
      notify.error(String(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(removeService(deleteId)).unwrap();
      notify.success('Service deleted successfully');
      setDeleteId(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Services</h1>
        <p className="text-gray-500 text-sm mt-1">{services.length} services shown on the site</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-5">{editing ? 'Edit Service' : 'Add Service'}</h2>
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent resize-none" />
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent">
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features, separated by commas" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Sort order" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={submit} className="flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                {editing ? <Save size={15} /> : <Plus size={15} />} {editing ? 'Save Service' : 'Add Service'}
              </button>
              {editing && <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-4 py-2.5 text-sm font-medium transition-colors"><X size={15} /> Cancel</button>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 relative">
            <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{service.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{service.icon} · {service.features.length} features · order {service.sortOrder ?? 0}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => startEdit(service)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil size={15} /></button>
                  <button type="button" onClick={() => setDeleteId(service.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No services found</div>}
          </div>
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Service" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Delete this service?</p>
        <div className="flex gap-3">
          <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">Delete</button>
          <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
