import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-yellow-500 dark:text-gray-400" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="bg-gray-200 dark:bg-gray-700"
      />
      <Moon className="h-4 w-4 text-gray-700 dark:text-yellow-300" />
    </div>
  );
}
