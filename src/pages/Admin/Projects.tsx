import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Eye, MapPin, Pencil, Plus, Search, Trash2, User } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { RootState, AppDispatch } from '../../redux/store';
import { removeProject } from '../../redux/slices/projectSlice';
import type { Project } from '../../types';
import Modal from '../../components/ui/Modal';
import AdminDataTable from '../../components/ui/AdminDataTable';
import ProjectFormModal from './ProjectFormModal';
import { notify } from '../../utils/toast';

export default function AdminProjects() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((s: RootState) => s.projects);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [selectedDetailImage, setSelectedDetailImage] = useState('');

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );
  const detailImages = detailProject ? Array.from(new Set([detailProject.coverImage, ...detailProject.images])) : [];

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeProject(id)).unwrap();
      notify.success('Project deleted successfully');
      setDeleteId(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  const openEdit = (project: Project) => {
    setEditProject(project);
    setFormOpen(true);
  };

  const openAdd = () => {
    setEditProject(null);
    setFormOpen(true);
  };

  const openDetails = (project: Project) => {
    setDetailProject(project);
    setSelectedDetailImage(project.coverImage);
  };

  const closeDetails = () => {
    setDetailProject(null);
    setSelectedDetailImage('');
  };

  const columns: ColumnDef<Project>[] = [
    {
      header: 'Project',
      accessorKey: 'title',
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={project.coverImage} alt={project.title} className="w-10 h-10 object-cover shrink-0" />
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">{project.title}</p>
              <p className="text-gray-400 text-xs">{project.client}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ getValue }) => (
        <span className="bg-accent/10 text-accent text-xs px-2.5 py-1 capitalize">{String(getValue())}</span>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
          <MapPin size={12} /> {String(getValue())}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span className={`text-xs px-2.5 py-1 font-medium capitalize ${
          row.original.status === 'completed' ? 'bg-secondary text-primary dark:bg-white/10 dark:text-white' :
          row.original.status === 'ongoing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
          'bg-primary/5 text-primary dark:bg-white/10 dark:text-white/80'
        }`}>{row.original.status}</span>
      ),
    },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{String(getValue() || '-')}</span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openDetails(project)}
              className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors"
              aria-label={`View ${project.title}`}
              title="View details"
            >
              <Eye size={15} />
            </button>
            <button onClick={() => openEdit(project)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Pencil size={15} />
            </button>
            <button onClick={() => setDeleteId(project.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-sm font-medium transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
          className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <AdminDataTable data={filtered} columns={columns} emptyMessage="No projects found" />
      </div>

      {/* Add/Edit modal */}
      <ProjectFormModal open={formOpen} onClose={() => setFormOpen(false)} project={editProject} />

      {/* Details modal */}
      <Modal open={!!detailProject} onClose={closeDetails} title={detailProject?.title ?? 'Project Details'} size="xl">
        {detailProject && (
          <div className="max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
              <div>
                <img
                  src={selectedDetailImage || detailProject.coverImage}
                  alt={detailProject.title}
                  className="h-72 w-full object-cover"
                />
                {detailImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {detailImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedDetailImage(image)}
                        className={`h-20 overflow-hidden transition-all ${
                          selectedDetailImage === image ? 'ring-2 ring-accent' : 'hover:opacity-80'
                        }`}
                        aria-label={`View ${detailProject.title} image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${detailProject.title} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <span className="bg-accent/10 text-accent text-xs px-2.5 py-1 capitalize">{detailProject.category}</span>
                  <span className={`ml-2 text-xs px-2.5 py-1 font-medium capitalize ${
                    detailProject.status === 'completed' ? 'bg-secondary text-primary dark:bg-white/10 dark:text-white' :
                    detailProject.status === 'ongoing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-primary/5 text-primary dark:bg-white/10 dark:text-white/80'
                  }`}>{detailProject.status}</span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Client', value: detailProject.client, icon: User },
                    { label: 'Location', value: detailProject.location, icon: MapPin },
                    { label: 'Completion', value: detailProject.completionDate, icon: Calendar },
                    ...(detailProject.value ? [{ label: 'Project Value', value: detailProject.value, icon: DollarSign }] : []),
                    ...(detailProject.duration ? [{ label: 'Duration', value: detailProject.duration, icon: Clock }] : []),
                  ].map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <div key={detail.label} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-700">
                        <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400">{detail.label}</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{detail.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-display text-lg font-bold text-gray-800 dark:text-white mb-2">Overview</h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{detailProject.description}</p>
            </div>

            {detailProject.technologies.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold text-gray-800 dark:text-white mb-3">Technologies & Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {detailProject.technologies.map((tech) => (
                    <span key={tech} className="bg-gray-100 px-3 py-1.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  closeDetails();
                  openEdit(detailProject);
                }}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <Pencil size={15} /> Edit Project
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          This action cannot be undone. Are you sure you want to delete this project?
        </p>
        <div className="flex gap-3">
          <button onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition-colors">
            Delete
          </button>
          <button onClick={() => setDeleteId(null)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white py-2.5 text-sm font-medium transition-colors">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
