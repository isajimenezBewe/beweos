import { useTheme as useHeroUITheme } from '@heroui/use-theme';
import { useEffect } from 'react';

type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'yellow';
type ThemeMode = 'light' | 'dark';

export function useTheme() {
  const { theme, setTheme } = useHeroUITheme();
  
  // Determine current color and mode from theme string
  const getCurrentColor = (): ThemeColor => {
    if (theme === 'purple' || theme === 'purple-dark') return 'purple';
    if (theme === 'green' || theme === 'green-dark') return 'green';
    if (theme === 'orange' || theme === 'orange-dark') return 'orange';
    if (theme === 'yellow' || theme === 'yellow-dark') return 'yellow';
    return 'blue'; // default for 'light' and 'dark' themes
  };
  
  const getCurrentMode = (): ThemeMode => {
    if (theme === 'dark' || theme?.endsWith('-dark')) return 'dark';
    return 'light';
  };
  
  // Set theme based on color and mode
  const setColorAndMode = (color: ThemeColor, mode: ThemeMode) => {
    let themeToApply: string;
    
    if (color === 'blue') {
      // For blue, use 'light' or 'dark' directly
      themeToApply = mode;
    } else {
      // For other colors, use color name or 'dark-{color}'
      themeToApply = mode === 'dark' ? `${color}-dark` : color;
    }
    
    console.log('Setting theme to:', themeToApply);
    setTheme(themeToApply);
  };
  
  // Toggle between light and dark mode
  const toggleMode = () => {
    const currentMode = getCurrentMode();
    const currentColor = getCurrentColor();
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setColorAndMode(currentColor, newMode);
  };
  
  // Set color (keeping current mode)
  const setColor = (color: ThemeColor) => {
    const currentMode = getCurrentMode();
    setColorAndMode(color, currentMode);
  };
  
  return {
    theme,
    currentColor: getCurrentColor(),
    currentMode: getCurrentMode(),
    setColorAndMode,
    setColor,
    toggleMode,
    setTheme // expose the raw setTheme for testing
  };
} 