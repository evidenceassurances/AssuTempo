function GoldButton({ children, variant = 'solid', className = '', ...props }) {
  const classes = variant === 'solid'
    ? 'bg-gold text-black hover:bg-goldLight border-transparent'
    : 'border border-gold text-gold hover:bg-white/5';

  return (
    <button className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${classes} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default GoldButton;
