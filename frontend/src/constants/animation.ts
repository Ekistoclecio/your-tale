export const animationVariants = {
  none: {},

  subtleBounce: {
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.1 },
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },

  fadeSlideIn: {
    variants: {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
      },
    },
    initial: 'initial',
    animate: 'animate',
  },

  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },

  fadeSlideInChildren: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};
