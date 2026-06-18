import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import { setCategory, setPage, setSearchQuery } from '../../redux/slices/projectSlice';
import Pagination from '../../components/ui/Pagination';

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredProjects, activeCategory, currentPage } = useSelector((s: RootState) => s.projects);
  const { categories } = useSelector((s: RootState) => s.projectCategories);
  const [search, setSearch] = useState('');
  const projectCategories = [{ slug: 'all', name: 'All Projects' }, ...categories];
  const projectsPerPage = 9;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const visibleProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  const handleSearch = (val: string) => {
    setSearch(val);
    dispatch(setSearchQuery(val));
  };

  return (
    <>
      {/* Page hero */}
      <div className="relative h-64 md:h-80 bg-primary overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
          alt="Projects"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative container-custom px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">Portfolio</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white">Our Projects</h1>
        </div>
      </div>

      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/50 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {projectCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => dispatch(setCategory(cat.slug))}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? 'bg-primary dark:bg-accent text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8">
            Showing {visibleProjects.length} of {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 dark:bg-white/5"
            >
              {visibleProjects.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white dark:bg-primary/80 overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-accent text-white text-xs px-2.5 py-1 uppercase tracking-wide font-medium">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-white text-xs px-2.5 py-1 uppercase tracking-wide font-medium ${
                        project.status === 'completed' ? 'bg-secondary' :
                        project.status === 'ongoing' ? 'bg-accent' : 'bg-primary'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-display text-xl font-bold text-primary dark:text-white mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} /> {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {project.completionDate}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-white/60 text-sm line-clamp-2 mb-5">
                      {project.shortDescription}
                    </p>
                    {project.value && (
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                        <span>Value: <strong className="text-primary dark:text-white">{project.value}</strong></span>
                        <span>Duration: <strong className="text-primary dark:text-white">{project.duration}</strong></span>
                      </div>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length > projectsPerPage && (
            <div className="mt-10 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => dispatch(setPage(page))} />
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No projects found</p>
              <button
                onClick={() => { dispatch(setCategory('all')); handleSearch(''); }}
                className="text-accent text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
