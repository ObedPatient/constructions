import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import type { TeamMember } from '../../types';

interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
}

export default function TeamMemberCard({ member, index = 0 }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-primary overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <p className="text-white/80 text-sm leading-relaxed mb-4">{member.bio}</p>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-white text-sm font-medium transition-colors"
            >
              <Link2 size={14} /> LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Name strip */}
      <div className="p-5 border-t-2 border-transparent group-hover:border-accent transition-all duration-300">
        <h3 className="font-display font-bold text-primary dark:text-white text-lg">{member.name}</h3>
        <p className="text-accent text-sm mt-0.5">{member.role}</p>
      </div>
    </motion.div>
  );
}
