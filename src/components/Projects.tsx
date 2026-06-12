import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, Folder, Star, GitFork } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured?: boolean;
  stats?: {
    stars: number;
    forks: number;
  };
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Employee Management System',
    description:
      'A comprehensive web application for managing employee data, attendance, and payroll. Features include role-based access control, real-time analytics, and automated report generation.',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS'],
    liveUrl: 'https://employee-management-demo.com',
    githubUrl: 'https://github.com/johndoe/employee-management',
    category: 'fullstack',
    featured: true,
    stats: { stars: 45, forks: 12 },
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management. Includes admin dashboard for inventory management.',
    image: 'https://images.pexels.com/photos/2305445/pexels-photo-2305445.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React.js', 'Redux', 'Node.js', 'PostgreSQL', 'Stripe API'],
    liveUrl: 'https://ecommerce-platform-demo.com',
    githubUrl: 'https://github.com/johndoe/ecommerce-platform',
    category: 'fullstack',
    featured: true,
    stats: { stars: 67, forks: 23 },
  },
  {
    id: 3,
    title: 'Student Management System',
    description:
      'An intuitive student information system for educational institutions. Features include student records, grade management, attendance tracking, and parent portal.',
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf', 'Bootstrap'],
    githubUrl: 'https://github.com/johndoe/student-management',
    category: 'backend',
    stats: { stars: 32, forks: 8 },
  },
  {
    id: 4,
    title: 'Personal Portfolio Website',
    description:
      'A modern, responsive portfolio website showcasing my skills and projects. Built with React and Tailwind CSS featuring smooth animations and dark mode.',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://johndoe-portfolio.com',
    githubUrl: 'https://github.com/johndoe/portfolio',
    category: 'frontend',
    featured: true,
    stats: { stars: 89, forks: 34 },
  },
  {
    id: 5,
    title: 'To-Do Application',
    description:
      'A feature-rich task management app with drag-and-drop functionality, categories, priority levels, and deadline reminders. Includes dark mode and mobile responsiveness.',
    image: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React.js', 'Context API', 'CSS Modules', 'Local Storage'],
    liveUrl: 'https://todo-app-demo.com',
    githubUrl: 'https://github.com/johndoe/todo-app',
    category: 'frontend',
    stats: { stars: 56, forks: 18 },
  },
  {
    id: 6,
    title: 'Weather Forecast App',
    description:
      'A real-time weather application displaying current conditions and 7-day forecast. Features location-based weather, interactive maps, and weather alerts.',
    image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=600',
    technologies: ['React.js', 'OpenWeather API', 'Chart.js', 'Leaflet'],
    liveUrl: 'https://weather-app-demo.com',
    githubUrl: 'https://github.com/johndoe/weather-app',
    category: 'frontend',
    stats: { stars: 41, forks: 15 },
  },
];

const categories = [
  { id: 'all', label: 'All Projects', icon: Folder },
  { id: 'frontend', label: 'Frontend', icon: null },
  { id: 'backend', label: 'Backend', icon: null },
  { id: 'fullstack', label: 'Full Stack', icon: null },
];

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="projects"
      className="py-20 lg:py-32 bg-white dark:bg-dark-900 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

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
            Portfolio
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Real-world projects that demonstrate my technical skills and problem-solving abilities
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
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-gray-50 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              layout
              className="group"
            >
              <div className="h-full bg-gray-50 dark:bg-dark-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-700 hover:border-primary-500/50 transition-all hover:shadow-xl">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/50 to-transparent" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">Code</span>
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-primary-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Demo</span>
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.stats && (
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {project.stats.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {project.stats.forks}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded-md border border-gray-200 dark:border-dark-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 text-gray-400 text-xs">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/johndoe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
