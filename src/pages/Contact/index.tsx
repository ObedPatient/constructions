import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, Clock, Copy, ExternalLink, Mail, Map, MapPin, Navigation, Phone, Send } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import { submitContactForm, resetSubmit } from '../../redux/slices/contactSlice';
import SectionHeader from '../../components/common/SectionHeader';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isSubmitted, error } = useSelector((s: RootState) => s.contact);
  const profile = useSelector((s: RootState) => s.company.profile);
  const [mapMode, setMapMode] = useState<'road' | 'satellite'>('road');
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const address = profile.address || 'KG 7 Ave, Kigali Business Center, Kigali, Rwanda';
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  const mapSrc = {
    road: `https://www.google.com/maps?q=${encodedAddress}&output=embed`,
    satellite: `https://www.google.com/maps?q=${encodedAddress}&t=k&output=embed`,
  };
  const contactInfo = [
    { icon: MapPin, label: 'Office Address', value: address },
    { icon: Phone, label: 'Phone Number', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: Mail, label: 'Email Address', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Clock, label: 'Working Hours', value: 'Mon-Fri: 8:00 AM - 6:00 PM EAT' },
  ];

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isSubmitted) { reset(); setTimeout(() => dispatch(resetSubmit()), 5000); }
  }, [isSubmitted, reset, dispatch]);

  const onSubmit = (data: FormData) => {
    dispatch(submitContactForm(data));
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <div className="relative h-72 md:h-80 bg-primary overflow-hidden flex items-end">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" alt="Contact" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50" />
        <div className="relative container-custom px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">Get in Touch</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white">Contact Us</h1>
        </div>
      </div>

      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Info column */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeader label="Reach Us" title="Let's Start a Conversation" />
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
                Whether you have a project in mind, need a quote, or just want to learn more about our services, 
                our team is ready to help. Fill in the form and we'll be in touch within 24 hours.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="flex gap-4 items-start">
                      <div className="w-11 h-11 bg-accent/10 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="text-primary dark:text-white text-sm font-medium hover:text-accent transition-colors">{info.value}</a>
                        ) : (
                          <p className="text-primary dark:text-white text-sm font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Form column */}
            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-accent/10 dark:bg-white/10 h-full">
                  <CheckCircle2 size={56} className="text-accent" />
                  <h3 className="font-display text-2xl font-bold text-primary dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-white/60 max-w-sm">
                    Thank you for reaching out. Our team will respond within 24 business hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: 'name', label: 'Full Name', placeholder: 'Jean-Pierre Habimana', type: 'text' },
                      { id: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder}
                          {...register(field.id as keyof FormData)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/50 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
                        {errors[field.id as keyof FormData] && (
                          <p className="text-red-500 text-xs mt-1">{errors[field.id as keyof FormData]?.message}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Phone Number</label>
                      <input type="tel" placeholder="+250 788 000 000" {...register('phone')}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/50 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Subject</label>
                      <select {...register('subject')}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/50 text-gray-800 dark:text-white focus:outline-none focus:border-accent transition-colors text-sm appearance-none">
                        <option value="">Select a subject…</option>
                        <option>Project Inquiry</option>
                        <option>Request a Quote</option>
                        <option>Partnership</option>
                        <option>General Inquiry</option>
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">Message</label>
                    <textarea rows={6} placeholder="Tell us about your project, timeline, budget, and any specific requirements…"
                      {...register('message')}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/50 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors text-sm resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3">{error}</p>}

                  <button type="submit" disabled={isLoading}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-primary/80">
        <div className="bg-white py-10 dark:bg-secondary">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">Find Us</span>
                <h2 className="font-display text-3xl font-bold text-primary dark:text-white">Our Location</h2>
              </div>
              <a href={googleDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary self-start">
                <Navigation size={16} /> Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="container-custom px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4 order-2 lg:order-1">
              <div className="bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 p-5 hover:border-accent/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-white text-sm mb-1">Head Office</h4>
                    <p className="text-gray-500 dark:text-white/60 text-xs leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 p-5 hover:border-accent/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary dark:text-white text-sm mb-2">Office Hours</h4>
                    <div className="space-y-1.5 text-xs text-gray-500 dark:text-white/60">
                      <div className="flex justify-between gap-6">
                        <span>Monday - Friday</span>
                        <span className="text-primary dark:text-white font-medium">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="border-t border-gray-100 dark:border-white/10 pt-2 mt-1">
                        <span className="text-accent flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          Project inquiries answered within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 p-5 hover:border-accent/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary dark:text-white text-sm mb-2">Direct Lines</h4>
                    <div className="space-y-2 text-xs">
                      <a href={`tel:${profile.phone}`} className="block text-gray-500 dark:text-white/60 hover:text-accent transition-colors font-medium">{profile.phone}</a>
                      <a href={`mailto:${profile.email}`} className="block text-gray-500 dark:text-white/60 hover:text-accent transition-colors font-medium">{profile.email}</a>
                    </div>
                  </div>
                </div>
              </div>

              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 p-4 hover:border-accent/40 transition-colors group w-full">
                <div className="w-10 h-10 overflow-hidden shrink-0 shadow">
                  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <rect width="40" height="40" fill="#1a73e8" />
                    <path d="M20 8C15.58 8 12 11.58 12 16c0 6 8 16 8 16s8-10 8-16c0-4.42-3.58-8-8-8zm0 10.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary dark:text-white text-sm font-semibold group-hover:text-accent transition-colors">View on Google Maps</p>
                  <p className="text-gray-400 text-xs truncate">{address}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 group-hover:text-accent transition-colors" />
              </a>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="relative overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg h-[360px] md:h-[480px]">
                <iframe
                  src={mapSrc[mapMode]}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Builders max construction ltd location - ${address}`}
                />

                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={() => setMapMode((mode) => mode === 'road' ? 'satellite' : 'road')}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold shadow-lg transition-all bg-white/90 text-primary hover:bg-white border border-gray-200"
                    title="Toggle map style"
                  >
                    <Map size={14} className="text-accent" />
                    <span>{mapMode === 'road' ? 'Satellite' : 'Road Map'}</span>
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)]">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium shadow-lg bg-white/95 text-primary border border-gray-200 max-w-xs">
                    <MapPin size={14} className="text-red-500 shrink-0" />
                    <span className="truncate">{address}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 text-sm text-gray-600 dark:text-white/70 hover:text-accent hover:border-accent/40 transition-colors font-medium">
                  <ExternalLink size={14} /> Open in Google Maps
                </a>
                <a href={googleDirectionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 text-sm text-gray-600 dark:text-white/70 hover:text-accent hover:border-accent/40 transition-colors font-medium">
                  <Navigation size={14} /> Get Directions
                </a>
                <button type="button" onClick={copyAddress} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-secondary border border-gray-100 dark:border-white/10 text-sm text-gray-600 dark:text-white/70 hover:text-accent hover:border-accent/40 transition-colors font-medium">
                  <Copy size={14} /> {isAddressCopied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
