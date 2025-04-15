
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RecentApplications = () => {
  const applications = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Restaurant Server",
      status: "New",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "Miguel Rodriguez",
      role: "Warehouse Worker",
      status: "Reviewing",
      time: "5 hours ago",
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Retail Associate",
      status: "Interviewed",
      time: "1 day ago",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <div className="bg-rado-primary w-full h-full flex items-center justify-center text-white">
                  {app.name.charAt(0)}
                </div>
              </Avatar>
              <div>
                <p className="font-medium text-rado-text">{app.name}</p>
                <p className="text-sm text-gray-500">{app.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{app.status}</Badge>
              <span className="text-sm text-gray-500">{app.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentApplications;
