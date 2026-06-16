import { type DragEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImagePlus, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { createTeamMember, removeTeamMember, saveTeamMember } from '../../redux/slices/contentSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { TeamMember } from '../../types';
import { notify } from '../../utils/toast';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  linkedin: '',
  sortOrder: 0,
};

export default function AdminTeam() {
  const dispatch = useDispatch<AppDispatch>();
  const { team } = useSelector((state: RootState) => state.content);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [error, setError] = useState('');

  const filtered = team.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setIsDraggingImage(false);
    setError('');
  };

  const startEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      linkedin: member.linkedin ?? '',
      sortOrder: member.sortOrder ?? 0,
    });
    setImageFile(null);
    setImagePreview(member.image);
    setIsDraggingImage(false);
    setError('');
  };

  const setSelectedImage = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingImage(false);
    setSelectedImage(Array.from(event.dataTransfer.files)[0] ?? null);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.bio.trim()) {
      setError('Name, role, and bio are required');
      notify.warning('Name, role, and bio are required');
      return;
    }

    if (!editing && !imageFile) {
      setError('Team member image is required');
      notify.warning('Team member image is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', form.name.trim());
    payload.append('role', form.role.trim());
    payload.append('bio', form.bio.trim());
    payload.append('sortOrder', String(Number(form.sortOrder) || 0));
    payload.append('linkedin', form.linkedin.trim());
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editing) {
        await dispatch(saveTeamMember({ id: editing.id, data: payload })).unwrap();
        notify.success('Team member updated successfully');
      } else {
        await dispatch(createTeamMember(payload)).unwrap();
        notify.success('Team member created successfully');
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
      await dispatch(removeTeamMember(deleteId)).unwrap();
      notify.success('Team member deleted successfully');
      setDeleteId(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Leadership Team</h1>
        <p className="text-gray-500 text-sm mt-1">{team.length} leaders shown on the About page</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-5">{editing ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <div className="space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={4} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent resize-none" />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Team Member Image {editing ? '' : '*'}
              </label>
              <label
                className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center text-sm transition-colors ${
                  isDraggingImage
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDraggingImage(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingImage(false);
                }}
                onDrop={handleImageDrop}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Team member preview" className="h-24 w-24 object-cover" />
                    <span className="text-xs font-medium text-accent">Drop a new image or click to change</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={24} />
                    <span>Drag image here or select it from your device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    setSelectedImage(event.target.files?.[0] ?? null);
                    event.target.value = '';
                  }}
                />
              </label>
              {imageFile && (
                <div className="mt-3 truncate bg-gray-100 px-2 py-1.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {imageFile.name}
                </div>
              )}
            </div>
            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL optional" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Sort order" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={submit} className="flex items-center gap-2 bg-accent hover:bg-orange-600 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                {editing ? <Save size={15} /> : <Plus size={15} />} {editing ? 'Save Member' : 'Add Member'}
              </button>
              {editing && <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-4 py-2.5 text-sm font-medium transition-colors"><X size={15} /> Cancel</button>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 relative">
            <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team..." className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((member) => (
              <div key={member.id} className="flex items-start gap-4 p-5">
                <img src={member.image} alt={member.name} className="h-16 w-16 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white">{member.name}</p>
                  <p className="text-sm text-accent">{member.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{member.bio}</p>
                  <p className="text-xs text-gray-400 mt-1">order {member.sortOrder ?? 0}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => startEdit(member)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil size={15} /></button>
                  <button type="button" onClick={() => setDeleteId(member.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No team members found</div>}
          </div>
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Team Member" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Delete this team member?</p>
        <div className="flex gap-3">
          <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">Delete</button>
          <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
