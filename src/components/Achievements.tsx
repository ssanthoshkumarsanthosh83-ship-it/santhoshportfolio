import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Medal, Star, Target, Code, Users, BookOpen } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  icon: React.ElementType;
  date: string;
  category: 'coding' | 'academic' | 'leadership' | 'competition';
  highlight?: boolean;
}

const achievements: Achievement[] = [
  {
    title: 'Hackathon Winner - TechFest 2023',
    description: 'First place in the 24-hour coding hackathon organized at college tech fest. Built an AI-powered student assistance platform.',
    icon: Trophy,
    date: 'Oct 2023',
    category: 'coding',
    highlight: true,
  },
  {
    title: 'LeetCode 150+ Problems Solved',
    description: 'Solved 150+ DSA problems on LeetCode, ranking among top 15% of users globally.',
    icon: Code,
    date: 'Ongoing',
    category: 'coding',
    highlight: true,
  },
  {
    title: 'NPTEL Star Performer',
    description: 'Achieved elite status in NPTEL Programming in Java course with 90+ percentile.',
    icon: Star,
    date: 'Oct 2023',
    category: 'academic',
    highlight: true,
  },
  {
    title: 'Technical Club President',
    description: 'Led the college technical club, organizing workshops, coding competitions, and tech talks for 200+ students.',
    icon: Users,
    date: '2023 - 2024',
    category: 'leadership',
  },
  {
    title: 'Smart India Hackathon Finalist',
    description: 'Selected as finalist for the national-level Smart India Hackathon 2023 under the software development category.',
    icon: Medal,
    date: 'Dec 2023',
    category: 'competition',
  },
  {
    title: 'Dean\'s List - Academic Excellence',
    description: 'Recognized for maintaining consistent academic performance throughout the degree program.',
    icon: BookOpen,
    date: '2022 - 2024',
    category: 'academic',
  },
  {
    title: 'Open Source Contributor',
    description: 'Active contributor to open-source projects with 50+ contributions on GitHub. Participated in Hacktoberfest.',
    icon: Code,
    date: 'Oct 2023',
    category: 'coding',
  },
  {
    title: 'Inter-College Coding Competition - 2nd Place',
    description: 'Secured second position in inter-college coding competition with participation from 50+ colleges.',
    icon: Target,
    date: 'Mar 2023',
    category: 'competition',
  },
];

const categoryColors = {
  coding: 'from-blue-500 to-cyan-500',
  academic: 'from-green-500 to-emerald-500',
  leadership: 'from-purple-500 to-violet-500',
  competition: 'from-orange-500 to-red-500',
};

const Achievements = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const highlightAchievements = achievements.filter((a) => a.highlight);
  const otherAchievements = achievements.filter((a) => !a.highlight);

  return (
    <section
      id="achievements"
      className="py-20 lg:py-32 bg-white dark:bg-dark-900 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold rounded-full mb-4">
            Achievements
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Awards & <span className="gradient-text">Recognition</span>
          </h2>
          <p className="section-subtitle">
            Milestones and accolades from my academic and professional journey
          </p>
        </motion.div>

        {/* Highlight Achievements */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {highlightAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-dark-800 dark:to-dark-850 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 hover:border-primary-500/50 transition-all hover:shadow-xl">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[achievement.category]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <achievement.icon className="w-7 h-7 text-white" />
                </div>

                {/* Date */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {achievement.date}
                </span>

                {/* Title */}
                <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mt-2 mb-3">
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {achievement.description}
                </p>

                {/* Category Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[achievement.category]} text-white`}>
                    {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {otherAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-4 border border-gray-100 dark:border-dark-700 hover:border-primary-500/30 transition-all hover:shadow-lg flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${categoryColors[achievement.category]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {achievement.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {achievement.date}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '5+', label: 'Certifications' },
            { value: '10+', label: 'Projects Completed' },
            { value: '150+', label: 'LeetCode Problems' },
            { value: '2', label: 'Hackathon Wins' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-4 text-center text-white"
            >
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
