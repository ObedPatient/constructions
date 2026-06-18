import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SectionHeader from '../common/SectionHeader';

export default function FeaturedProjects() {
  const featured = useSelector((state: RootState) => state.projects.projects.filter((p) => p.featured).slice(0, 3));

  return (
    <section className="section-padding bg-gray-50 dark:bg-primary/80">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
          <SectionHeader
            label="Our Portfolio"
            title="Landmark Projects"
            subtitle="Each project is a testament to our commitment to quality, innovation, and excellence."
          />
          <Link to="/projects" className="btn-dark group shrink-0">
            All Projects
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0.5 bg-gray-200 dark:bg-white/5">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`group relative overflow-hidden ${i === 0 ? 'lg:row-span-2 lg:col-span-1' : ''}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-full min-h-[600px]' : 'h-72'}`}>
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white text-xs px-3 py-1 uppercase tracking-wider font-semibold">
                    {project.category}
                  </span>
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-white text-xs px-3 py-1 uppercase tracking-wider font-semibold ${
                    project.status === 'completed' ? 'bg-secondary' : project.status === 'ongoing' ? 'bg-accent' : 'bg-primary'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className={`font-display font-bold text-white mb-2 group-hover:text-accent transition-colors ${
                    i === 0 ? 'text-2xl' : 'text-xl'
                  }`}>
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-white/60 text-xs mb-3">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} /> {project.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} /> {project.completionDate}
                    </span>
                  </div>
                  {i === 0 && (
                    <p className="text-white/70 text-sm line-clamp-2 mb-4">
                      {project.shortDescription}
                    </p>
                  )}
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    View Project <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
