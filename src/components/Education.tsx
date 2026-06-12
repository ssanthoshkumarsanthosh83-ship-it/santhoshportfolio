import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';

interface EducationItem {
  degree: string;
  institution: string;
  university: string;
  location: string;
  year: string;
  score: string;
  scoreType: string;
  achievements?: string[];
}

const educationData: EducationItem[] = [
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'ABC Engineering College',
    university: 'State Technical University',
    location: 'New Delhi, India',
    year: '2020 - 2024',
    score: '8.5',
    scoreType: 'CGPA',
    achievements: [
      'Dean\'s List for Academic Excellence',
      'Technical Club President',
      'Hackathon Winner - TechFest 2023',
    ],
  },
  {
    degree: 'Higher Secondary Education (Science)',
    institution: 'XYZ Senior Secondary School',
    university: 'CBSE Board',
    location: 'New Delhi, India',
    year: '2018 - 2020',
    score: '92%',
    scoreType: 'Percentage',
    achievements: ['Science Olympiad Finalist', 'School Topper in Computer Science'],
  },
  {
    degree: 'Secondary Education',
    institution: 'XYZ High School',
    university: 'CBSE Board',
    location: 'New Delhi, India',
    year: '2016 - 2018',
    score: '95%',
    scoreType: 'Percentage',
    achievements: ['Class Topper', 'Mathematics Olympiad Winner'],
  },
];

const Education = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="education"
      className="py-20 lg:py-32 bg-white dark:bg-dark-900 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

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
            Education
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Academic <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle">
            My educational background and academic achievements
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500" />

          <div className="space-y-12">
            {educationData.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-white dark:border-dark-900 flex items-center justify-center z-10">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>

                {/* Content Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-dark-700"
                  >
                    {/* Year Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                      <Calendar className="w-4 h-4" />
                      {item.year}
                    </div>

                    {/* Degree */}
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                      {item.degree}
                    </h3>

                    {/* Institution */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4 text-primary-500" />
                        <span>{item.institution}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg">
                        <div className="text-2xl font-bold text-white">{item.score}</div>
                        <div className="text-xs text-white/80">{item.scoreType}</div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Award className="w-5 h-5" />
                        <span className="font-medium">Excellent</span>
                      </div>
                    </div>

                    {/* Achievements */}
                    {item.achievements && (
                      <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-1">
                          {item.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span className="text-primary-500 mt-1">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
