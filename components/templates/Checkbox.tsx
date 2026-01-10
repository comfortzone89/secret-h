interface CheckboxLabels {
  off: string;
  on: string;
}

interface CheckboxProps {
  onChange: (checked: boolean) => void;
  labels: CheckboxLabels;
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, labels }) => {
  return (
    <label className="flex items-center cursor-pointer select-none">
      <span className="mr-1 text-sm text-gray-400">{labels.off}</span>

      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          onChange={(e) => onChange(e.target.checked)}
        />

        {/* Track */}
        <div className="block w-10 h-6 rounded-full bg-gray-600 peer-checked:bg-gray-500 transition-colors"></div>

        {/* Thumb */}
        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform peer-checked:translate-x-4"></div>
      </div>

      <span className="ml-1 text-sm text-gray-400">{labels.on}</span>
    </label>
  );
};

export default Checkbox;
