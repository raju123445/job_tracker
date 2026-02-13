import { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, Eye } from "lucide-react";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onSave: (id: string) => void;
  onView: (job: Job) => void;
}

const sourceColor: Record<string, string> = {
  LinkedIn: "bg-primary/10 text-primary border-primary/20",
  Naukri: "bg-success/10 text-success border-success/20",
  Indeed: "bg-warning/10 text-warning border-warning/20",
};

const formatPosted = (days: number) => {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const JobCard = ({ job, isSaved, onSave, onView }: JobCardProps) => {
  return (
    <Card className="p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-serif text-subheading text-foreground leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-body text-foreground font-medium mt-0.5">
            {job.company}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 text-xs ${sourceColor[job.source] || ""}`}
        >
          {job.source}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-1 text-small text-muted-foreground">
        <span className="inline-flex items-center gap-0.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="text-border">·</span>
        <span>{job.mode}</span>
        <span className="text-border">·</span>
        <span>{job.experience === "Fresher" ? "Fresher" : `${job.experience} yrs`}</span>
      </div>

      <p className="text-small text-muted-foreground">{job.salaryRange}</p>

      <div className="flex items-center justify-between mt-0.5">
        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatPosted(job.postedDaysAgo)}
        </span>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(job)}>
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(job.id)}
            className={isSaved ? "text-primary" : ""}
          >
            {isSaved ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Apply</span>
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
