import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { createMilestone, removeMilestone, saveMilestone } from '../../redux/slices/contentSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Milestone } from '../../types';
import { notify } from '../../utils/toast';

const emptyForm = { year: '', title: '', description: '', sortOrder: 0 };

export default function AdminMilestones() {
  const dispatch = useDispatch<AppDispatch>();
  const { milestones } = useSelector((state: RootState) => state.content);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
  };

  const startEdit = (milestone: Milestone) => {
    setEditing(milestone);
    setForm({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
      sortOrder: milestone.sortOrder ?? 0,
    });
    setError('');
  };

  const submit = async () => {
    if (!form.year.trim() || !form.title.trim() || !form.description.trim()) {
      setError('Year, title, and description are required');
      notify.warning('Year, title, and description are required');
      return;
    }

    const payload = {
      year: form.year.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (editing) {
        await dispatch(saveMilestone({ id: editing.id, data: payload })).unwrap();
        notify.success('Milestone updated successfully');
      } else {
        await dispatch(createMilestone(payload)).unwrap();
        notify.success('Milestone created successfully');
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
      await dispatch(removeMilestone(deleteId)).unwrap();
      notify.success('Milestone deleted successfully');
      setDeleteId(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Milestone Timeline</h1>
        <p className="text-gray-500 text-sm mt-1">{milestones.length} milestones shown on the About page</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-5">{editing ? 'Edit Milestone' : 'Add Milestone'}</h2>
          <div className="space-y-4">
            <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Year" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent resize-none" />
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Sort order" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={submit} className="flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                {editing ? <Save size={15} /> : <Plus size={15} />} {editing ? 'Save Milestone' : 'Add Milestone'}
              </button>
              {editing && <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-4 py-2.5 text-sm font-medium transition-colors"><X size={15} /> Cancel</button>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-5 p-5">
                <div className="w-14 h-14 bg-accent text-white font-display font-bold flex items-center justify-center shrink-0">{milestone.year}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{milestone.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.description}</p>
                  <p className="text-xs text-gray-400 mt-1">order {milestone.sortOrder ?? 0}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(milestone)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil size={15} /></button>
                  <button type="button" onClick={() => setDeleteId(milestone.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {milestones.length === 0 && <div className="text-center py-12 text-gray-400">No milestones found</div>}
          </div>
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Milestone" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Delete this milestone?</p>
        <div className="flex gap-3">
          <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">Delete</button>
          <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
