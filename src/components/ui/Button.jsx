function Button({ variant = 'primary', children, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300';
  const styles = {
    primary: 'bg-mint text-black shadow-glow hover:bg-[#00d6a8]',
    outline: 'border border-slate-300 text-slate-950 hover:border-slate-400 hover:bg-slate-50',
    ghost: 'text-slate-700 hover:text-slate-950',
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
