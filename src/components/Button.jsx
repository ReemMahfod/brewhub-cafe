const variants = {
  primary: 'bg-amber text-white hover:bg-amber-soft shadow-sm',
  secondary: 'border border-sand bg-white text-muted hover:bg-warm',
  coffee: 'bg-coffee text-cream hover:bg-coffee-deep shadow-sm',
  ghost: 'text-coffee hover:bg-warm',
  danger: 'text-rose-600 hover:bg-rose-50',
};

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
