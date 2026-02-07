import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioGroup({ label, options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label mb-3">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              value === option.value
                ? 'bg-white text-black border-white'
                : 'bg-gray-900 border-gray-700 hover:border-gray-500'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-0.5 w-5 h-5 cursor-pointer"
              style={{
                accentColor: value === option.value ? '#000000' : '#666666'
              }}
            />
            <div className="flex-1">
              <div className={`font-bold text-base ${value === option.value ? 'text-black' : 'text-white'}`}>
                {option.label}
              </div>
              {option.description && (
                <div className={`text-sm mt-1 ${value === option.value ? 'text-gray-800' : 'text-gray-500'}`}>
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
