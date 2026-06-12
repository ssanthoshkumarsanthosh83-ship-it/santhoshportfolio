import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Building2 } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  platform: string;
  date: string;
  credentialId?: string;
  image: string;
  description: string;
  skills: string[];
}

const certifications: Certification[] = [
  {
    title: 'Programming in Java',
    issuer: 'NPTEL',
    platform: 'NPTEL - IIT Kharagpur',
    date: 'Oct 2023',
    credentialId: 'NPTEL23JAV12345',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Comprehensive course on Java programming covering OOP concepts, data structures, and algorithms.',
    skills: ['Java', 'OOP', 'Data Structures'],
  },
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta',
    platform: 'Coursera',
    date: 'Aug 2023',
    credentialId: 'META23FED67890',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Professional certificate covering React, JavaScript, HTML, CSS, and frontend best practices.',
    skills: ['React', 'JavaScript', 'HTML/CSS'],
  },
  {
    title: 'The Complete Web Developer Bootcamp',
    issuer: 'Dr. Angela Yu',
    platform: 'Udemy',
    date: 'Jun 2023',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Complete web development course covering frontend, backend, and database technologies.',
    skills: ['Full Stack', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Python for Data Science',
    issuer: 'IBM',
    platform: 'Coursera',
    date: 'Mar 2023',
    image: 'https://images.pexels.com/photos/1181248/pexels-photo-1181248.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Data analysis and visualization using Python, pandas, and machine learning basics.',
    skills: ['Python', 'Data Analysis', 'ML'],
  },
  {
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    platform: 'AWS Training',
    date: 'Jan 2024',
    credentialId: 'AWS24CP98765',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Fundamental understanding of AWS Cloud services, security, and architecture.',
    skills: ['AWS', 'Cloud Computing', 'DevOps'],
  },
  {
    title: 'Web Development Workshop',
    issuer: 'Google Developer Student Club',
    platform: 'GDSC Campus Workshop',
    date: 'Sep 2022',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Hands-on workshop on modern web development technologies and best practices.',
    skills: ['Web Dev', 'HTML/CSS', 'JavaScript'],
  },
];

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="certifications"
      className="py-20 lg:py-32 bg-gray-50 dark:bg-dark-950 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

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
            Certifications
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Professional <span className="gradient-text">Credentials</span>
          </h2>
          <p className="section-subtitle">
            Certifications and courses that have enhanced my technical skills
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-dark-700 card-hover">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">{cert.platform}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{cert.date}</span>
                    {cert.credentialId && (
                      <>
                        <span className="text-gray-300 dark:text-dark-600">|</span>
                        <span className="text-primary-500">{cert.credentialId}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {cert.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {cert.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
