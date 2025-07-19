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
};
