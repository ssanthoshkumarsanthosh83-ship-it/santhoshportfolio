import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  type: string;
  location: string;
  duration: string;
  description: string;
  responsibilities: string[];
  learnings: string[];
  technologies: string[];
  logo?: string;
}

const experiences: Experience[] = [
  {
    company: 'Tech Solutions Pvt Ltd',
    role: 'Frontend Developer Intern',
    type: 'Internship',
    location: 'Remote',
    duration: 'Jan 2024 - Apr 2024',
    description:
      'Worked as a Frontend Developer Intern, contributing to multiple client projects and learning modern web development practices.',
    responsibilities: [
      'Developed responsive user interfaces using React.js and Tailwind CSS',
      'Collaborated with the design team to implement pixel-perfect UI components',
      'Integrated RESTful APIs and managed application state using Redux',
      'Participated in code reviews and implemented feedback for quality improvement',
      'Wrote unit tests using Jest and React Testing Library',
    ],
    learnings: [
      'Real-world application of React.js and state management',
      'Working in an Agile development environment',
      'Team collaboration and code review practices',
      'Production-level deployment and CI/CD workflows',
    ],
    technologies: ['React.js', 'Redux', 'Tailwind CSS', 'Git', 'Jest'],
  },
  {
    company: 'StartUp Hub',
    role: 'Web Development Trainee',
    type: 'Training Program',
    location: 'New Delhi, India',
    duration: 'Jun 2023 - Dec 2023',
    description:
      '6-month intensive training program focused on full-stack web development with hands-on project experience.',
    responsibilities: [
      'Built multiple mini-projects to practice web development concepts',
      'Learned and applied MERN stack development',
      'Participated in daily stand-ups and sprint planning sessions',
      'Contributed to an open-source project as a team',
      'Created technical documentation for developed features',
    ],
    learnings: [
      'MERN stack development from scratch',
      'Database design and management',
      'Version control and collaboration workflows',
      'Problem-solving and debugging techniques',
    ],
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Git'],
  },
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="experience"
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
            Experience
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subtitle">
            My journey through internships and professional training
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-dark-700">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 dark:border-dark-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-lg">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                        <Briefcase className="w-4 h-4" />
                        {exp.type}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {exp.description}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                  {/* Responsibilities */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Learnings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs font-bold">
                        L
                      </span>
                      Key Learnings
                    </h4>
                    <ul className="space-y-2">
                      {exp.learnings.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 + i * 0.05 }}
                          className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technologies */}
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Technologies Used:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200 dark:border-dark-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Looking for new opportunities to apply my skills and grow as a developer.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
