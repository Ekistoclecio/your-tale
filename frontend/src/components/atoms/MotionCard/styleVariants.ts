export const cardStyleVariants = {
  session: {
    background: 'linear-gradient(135deg, #7A5E84 0%, #5C3C5F 100%)',
    border: '2px solid',
    borderColor: 'primary.main',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(56, 36, 61, 0.3)',
    position: 'relative' as const,
  },
  default: {
    background: 'linear-gradient(135deg, #38243D 0%, #5C3C5F 100%)',
    border: '3px solid',
    borderColor: 'secondary.main',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(230, 167, 74, 0.2)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
};
