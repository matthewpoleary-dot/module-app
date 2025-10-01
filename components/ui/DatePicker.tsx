// components/ui/DatePicker.tsx
import Select from './Select';

const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

function buildDates(days = 180) {
  const res: {label:string; value:string}[] = [];
  const start = new Date();
  start.setHours(0,0,0,0);
  for (let i=0; i<days; i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    res.push({ label: fmt(d), value: d.toISOString().slice(0,10) }); // YYYY-MM-DD
  }
  return res;
}
const DATE_OPTS = buildDates();

export default function DatePicker({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string)=>void }) {
  return (
    <Select
      label={label}
      value={value}
      options={DATE_OPTS}
      onChange={(o)=>onChange(String(o.value))}
    />
  );
}
