import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, Eye, FileText, Award, Briefcase, GraduationCap, Code } from 'lucide-react';

const Resume = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const resumeHighlights = [
    { label: 'Education', icon: GraduationCap, value: 'B.Tech CSE' },
    { label: 'Experience', icon: Briefcase, value: '2 Internships' },
    { label: 'Projects', icon: Code, value: '10+ Projects' },
    { label: 'Certifications', icon: Award, value: '5+ Certifications' },
  ];

  return (
    <section
      id="resume"
      className="py-20 lg:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 relative overflow-hidden"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-full mb-4 backdrop-blur-sm">
            Resume
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
            Download My <span className="text-primary-300">Resume</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Get a comprehensive overview of my skills, experience, and qualifications
          </p>
        </motion.div>

        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-heading font-bold">John Doe</h3>
                  <p className="text-white/90 font-medium">Fresher Software Developer</p>
                  <p className="text-white/70 text-sm mt-1">Last Updated: January 2024</p>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {resumeHighlights.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
                  >
                    <item.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <div className="font-bold text-gray-900 dark:text-white">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Resume Content Preview */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-6 mb-6 border border-gray-100 dark:border-dark-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Resume Contents:
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Professional Summary & Career Objective
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Technical Skills & Proficiencies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Educational Qualifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Project Portfolio & Achievements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Internships & Work Experience
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    Certifications & Training
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resume PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Preview Resume
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
