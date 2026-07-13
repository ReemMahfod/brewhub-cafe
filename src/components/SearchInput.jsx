export default function SearchInput({ className = '', ...props }) {
  return (
    <input
      type="search"
      className={`h-10 rounded-full border border-sand bg-warm px-4 text-sm outline-none focus:border-amber ${className}`}
      {...props}
    />
  );
}
