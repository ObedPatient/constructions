import { type DragEvent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImagePlus, Link as LinkIcon, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { createPartner, removePartner, savePartner } from '../../redux/slices/contentSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Partner } from '../../types';
import { notify } from '../../utils/toast';

const emptyForm = {
  name: '',
  logo: '',
  website: '',
  sortOrder: 0,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function AdminPartners() {
  const dispatch = useDispatch<AppDispatch>();
  const { partners } = useSelector((state: RootState) => state.content);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [error, setError] = useState('');

  const filtered = useMemo(
    () => partners.filter((partner) =>
      partner.name.toLowerCase().includes(search.toLowerCase()) ||
      (partner.website ?? '').toLowerCase().includes(search.toLowerCase())
    ),
    [partners, search]
  );

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setLogoFile(null);
    setLogoPreview('');
    setIsDraggingLogo(false);
    setError('');
  };

  const startEdit = (partner: Partner) => {
    setEditing(partner);
    setForm({
      name: partner.name,
      logo: partner.logo ?? '',
      website: partner.website ?? '',
      sortOrder: partner.sortOrder ?? 0,
    });
    setLogoFile(null);
    setLogoPreview(partner.logo ?? '');
    setIsDraggingLogo(false);
    setError('');
  };

  const setSelectedLogo = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingLogo(false);
    setSelectedLogo(Array.from(event.dataTransfer.files)[0] ?? null);
  };

  const submit = async () => {
    if (!form.name.trim()) {
      setError('Partner name is required');
      notify.warning('Partner name is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', form.name.trim());
    if (!logoFile) payload.append('logo', form.logo.trim());
    payload.append('website', form.website.trim());
    payload.append('sortOrder', String(Number(form.sortOrder) || 0));
    if (logoFile) payload.append('logo', logoFile);

    try {
      if (editing) {
        await dispatch(savePartner({ id: editing.id, data: payload })).unwrap();
        notify.success('Partner updated successfully');
      } else {
        await dispatch(createPartner(payload)).unwrap();
        notify.success('Partner created successfully');
      }
      resetForm();
    } catch (err) {
      setError(String(err));
      notify.error(String(err));
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setIsDraggingLogo(false);
    setForm({ ...form, logo: '' });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(removePartner(deleteId)).unwrap();
      notify.success('Partner deleted successfully');
      setDeleteId(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Partners</h1>
        <p className="text-gray-500 text-sm mt-1">{partners.length} partners shown on the home page</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr] gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <h2 className="font-display font-bold text-gray-800 dark:text-white mb-5">{editing ? 'Edit Partner' : 'Add Partner'}</h2>

          <div className="space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Partner name"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent"
            />

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Partner Logo
              </label>
              <label
                className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center text-sm transition-colors ${
                  isDraggingLogo
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDraggingLogo(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingLogo(false);
                }}
                onDrop={handleDrop}
              >
                {logoPreview || form.logo ? (
                  <>
                    <img src={logoPreview || form.logo} alt="Partner logo preview" className="max-h-20 max-w-[180px] object-contain" />
                    <span className="text-xs font-medium text-accent">Drop a new logo or click to change</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={24} />
                    <span>Drag logo here or select it from your device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    setSelectedLogo(event.target.files?.[0] ?? null);
                    event.target.value = '';
                  }}
                />
              </label>

              {logoFile && (
                <div className="mt-3 truncate bg-gray-100 px-2 py-1.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {logoFile.name}
                </div>
              )}

              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Logo URL fallback
                </label>
                <input
                  value={form.logo}
                  onChange={(e) => {
                    setForm({ ...form, logo: e.target.value });
                    if (!logoFile) setLogoPreview(e.target.value);
                  }}
                  placeholder="Or paste logo URL"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent"
                />
                {(logoPreview || form.logo) && (
                  <button type="button" onClick={clearLogo} className="text-xs text-red-500 hover:text-red-600">
                    Remove logo
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="Website URL"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent"
              />
            </div>

            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              placeholder="Sort order"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm dark:text-white focus:outline-none focus:border-accent"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={submit} className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-sm font-medium transition-colors">
                {editing ? <Save size={15} /> : <Plus size={15} />} {editing ? 'Save Partner' : 'Add Partner'}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-4 py-2.5 text-sm font-medium transition-colors">
                  <X size={15} /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 relative">
            <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partners..." className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700">
            {filtered.map((partner) => (
              <div key={partner.id} className="bg-white dark:bg-gray-800 p-5">
                <div className="h-28 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-5 mb-4">
                  {partner.logo ? (
                    <img src={partner.logo} alt={`${partner.name} logo`} className="max-h-20 max-w-full object-contain" />
                  ) : (
                    <div className="h-14 min-w-14 px-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-display font-bold text-gray-700 dark:text-white">
                      {initials(partner.name)}
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">{partner.name}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{partner.website || 'No website'} · order {partner.sortOrder ?? 0}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => startEdit(partner)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil size={15} /></button>
                    <button type="button" onClick={() => setDeleteId(partner.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="bg-white dark:bg-gray-800 text-center py-12 text-gray-400 md:col-span-2">No partners found</div>}
          </div>
        </div>
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Partner" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Delete this partner?</p>
        <div className="flex gap-3">
          <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">Delete</button>
          <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
