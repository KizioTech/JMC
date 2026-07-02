import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeSelector = () => {
  const { theme, setTheme, isDark, setIsDark } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <label className="text-sm font-medium">Dark Mode</label>
            </div>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};