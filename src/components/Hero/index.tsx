import { motion } from 'framer-motion';
import './hero.styles.scss';

export const Hero = () => {
  const transition = {
    duration: 0.8,
    delay: 0.2,
    ease: [0, 0.71, 0.2, 1.01]
  };

  return (
    <motion.div
      className="hero-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <motion.h1
        className="hero-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: 0.4 }}
      >
        Julian Benitez
      </motion.h1>
      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: 0.6 }}
      >
        Software Engineer
      </motion.p>
    </motion.div>
  );
};
