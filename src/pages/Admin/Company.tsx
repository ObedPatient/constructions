import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2 } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import { saveCompanyProfile, resetSaved } from '../../redux/slices/companySlice';
import type { CompanyProfile } from '../../types';
import { notify } from '../../utils/toast';

export default function AdminCompany() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isSaved, isLoading, error } = useSelector((s: RootState) => s.company);

  const { register, handleSubmit, reset } = useForm<CompanyProfile>({ defaultValues: profile });

  useEffect(() => { reset(profile); }, [profile, reset]);
  useEffect(() => {
    if (isSaved) {
      notify.success('Company profile saved successfully');
      setTimeout(() => dispatch(resetSaved()), 3000);
    }
  }, [isSaved, dispatch]);

  const onSubmit = async (data: CompanyProfile) => {
    try {
      await dispatch(saveCompanyProfile(data)).unwrap();
    } catch (err) {
      notify.error(String(err));
    }
  };

  const Field = ({ id, label, type = 'text', textarea = false, required = false }: { id: keyof CompanyProfile; label: string; type?: string; textarea?: boolean; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {textarea ? (
        <textarea rows={4} {...register(id as any)} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors resize-none" />
      ) : (
        <input type={type} {...register(id as any)} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors" />
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Company Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your company information displayed on the website.</p>
        </div>
        {isSaved && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-accent bg-accent/10 dark:bg-white/10 dark:text-white px-4 py-2 text-sm font-medium">
            <CheckCircle2 size={16} /> Saved successfully
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3">{error}</p>}
        {/* Basic info */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="font-display font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field id="companyName" label="Company Name" required />
            <Field id="tagline" label="Tagline" />
            <Field id="phone" label="Phone Number" type="tel" />
            <Field id="email" label="Email Address" type="email" />
          </div>
          <Field id="address" label="Office Address" />
          <Field id="description" label="Company Description" textarea />
        </div>

        {/* Mission & Vision */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="font-display font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">Mission & Vision</h2>
          <Field id="mission" label="Mission Statement" textarea />
          <Field id="vision" label="Vision Statement" textarea />
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">Company Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'projectsCompleted' as keyof CompanyProfile, label: 'Projects Completed' },
              { id: 'clientsSatisfied' as keyof CompanyProfile, label: 'Clients Satisfied' },
              { id: 'yearsExperience' as keyof CompanyProfile, label: 'Years Experience' },
              { id: 'awardsWon' as keyof CompanyProfile, label: 'Awards Won' },
            ].map((f) => (
              <div key={f.id}>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{f.label}</label>
                <input type="number" {...register(f.id)} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-display font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map((platform) => (
              <div key={platform}>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 capitalize">{platform}</label>
                <input type="url" {...register(`socialLinks.${platform}` as any)} placeholder={`https://${platform}.com/realrw`}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 font-medium text-sm transition-colors disabled:opacity-60">
            <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
