
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

type Application = {
  id: number;
  name: string;
  status: "New" | "Contacted" | "Interview" | "Hired" | "Rejected";
  appliedDate: string;
  jobTitle: string;
  matchScore: number;
};

const applications: Application[] = [
  {
    id: 1,
    name: "Sandro Michel",
    status: "New",
    appliedDate: "Fri, 29. March 2024, 11:15",
    jobTitle: "Demo Job",
    matchScore: 86,
  },
  {
    id: 2,
    name: "Francisco de Latour",
    status: "Contacted",
    appliedDate: "Mon, 29. Jan 2024, 08:16",
    jobTitle: "Demo Job",
    matchScore: 65,
  },
  {
    id: 3,
    name: "Leonardo Tartufferi",
    status: "Interview",
    appliedDate: "Sat, 27. Jan 2024, 16:01",
    jobTitle: "CDI - Conseiller de vente",
    matchScore: 49,
  },
];

const statusColors = {
  New: "bg-green-100 text-green-800",
  Contacted: "bg-blue-100 text-blue-800",
  Interview: "bg-purple-100 text-purple-800",
  Hired: "bg-amber-100 text-amber-800",
  Rejected: "bg-red-100 text-red-800",
};

const ApplicationsList = () => {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-medium">{application.name}</h3>
              <Badge
                variant="secondary"
                className={statusColors[application.status]}
              >
                {application.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{application.appliedDate}</span>
              <span>•</span>
              <span>{application.jobTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-32">
              <Progress value={application.matchScore} className="bg-[#F5EDE3]" />
              <p className="text-xs text-gray-500 mt-1 text-right">{application.matchScore}% match</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsList;
