
import { Users, Briefcase, MessageSquare, TrendingUp } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCard from "@/components/StatsCard";
import RecentApplications from "@/components/RecentApplications";

const Index = () => {
  return (
    <div className="min-h-screen bg-rado-bg-light">
      <DashboardHeader />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Candidates"
            value="1,234"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Jobs"
            value="45"
            icon={<Briefcase className="h-5 w-5" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="WhatsApp Messages"
            value="892"
            icon={<MessageSquare className="h-5 w-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Placement Rate"
            value="78%"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">WhatsApp Status</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected and Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
