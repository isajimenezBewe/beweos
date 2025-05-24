import { Button } from "@heroui/button";
import { useTheme } from "../hooks/useTheme";

export default function TestThemePage() {
  const { theme, setTheme, currentColor, currentMode } = useTheme();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Direct HeroUI Theme Test</h1>
      
      <div className="mb-4">
        <p>Current theme: <strong>{theme}</strong></p>
        <p>Current color: <strong>{currentColor}</strong></p>
        <p>Current mode: <strong>{currentMode}</strong></p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Light Themes</h3>
          <div className="space-y-2">
            <Button onClick={() => setTheme('light')} color="primary" variant="flat">
              Blue Light (default)
            </Button>
            <Button onClick={() => setTheme('orange')} color="primary" variant="flat">
              Orange Light
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Dark Themes</h3>
          <div className="space-y-2">
            <Button onClick={() => setTheme('dark')} color="primary" variant="flat">
              Blue Dark (default)
            </Button>
            <Button onClick={() => setTheme('dark-orange')} color="primary" variant="flat">
              Orange Dark
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-content1 rounded-lg border border-divider">
          <p className="text-foreground">This is content1 background with foreground text</p>
        </div>
        
        <div className="flex gap-2">
          <Button color="primary">Primary Button</Button>
          <Button color="primary" variant="bordered">Bordered</Button>
          <Button color="primary" variant="flat">Flat</Button>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="w-32 h-16 bg-primary rounded-lg"></div>
          <span>bg-primary</span>
        </div>
        
        <p className="text-primary text-xl font-semibold">Primary colored text</p>
      </div>
    </div>
  );
} 