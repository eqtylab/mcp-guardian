/**
 * @deprecated
 */
// Micro component for compact select
export const CompactSelect: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}> = ({ value, options, onChange, label, className = "" }) => (
  <div className={`text-xs ${className}`}>
    {label && <label className="block text-muted-foreground text-[10px] mb-0.5">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-1 px-1.5 rounded border border-border bg-background text-xs"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
