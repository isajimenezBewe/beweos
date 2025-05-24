import React from 'react';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { useTheme } from '../hooks/useTheme';

export const ThemeSelector: React.FC = () => {
  const { currentColor, currentMode, setColor, toggleMode } = useTheme();

  const colorOptions = [
    { value: 'blue', label: '🔵 Blue', color: '#3B82F6' },
    { value: 'purple', label: '� Purple', color: '#DD62ED' },
  ];

  return (
    <div className="flex items-center gap-3">
      <Select
        label="Theme Color"
        placeholder="Select a color"
        selectedKeys={[currentColor]}
        onSelectionChange={(keys: any) => {
          const value = Array.from(keys)[0];
          if (value) {
            setColor(value as 'blue' | 'orange');
          }
        }}
        classNames={{
          base: "max-w-[200px]",
          trigger: "min-h-unit-10 h-10",
        }}
        renderValue={(items: any[]) => {
          const selectedOption = colorOptions.find(opt => opt.value === currentColor);
          return items.map((item: any) => (
            <div key={item.key} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedOption?.color }}
              />
              <span className="capitalize">{currentColor}</span>
            </div>
          ));
        }}
      >
        {colorOptions.map((option) => (
          <SelectItem 
            key={option.value} 
            startContent={
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: option.color }}
              />
            }
          >
            {option.label}
          </SelectItem>
        ))}
      </Select>

      <Button
        isIconOnly
        variant="flat"
        size="sm"
        onClick={toggleMode}
        aria-label="Toggle theme mode"
      >
        {currentMode === 'light' ? '🌙' : '☀️'}
      </Button>

      <div className="text-xs text-default-500 capitalize">
        {currentMode} mode
      </div>
    </div>
  );
}; 