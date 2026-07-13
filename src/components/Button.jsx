const variants = {
  primary: 'bg-amber text-white hover:bg-amber-soft shadow-sm',
  secondary: 'border border-sand bg-white text-muted hover:bg-warm',
  coffee: 'bg-coffee text-cream hover:bg-coffee-deep shadow-sm',
  ghost: 'text-coffee hover:bg-warm',
  danger: 'text-rose-600 hover:bg-rose-50',
};

const sizes = {
  md: 'min-h-[42px] px-6 py-2.5 text-sm',
  sm: 'min-h-9 px-4 py-2 text-xs',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-tight transition disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
