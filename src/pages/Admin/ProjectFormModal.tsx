import { type DragEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { ImagePlus, Save, Trash2, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { AppDispatch, RootState } from '@/redux/store';
import { createProjectWithImages, saveProjectWithImages } from '@/redux/slices/projectSlice';
import type { Project } from '@/types';
import { notify } from '@/utils/toast';

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  location: z.string().min(2, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  client: z.string().min(2, 'Client is required'),
  completionDate: z.string().min(1, 'Date is required').refine((value) => value >= todayInputValue(), 'Date cannot be in the past'),
  shortDescription: z.string().min(10, 'Short description required'),
  description: z.string().min(20, 'Full description required'),
  status: z.enum(['completed', 'ongoing', 'upcoming']),
  value: z.string().optional(),
  duration: z.string().optional(),
  coverImage: z.string().optional(),
  featured: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectFormModal({ open, onClose, project }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.projectCategories);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isDraggingImages, setIsDraggingImages] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
  });
  const coverImageValue = watch('coverImage');

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        location: project.location,
        category: project.category,
        client: project.client,
        completionDate: project.completionDate,
        shortDescription: project.shortDescription,
        description: project.description,
        status: project.status,
        value: project.value || '',
        duration: project.duration || '',
        coverImage: project.coverImage,
        featured: project.featured || false,
      });
      setExistingImages(Array.from(new Set([project.coverImage, ...project.images].filter(Boolean))));
    } else {
      reset({
        status: 'ongoing',
        category: categories[0]?.slug ?? '',
        featured: false,
        coverImage: '',
      });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setIsDraggingImages(false);
  }, [categories, project, reset]);

  const addSelectedFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    setSelectedFiles((currentFiles) => {
      const selectedKeys = new Set(currentFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const newFiles = imageFiles.filter((file) => !selectedKeys.has(`${file.name}-${file.size}-${file.lastModified}`));
      return [...currentFiles, ...newFiles];
    });
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingImages(false);
    addSelectedFiles(Array.from(event.dataTransfer.files));
  };

  const removeExistingImage = (image: string) => {
    setExistingImages((currentImages) => {
      const nextImages = currentImages.filter((current) => current !== image);
      if (coverImageValue === image) {
        setValue('coverImage', nextImages[0] ?? '');
      }
      return nextImages;
    });
  };

  const removeSelectedFile = (file: File) => {
    setSelectedFiles((currentFiles) => currentFiles.filter((current) => current !== file));
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (existingImages.length === 0 && selectedFiles.length === 0) {
      notify.warning('At least one project image is required');
      return;
    }

    const payload = new FormData();
    const retainedCoverImage = existingImages.includes(data.coverImage ?? '') ? data.coverImage : existingImages[0] ?? '';
    Object.entries({ ...data, coverImage: retainedCoverImage }).forEach(([key, value]) => {
      if (value !== undefined && value !== null) payload.append(key, String(value));
    });
    payload.append('technologies', JSON.stringify(project?.technologies ?? []));
    payload.append('images', JSON.stringify(existingImages));
    selectedFiles.forEach((file) => payload.append('images', file));

    try {
      if (project) {
        payload.append('slug', project.slug);
        await dispatch(saveProjectWithImages({ id: project.id, data: payload })).unwrap();
        notify.success('Project updated successfully');
      } else {
        const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        payload.append('slug', slug);
        await dispatch(createProjectWithImages(payload)).unwrap();
        notify.success('Project created successfully');
      }
      onClose();
    } catch (err) {
      notify.error(String(err));
    }
  };

  const fieldClass = "w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors";
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide";
  const errClass = "text-red-500 text-xs mt-1";

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'Add New Project'} size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input {...register('title')} className={fieldClass} placeholder="Kigali Business Tower" />
            {errors.title && <p className={errClass}>{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Client *</label>
            <input {...register('client')} className={fieldClass} placeholder="Client name" />
            {errors.client && <p className={errClass}>{errors.client.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input {...register('location')} className={fieldClass} placeholder="Kigali, Rwanda" />
            {errors.location && <p className={errClass}>{errors.location.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Completion Date *</label>
            <input {...register('completionDate')} type="date" min={todayInputValue()} className={fieldClass} />
            {errors.completionDate && <p className={errClass}>{errors.completionDate.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select {...register('category')} className={fieldClass}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
            {errors.category && <p className={errClass}>{errors.category.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Status *</label>
            <select {...register('status')} className={fieldClass}>
              {['completed', 'ongoing', 'upcoming'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Project Value</label>
            <input {...register('value')} className={fieldClass} placeholder="$50M" />
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <input {...register('duration')} className={fieldClass} placeholder="24 months" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Project Images {project ? '' : '*'}</label>
          <label
            className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center text-sm transition-colors ${
              isDraggingImages
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDraggingImages(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDraggingImages(false);
            }}
            onDrop={handleDrop}
          >
            <ImagePlus size={24} />
            <span>Drag images here or select them from your device</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addSelectedFiles(Array.from(e.target.files ?? []));
                e.target.value = '';
              }}
            />
          </label>
          {!project && selectedFiles.length === 0 && (
            <p className={errClass}>At least one project image is required</p>
          )}
          {selectedFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {selectedFiles.map((file) => (
                <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-2 bg-gray-100 px-2 py-1.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeSelectedFile(file)} className="shrink-0 text-gray-400 hover:text-red-500" aria-label={`Remove ${file.name}`}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {project && existingImages.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {existingImages.map((image) => (
                <div key={image} className="group relative h-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setValue('coverImage', image)}
                    className={`h-full w-full ${coverImageValue === image ? 'ring-2 ring-accent ring-inset' : ''}`}
                    title="Set as cover image"
                  >
                    <img src={image} alt={project.title} className="h-full w-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image)}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${project.title} image`}
                    title="Remove image"
                  >
                    <Trash2 size={13} />
                  </button>
                  {coverImageValue === image && (
                    <span className="absolute bottom-1 left-1 bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <input {...register('shortDescription')} className={fieldClass} placeholder="One-line project summary" />
          {errors.shortDescription && <p className={errClass}>{errors.shortDescription.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Full Description *</label>
          <textarea rows={4} {...register('description')} className={fieldClass + ' resize-none'} placeholder="Detailed project description..." />
          {errors.description && <p className={errClass}>{errors.description.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 accent-accent" />
          <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Feature this project on homepage</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60">
            <Save size={15} /> {project ? 'Save Changes' : 'Add Project'}
          </button>
          <button type="button" onClick={onClose}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-white px-6 py-2.5 text-sm font-medium transition-colors">
            <X size={15} /> Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
