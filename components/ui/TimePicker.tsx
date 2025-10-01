// components/ui/TimePicker.tsx
import Select from './Select';

const buildTimes = (step = 15) => {
  const opts: {label: string; value: string}[] = [];
  for (let h = 7; h <= 22; h++) {
    for (let m = 0; m < 60; m += step) {
      const v = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      opts.push({ label: v, value: v });
    }
  }
  return opts;
};
const TIME_OPTS = buildTimes();

export default function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select
      label={label}
      value={value}
      options={TIME_OPTS}
      onChange={(o) => onChange(String(o.value))}
    />
  );
}
