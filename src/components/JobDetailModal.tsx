import { Job } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";

interface JobDetailModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailModal = ({ job, open, onOpenChange }: JobDetailModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-serif text-heading text-foreground">
            {job.title}
          </DialogTitle>
          <DialogDescription className="text-body text-foreground font-medium">
            {job.company}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-1 text-small text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="text-border">·</span>
          <span>{job.mode}</span>
          <span className="text-border">·</span>
          <span>{job.experience === "Fresher" ? "Fresher" : `${job.experience} yrs`}</span>
          <span className="text-border">·</span>
          <span>{job.salaryRange}</span>
        </div>

        <div className="flex flex-wrap gap-0.5 mt-1">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-2 text-small text-muted-foreground whitespace-pre-line leading-relaxed">
          {job.description}
        </div>

        <div className="mt-3 flex justify-end">
          <Button asChild>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-0.5" />
              Apply Now
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
