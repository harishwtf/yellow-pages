interface HandCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** A hand-drawn checkbox: wobbly box, red tick when checked. */
export function HandCheckbox({ id, label, checked, onChange }: HandCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="group inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded px-1 has-[:focus-visible]:outline-[2.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pen-blue"
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <svg aria-hidden="true" className="h-8 w-8 shrink-0" viewBox="0 0 28 28" fill="none">
        <path
          d="M4.5 4.2C12 3.5 20 4.7 24 4.2c.7 7.8-.6 15.8 0 19.8-8 .7-16-.6-20 0C3.4 16.2 4.7 8.2 4.5 4.2Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
          className="text-ink"
        />
        <path
          d="M6.5 14c3 2.5 5 5 6.5 8C15.5 15 20.5 8 26 2.5"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-pen-red transition-opacity duration-150"
          style={{ opacity: checked ? 1 : 0 }}
        />
      </svg>
      <span className="hand text-2xl leading-none text-pen-blue">{label}</span>
    </label>
  );
}
