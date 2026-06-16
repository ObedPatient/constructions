import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-display text-[12rem] font-bold text-white/5 leading-none select-none">404</div>
          <div className="-mt-16 relative z-10">
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-3">Page Not Found</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Blueprint Not Found
            </h1>
            <p className="text-white/50 mb-10 max-w-md mx-auto">
              The page you're looking for seems to have been demolished. Let's get you back to solid ground.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="btn-primary group">
                <Home size={16} />
                Back to Home
              </Link>
              <button onClick={() => history.back()} className="btn-outline group">
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
