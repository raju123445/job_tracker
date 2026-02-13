import { useState, useMemo } from "react";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import FilterBar, { Filters } from "@/components/FilterBar";

const defaultFilters: Filters = {
  keyword: "",
  location: "All",
  mode: "All",
  experience: "All",
  source: "All",
  sort: "Latest",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const { isSaved, toggleSave } = useSavedJobs();

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw)
      );
    }
    if (filters.location !== "All")
      result = result.filter((j) => j.location === filters.location);
    if (filters.mode !== "All")
      result = result.filter((j) => j.mode === filters.mode);
    if (filters.experience !== "All")
      result = result.filter((j) => j.experience === filters.experience);
    if (filters.source !== "All")
      result = result.filter((j) => j.source === filters.source);

    result.sort((a, b) =>
      filters.sort === "Latest"
        ? a.postedDaysAgo - b.postedDaysAgo
        : b.postedDaysAgo - a.postedDaysAgo
    );

    return result;
  }, [filters]);

  return (
    <div className="flex-1 bg-background px-3 py-3 overflow-y-auto">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <h1 className="font-serif text-display text-foreground">Dashboard</h1>
        <p className="mt-1 text-small text-muted-foreground">
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
        </p>

        <div className="mt-3">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5 text-center">
            <p className="text-body text-muted-foreground">
              No jobs match your current filters. Try broadening your search.
            </p>
          </div>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved(job.id)}
                onSave={toggleSave}
                onView={setViewJob}
              />
            ))}
          </div>
        )}
      </div>

      <JobDetailModal
        job={viewJob}
        open={!!viewJob}
        onOpenChange={(open) => !open && setViewJob(null)}
      />
    </div>
  );
};

export default Dashboard;
