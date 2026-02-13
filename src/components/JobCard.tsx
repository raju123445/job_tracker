import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { JobStatus, useJobStatus } from "@/hooks/use-job-status";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
  matchScore?: number; // Optional match score to display
  isSaved: boolean;
  onSave: (id: string) => void;
  onView: (job: Job) => void;
}

const sourceColor: Record<string, string> = {
  LinkedIn: "bg-primary/10 text-primary border-primary/20",
  Naukri: "bg-success/10 text-success border-success/20",
  Indeed: "bg-warning/10 text-warning border-warning/20",
};

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-200";
  if (score >= 40) return "bg-gray-100 text-gray-800 border-gray-200";
  return "bg-gray-50 text-gray-500 border-gray-100";
};

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "Not Applied":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Applied":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "Selected":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatPosted = (days: number) => {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const JobCard = ({ job, matchScore, isSaved, onSave, onView }: JobCardProps) => {
  const { getStatus, updateStatus } = useJobStatus();
  const currentStatus = getStatus(job.id);

  const handleStatusChange = (status: JobStatus) => {
    updateStatus(job.id, status);
    
    // Show toast notification for certain status changes
    if (status === "Applied" || status === "Rejected" || status === "Selected") {
      toast.success(`Status updated: ${status}`);
    }
  };

  return (
    <Card className="p-4 md:p-5 flex flex-col gap-3 md:gap-4 h-full border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base md:text-lg font-semibold text-foreground leading-tight">
              {job.title}
            </h3>
            <p className="text-sm md:text-base text-foreground font-medium mt-1">
              {job.company}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-1.5 md:flex-col md:items-end">
            {matchScore !== undefined && (
              <Badge
                variant="outline"
                className={`shrink-0 text-xs font-medium ${getMatchScoreColor(matchScore)}`}
              >
                {matchScore}%
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`shrink-0 text-xs font-medium ${getStatusColor(currentStatus)}`}
            >
              {currentStatus}
            </Badge>
            <Badge
              variant="outline"
              className={`shrink-0 text-xs font-medium ${sourceColor[job.source] || ""}`}
            >
              {job.source}
            </Badge>
          </div>
        </div>
      </div>

      {/* Meta Information - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{formatPosted(job.postedDaysAgo)}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-xs">📊</span>
          <span className="truncate">{job.experience === "Fresher" ? "Fresher" : `${job.experience}y`}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-xs">🏢</span>
          <span className="truncate">{job.mode}</span>
        </div>
      </div>

      {/* Salary Info */}
      <p className="text-xs md:text-sm font-medium text-muted-foreground">{job.salaryRange}</p>

      {/* Status Selection - Horizontal with Label */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Status:</span>
          <div className="flex gap-1.5 flex-wrap">
            {(["Not Applied", "Applied", "Rejected", "Selected"] as JobStatus[]).map((status) => (
              <Button
                key={status}
                variant={currentStatus === status ? "default" : "outline"}
                size="sm"
                className={`h-7 px-2.5 text-xs font-medium transition-colors ${
                  status === "Applied" ? currentStatus === status ? "bg-blue-600 text-white" : "border-blue-200 text-blue-700 hover:bg-blue-50" :
                  status === "Rejected" ? currentStatus === status ? "bg-red-600 text-white" : "border-red-200 text-red-700 hover:bg-red-50" :
                  status === "Selected" ? currentStatus === status ? "bg-green-600 text-white" : "border-green-200 text-green-700 hover:bg-green-50" :
                  currentStatus === status ? "bg-gray-600 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleStatusChange(status)}
                title={`Set status to ${status}`}
              >
                {status.charAt(0)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-3 flex items-center gap-1.5 flex-wrap">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView(job)}
          className="flex-1 min-w-20 text-xs md:text-sm h-8 md:h-9 gap-1.5"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(job.id)}
          className={`flex-1 min-w-20 text-xs md:text-sm h-8 md:h-9 gap-1.5 ${ isSaved ? "text-primary" : ""}`}
        >
          {isSaved ? (
            <BookmarkCheck className="h-3.5 w-3.5" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
          <span>Save</span>
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          asChild
          className="flex-1 min-w-20 text-xs md:text-sm h-8 md:h-9 gap-1.5"
        >
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Apply</span>
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
