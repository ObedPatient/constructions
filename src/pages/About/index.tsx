import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Target, Eye, Heart, Link2, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import ContactCTA from '../../components/sections/ContactCTA';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const VALUES = [
  { icon: Award, title: 'Excellence', desc: 'We never compromise. Every project is built to the highest standards of quality and craftsmanship.' },
  { icon: Target, title: 'Precision', desc: 'Engineering accuracy in every measurement, material choice, and construction method.' },
  { icon: Heart, title: 'Integrity', desc: 'Honest communication, transparent processes, and ethical practices at every stage.' },
  { icon: Eye, title: 'Innovation', desc: 'Embracing modern technology, sustainable methods, and forward-thinking design principles.' },
];

export default function AboutPage() {
  const profile = useSelector((state: RootState) => state.company.profile);
  const { milestones, team } = useSelector((state: RootState) => state.content);
  const [activeLeader, setActiveLeader] = useState(0);

  const leadership = useMemo(() => {
    if (team.length === 0) return [];
    return [...team].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name));
  }, [team]);

  useEffect(() => {
    if (activeLeader >= leadership.length) {
      setActiveLeader(0);
    }
  }, [activeLeader, leadership.length]);

  const activeMember = leadership[activeLeader] ?? leadership[0];

  const goToLeader = (index: number) => {
    if (!leadership.length) return;
    const nextIndex = (index + leadership.length) % leadership.length;
    setActiveLeader(nextIndex);
  };

  return (
    <>
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-primary overflow-hidden flex items-end">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80" alt="About" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        <div className="relative container-custom px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">Our Story</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white">About Builders max construction ltd</h1>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <SectionHeader label="Who We Are" title="Two Decades of Building Trust" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                {profile.description}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                From small renovations to billion-franc infrastructure projects, we bring the same level of dedication, 
                expertise, and passion to every engagement. Our team of 500+ construction professionals, engineers, 
                and project managers are the backbone of everything we deliver.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-accent/5 border-l-2 border-accent">
                  <h4 className="font-display font-bold text-primary dark:text-white mb-2">Our Mission</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{profile.mission}</p>
                </div>
                <div className="p-6 bg-primary/5 dark:bg-white/5 border-l-2 border-primary dark:border-white/30">
                  <h4 className="font-display font-bold text-primary dark:text-white mb-2">Our Vision</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{profile.vision}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <img src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80" alt="Team" className="w-full h-[500px] object-cover" />
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-accent -z-10" />
              <div className="absolute bottom-8 right-8 bg-primary/90 backdrop-blur p-6 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { val: profile.projectsCompleted, suf: '+', lab: 'Projects' },
                    { val: profile.yearsExperience, suf: 'yrs', lab: 'Experience' },
                  ].map((s) => (
                    <div key={s.lab} className="text-center">
                      <div className="font-display text-3xl font-bold text-accent">
                        <AnimatedCounter value={s.val} suffix={s.suf} />
                      </div>
                      <div className="text-white/60 text-xs mt-1">{s.lab}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-gray-50 dark:bg-primary/80">
        <div className="container-custom">
          <SectionHeader label="What Drives Us" title="Our Core Values" center subtitle="The principles that guide every decision, every project, every day." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-gray-200 dark:bg-white/5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-primary p-8 text-center group hover:bg-primary dark:hover:bg-accent transition-all duration-500">
                  <div className="w-14 h-14 bg-accent/10 group-hover:bg-white/10 flex items-center justify-center mx-auto mb-5 transition-colors">
                    <Icon size={24} className="text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary dark:text-white group-hover:text-white mb-3 transition-colors">{v.title}</h3>
                  <p className="text-gray-500 dark:text-white/60 group-hover:text-white/80 text-sm leading-relaxed transition-colors">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-construction-pattern opacity-20" />
        <div className="relative container-custom">
          <SectionHeader label="Our Journey" title="20 Years of Milestones" light center />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            <div className="space-y-10">
              {milestones.map((item, i) => (
                <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
                    <div className="bg-secondary/80 backdrop-blur p-6 border border-white/10 hover:border-accent/50 transition-colors">
                      <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 bg-accent flex items-center justify-center">
                      <span className="font-display font-bold text-white text-sm">{item.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          <SectionHeader label="The People" title="Leadership Team" center subtitle="Experienced professionals leading Rwanda's construction industry." />
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
            <div className="relative bg-gray-50 dark:bg-primary/50 border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
              <AnimatePresence mode="wait">
                {activeMember && (
                  <motion.div
                    key={activeMember.id}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] h-full"
                  >
                    <div className="relative aspect-[4/5] md:aspect-auto bg-gray-100 dark:bg-white/5 overflow-hidden">
                      <img
                        src={activeMember.image}
                        alt={activeMember.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent md:hidden" />
                    </div>

                    <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
                      <div>
                        <span className="inline-flex bg-accent/10 text-accent text-xs px-2.5 py-1 uppercase tracking-wider font-semibold mb-4">
                          Leadership
                        </span>
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-white">
                          {activeMember.name}
                        </h3>
                        <p className="text-accent text-sm mt-2 mb-5">{activeMember.role}</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {activeMember.bio}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => goToLeader(activeLeader - 1)}
                            className="w-11 h-11 bg-white dark:bg-white/10 hover:bg-accent hover:text-white text-gray-600 dark:text-white/70 flex items-center justify-center transition-colors"
                            aria-label="Previous leader"
                          >
                            <ArrowLeft size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => goToLeader(activeLeader + 1)}
                            className="w-11 h-11 bg-white dark:bg-white/10 hover:bg-accent hover:text-white text-gray-600 dark:text-white/70 flex items-center justify-center transition-colors"
                            aria-label="Next leader"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>

                        {activeMember.linkedin && (
                          <a
                            href={activeMember.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-primary dark:hover:text-white transition-colors"
                          >
                            <Link2 size={16} /> LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 content-start">
              {leadership.map((member, i) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setActiveLeader(i)}
                  className={`group text-left bg-white dark:bg-primary border transition-all overflow-hidden ${
                    activeLeader === i ? 'border-accent shadow-lg -translate-y-1' : 'border-gray-100 dark:border-white/10 hover:border-accent/40'
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                        activeLeader === i ? 'scale-100' : ''
                      }`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent transition-opacity ${
                      activeLeader === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-bold text-primary dark:text-white text-sm line-clamp-1">{member.name}</h4>
                    <p className="text-accent text-xs mt-1 line-clamp-1">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
