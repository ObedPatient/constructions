import { type MouseEvent, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, User, DollarSign, Clock, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import { fetchProjectBySlug } from '../../redux/slices/projectSlice';

export default function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProject, projects } = useSelector((s: RootState) => s.projects);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  useEffect(() => {
    if (slug) dispatch(fetchProjectBySlug(slug));
  }, [slug, dispatch]);
+
  useEffect(() => {
    setActiveImage(0);
    setZoomOrigin('50% 50%');
  }, [selectedProject?.id]);

  const activeImageUrl = selectedProject?.images[activeImage] || selectedProject?.coverImage;

  const setActiveProjectImage = (index: number) => {
    setActiveImage(index);
    setZoomOrigin('50% 50%');
  };

  const handleHeroZoom = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  if (!selectedProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Link to="/projects" className="btn-dark">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const related = projects.filter((p) => p.category === selectedProject.category && p.id !== selectedProject.id).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div
        className="group/hero relative h-[70vh] min-h-[500px] overflow-hidden"
        onMouseMove={handleHeroZoom}
        onMouseLeave={() => setZoomOrigin('50% 50%')}
      >
        <img
          src={activeImageUrl}
          alt={selectedProject.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/hero:scale-150"
          style={{ transformOrigin: zoomOrigin }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />

        {/* Back button */}
        <Link
          to="/projects"
          className="absolute top-24 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Image nav */}
        {selectedProject.images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {selectedProject.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveProjectImage(i)}
                aria-label={`View project image ${i + 1}`}
                className={`h-0.5 transition-all ${i === activeImage ? 'w-10 bg-accent' : 'w-4 bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-16 left-0 right-0 container-custom px-4 sm:px-6 lg:px-8">
          <span className="bg-accent text-white text-xs px-3 py-1 uppercase tracking-wider font-semibold mb-3 inline-block">
            {selectedProject.category}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-3">
            {selectedProject.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-2"><MapPin size={14} /> {selectedProject.location}</span>
            <span className="flex items-center gap-2"><Calendar size={14} /> {selectedProject.completionDate}</span>
            <span className="flex items-center gap-2"><User size={14} /> {selectedProject.client}</span>
          </div>
        </div>
      </div>

      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-primary dark:text-white mb-4">Project Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{selectedProject.description}</p>

              {/* Image gallery */}
              {selectedProject.images.length > 1 && (
                <div>
                  <h3 className="font-display text-xl font-bold text-primary dark:text-white mb-4">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveProjectImage(i)}
                        className={`relative overflow-hidden h-32 ${activeImage === i ? 'ring-2 ring-accent' : ''}`}
                        aria-label={`View ${selectedProject.title} image ${i + 1}`}
                      >
                        <img src={img} alt={`${selectedProject.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="mt-8">
                <h3 className="font-display text-xl font-bold text-primary dark:text-white mb-4">Technologies & Methods</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 px-4 py-2 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-gray-50 dark:bg-primary/50 p-8 sticky top-24">
                <h3 className="font-display text-xl font-bold text-primary dark:text-white mb-6">Project Details</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Client', value: selectedProject.client, icon: User },
                    { label: 'Location', value: selectedProject.location, icon: MapPin },
                    { label: 'Completion', value: selectedProject.completionDate, icon: Calendar },
                    ...(selectedProject.value ? [{ label: 'Project Value', value: selectedProject.value, icon: DollarSign }] : []),
                    ...(selectedProject.duration ? [{ label: 'Duration', value: selectedProject.duration, icon: Clock }] : []),
                  ].map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <div key={detail.label} className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10 last:border-0">
                        <Icon size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{detail.label}</p>
                          <p className="text-primary dark:text-white font-medium text-sm">{detail.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-6 px-4 py-3 text-sm font-medium text-center ${
                  selectedProject.status === 'completed' ? 'bg-secondary text-primary dark:bg-white/10 dark:text-white' :
                  selectedProject.status === 'ongoing' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-primary/5 text-primary dark:bg-white/10 dark:text-white/80'
                }`}>
                  Status: <strong className="capitalize">{selectedProject.status}</strong>
                </div>

                <Link to="/contact" className="btn-primary w-full justify-center mt-6">
                  Start Similar Project
                </Link>
              </div>
            </div>
          </div>

          {/* Related projects */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold text-primary dark:text-white mb-8">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 dark:bg-white/5">
                {related.map((p) => (
                  <Link key={p.id} to={`/projects/${p.slug}`} className="group bg-white dark:bg-primary/80 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display font-bold text-primary dark:text-white group-hover:text-accent transition-colors">{p.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{p.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
