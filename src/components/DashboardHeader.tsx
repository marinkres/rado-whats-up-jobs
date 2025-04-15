
import { BellIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-white border-b">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-rado-text">Rado Dashboard</h1>
        <span className="px-2 py-1 text-xs bg-rado-secondary text-rado-text rounded-full">Beta</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5 text-rado-text" />
        </Button>
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5 text-rado-text" />
        </Button>
        <Button className="bg-rado-primary text-white hover:bg-rado-primary/90">
          Post New Job
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
