import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  index?: number;
  variant?: 'default' | 'compact' | 'featured';
}

const statusVariant: Record<string, 'success' | 'info' | 'warning'> = {
  completed: 'success',
  ongoing: 'info',
  upcoming: 'warning',
};

export default function ProjectCard({ project, index = 0, variant = 'default' }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group bg-white dark:bg-primary/80 overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${variant === 'compact' ? 'h-44' : 'h-56'}`}>
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <Badge variant="accent">{project.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
        </div>

        {/* Hover overlay CTA */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Link
            to={`/projects/${project.slug}`}
            className="flex items-center gap-2 text-white text-sm font-medium"
          >
            View Project <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="font-display text-xl font-bold text-primary dark:text-white mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {project.title}
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> {project.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} /> {project.completionDate}
          </span>
        </div>

        {variant !== 'compact' && (
          <p className="text-gray-500 dark:text-white/60 text-sm line-clamp-2 mb-5">
            {project.shortDescription}
          </p>
        )}

        {project.value && variant !== 'compact' && (
          <div className="flex items-center justify-between text-xs text-gray-400 mb-5 pb-5 border-b border-gray-100 dark:border-white/10">
            <span>
              Value: <strong className="text-primary dark:text-white">{project.value}</strong>
            </span>
            {project.duration && (
              <span>
                Duration: <strong className="text-primary dark:text-white">{project.duration}</strong>
              </span>
            )}
          </div>
        )}

        <Link
          to={`/projects/${project.slug}`}
          className="flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all duration-200"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
