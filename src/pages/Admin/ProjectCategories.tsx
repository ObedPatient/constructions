import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Plus, Save, Search, Tags, Trash2, X } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { AppDispatch, RootState } from '../../redux/store';
import { createProjectCategory, fetchProjectCategories, removeProjectCategory, saveProjectCategory } from '../../redux/slices/projectCategorySlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import type { ProjectCategory } from '../../types';
import Modal from '../../components/ui/Modal';
import AdminDataTable from '../../components/ui/AdminDataTable';
import { notify } from '../../utils/toast';

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminProjectCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, error } = useSelector((state: RootState) => state.projectCategories);
  const { projects } = useSelector((state: RootState) => state.projects);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState<ProjectCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<ProjectCategory | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchProjectCategories());
  }, [dispatch]);

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase())
  );

  const projectCounts = projects.reduce<Record<string, number>>((counts, project) => {
    counts[project.category] = (counts[project.category] ?? 0) + 1;
    return counts;
  }, {});

  const resetForm = () => {
    setEditing(null);
    setName('');
    setSlug('');
    setFormError('');
  };

  const startEdit = (category: ProjectCategory) => {
    setEditing(category);
    setName(category.name);
    setSlug(category.slug);
    setFormError('');
  };

  const submitCategory = async () => {
    const cleanName = name.trim();
    const cleanSlug = makeSlug(slug || name);

    if (!cleanName || !cleanSlug) {
      setFormError('Name is required');
      notify.warning('Category name is required');
      return;
    }

    try {
      if (editing) {
        await dispatch(saveProjectCategory({ id: editing.id, data: { name: cleanName, slug: cleanSlug } })).unwrap();
        dispatch(fetchProjects());
        notify.success('Category updated successfully');
      } else {
        await dispatch(createProjectCategory({ name: cleanName, slug: cleanSlug })).unwrap();
        notify.success('Category created successfully');
      }
      resetForm();
    } catch (err) {
      setFormError(String(err));
      notify.error(String(err));
    }
  };

  const confirmDelete = async () => {
    if (!deleteCategory) return;

    try {
      await dispatch(removeProjectCategory(deleteCategory.id)).unwrap();
      notify.success('Category deleted successfully');
      setDeleteCategory(null);
    } catch (err) {
      setFormError(String(err));
      notify.error(String(err));
      setDeleteCategory(null);
    }
  };

  const columns: ColumnDef<ProjectCategory>[] = [
    {
      header: 'Category',
      accessorKey: 'name',
      cell: ({ row }) => <span className="text-sm font-medium text-gray-800 dark:text-white">{row.original.name}</span>,
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: ({ row }) => <span className="text-sm text-gray-500 dark:text-gray-400">{row.original.slug}</span>,
    },
    {
      header: 'Projects',
      id: 'projects',
      accessorFn: (category) => projectCounts[category.slug] ?? 0,
      cell: ({ getValue }) => <span className="text-sm text-gray-700 dark:text-gray-300">{Number(getValue())}</span>,
    },
    {
      header: 'Actions',
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;
        const count = projectCounts[category.slug] ?? 0;
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => startEdit(category)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              aria-label={`Edit ${category.name}`}
              title="Edit category"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (count > 0) {
                  notify.warning('Move projects out of this category before deleting it');
                  return;
                }
                setDeleteCategory(category);
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
              aria-label={`Delete ${category.name}`}
              title="Delete category"
              disabled={count > 0}
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Project Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories available for projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-5">
            <Tags size={18} className="text-accent" />
            <h2 className="font-display font-bold text-gray-800 dark:text-white">{editing ? 'Edit Category' : 'Add Category'}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Name</label>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!editing) setSlug(makeSlug(event.target.value));
                }}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Commercial"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Slug</label>
              <input
                value={slug}
                onChange={(event) => setSlug(makeSlug(event.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="commercial"
              />
            </div>

            {(formError || error) && <p className="text-red-500 text-xs">{formError || error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={submitCategory}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-sm font-medium transition-colors"
              >
                {editing ? <Save size={15} /> : <Plus size={15} />}
                {editing ? 'Save Category' : 'Add Category'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <X size={15} /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <AdminDataTable data={filtered} columns={columns} emptyMessage={isLoading ? 'Loading categories...' : 'No categories found'} />
          </div>
        </div>
      </div>

      <Modal open={!!deleteCategory} onClose={() => setDeleteCategory(null)} title="Delete Category" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Delete {deleteCategory?.name}? Categories cannot be removed while projects still use them.
        </p>
        <div className="flex gap-3">
          <button onClick={confirmDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">
            Delete
          </button>
          <button onClick={() => setDeleteCategory(null)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
