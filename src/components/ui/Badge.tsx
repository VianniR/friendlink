type BadgeProps = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Badge({ children, selected, onClick, className = "" }: BadgeProps) {
  const base =
    "inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full transition-colors";
  const style = selected
    ? "bg-violet-600 text-white"
    : onClick
      ? "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 cursor-pointer"
      : "bg-slate-100 text-slate-600";

  return (
    <span className={`${base} ${style} ${className}`} onClick={onClick}>
      {children}
    </span>
  );
}
