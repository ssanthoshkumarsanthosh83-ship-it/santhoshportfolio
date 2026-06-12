import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools';
}

const skills: Skill[] = [
  { name: 'HTML5', level: 95, category: 'frontend' },
  { name: 'CSS3', level: 90, category: 'frontend' },
  { name: 'JavaScript', level: 85, category: 'frontend' },
  { name: 'React.js', level: 80, category: 'frontend' },
  { name: 'TypeScript', level: 75, category: 'frontend' },
  { name: 'Tailwind CSS', level: 90, category: 'frontend' },
  { name: 'Bootstrap', level: 85, category: 'frontend' },
  { name: 'Java', level: 75, category: 'backend' },
  { name: 'Python', level: 70, category: 'backend' },
  { name: 'Node.js', level: 65, category: 'backend' },
  { name: 'SQL', level: 75, category: 'backend' },
  { name: 'MongoDB', level: 60, category: 'backend' },
  { name: 'Git & GitHub', level: 85, category: 'tools' },
  { name: 'VS Code', level: 90, category: 'tools' },
  { name: 'REST APIs', level: 80, category: 'tools' },
  { name: 'Figma', level: 70, category: 'tools' },
];

const categories = [
  { id: 'all', label: 'All Skills' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'tools', label: 'Tools' },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [animatedSkills, setAnimatedSkills] = useState<string[]>([]);

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  useEffect(() => {
    if (isInView) {
      const timeouts: NodeJS.Timeout[] = [];
      filteredSkills.forEach((skill, index) => {
        const timeout = setTimeout(() => {
          setAnimatedSkills((prev) => [...prev, skill.name]);
        }, index * 100);
        timeouts.push(timeout);
      });
      return () => timeouts.forEach((t) => clearTimeout(t));
    }
  }, [isInView, activeCategory]);

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-green-500 to-emerald-500';
    if (level >= 80) return 'from-primary-500 to-cyan-500';
    if (level >= 70) return 'from-accent-500 to-teal-500';
    return 'from-orange-500 to-yellow-500';
  };

  return (
    <section
      id="skills"
      className="py-20 lg:py-32 bg-gray-50 dark:bg-dark-950 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

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
            My Skills
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Technical <span className="gradient-text">Expertise</span>
          </h2>
          <p className="section-subtitle">
            Technologies and tools I've mastered through learning and projects
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setAnimatedSkills([]);
              }}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-dark-700 group"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {skill.name}
                </h3>
                <span className="text-primary-500 font-bold text-lg">
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${getSkillColor(skill.level)} progress-bar`}
                  initial={{ width: 0 }}
                  animate={{
                    width: animatedSkills.includes(skill.name) ? `${skill.level}%` : 0,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Skill Level Indicators */}
              <div className="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Also familiar with:
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {['Redux', 'Next.js', 'SASS', 'jQuery', 'Express.js', 'MySQL', 'PostgreSQL', 'Firebase', 'Docker', 'AWS'].map(
              (skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="px-4 py-2 bg-white dark:bg-dark-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  {skill}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
