import { useState } from "react";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import { Bookmark } from "lucide-react";

const Saved = () => {
  const { savedIds, isSaved, toggleSave } = useSavedJobs();
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  if (savedJobs.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background px-3">
        <div className="text-center max-w-[var(--text-max-width)]">
          <Bookmark className="mx-auto h-5 w-5 text-muted-foreground" />
          <h1 className="mt-2 font-serif text-display text-foreground">Saved</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Jobs you bookmark will appear here for quick reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background px-3 py-3 overflow-y-auto">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <h1 className="font-serif text-display text-foreground">Saved</h1>
        <p className="mt-1 text-small text-muted-foreground">
          {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onSave={toggleSave}
              onView={setViewJob}
            />
          ))}
        </div>
      </div>

      <JobDetailModal
        job={viewJob}
        open={!!viewJob}
        onOpenChange={(open) => !open && setViewJob(null)}
      />
    </div>
  );
};

export default Saved;
