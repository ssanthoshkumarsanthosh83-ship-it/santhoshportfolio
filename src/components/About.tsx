import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code, Target, Lightbulb, Rocket, Award, Heart } from 'lucide-react';

const highlights = [
  {
    icon: Code,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable, and efficient code',
  },
  {
    icon: Target,
    title: 'Problem Solver',
    description: 'Breaking down complex problems into simple solutions',
  },
  {
    icon: Lightbulb,
    title: 'Quick Learner',
    description: 'Adapting to new technologies rapidly',
  },
  {
    icon: Rocket,
    title: 'Goal Oriented',
    description: 'Focused on delivering quality results on time',
  },
  {
    icon: Award,
    title: 'Detail Focused',
    description: 'Attention to pixel-perfect designs and UX',
  },
  {
    icon: Heart,
    title: 'Passionate',
    description: 'Genuinely enthusiastic about technology',
  },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="py-20 lg:py-32 bg-white dark:bg-dark-900 relative overflow-hidden"
    >
      {/* Background Elements */}
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
            About Me
          </span>
          <h2 className="section-title text-gray-900 dark:text-white">
            Get to Know <span className="gradient-text">Me Better</span>
          </h2>
          <p className="section-subtitle">
            A passionate developer on a mission to create impactful digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Developer working"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
              </div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-dark-700"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">10+</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">5+</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Certifications</div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              I'm John Doe, a Fresher Software Developer
            </h3>

            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              <p>
                I am a recent Computer Science graduate with a burning passion for web development
                and software engineering. My journey in the world of coding started during my college
                days, and since then, I have been on an exciting path of continuous learning and
                skill development.
              </p>
              <p>
                I specialize in building modern, responsive, and user-friendly web applications
                using technologies like React.js, JavaScript, and Tailwind CSS. I believe in writing
                clean, maintainable code and following best practices in software development.
              </p>
              <p>
                My career objective is to work with a dynamic organization where I can apply my
                technical skills, contribute to innovative projects, and grow as a professional
                software developer. I am always eager to learn new technologies and take on
                challenging projects.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <item.icon className="w-6 h-6 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
