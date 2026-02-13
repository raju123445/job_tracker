import { useState, useMemo, useEffect } from "react";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";
import { useSavedJobs } from "@/hooks/use-saved-jobs";
import { useJobStatus, JobStatus } from "@/hooks/use-job-status";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import FilterBar, { Filters } from "@/components/FilterBar";
import { calculateMatchScore, Preferences } from "@/utils/match-score";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultFilters: Filters = {
  keyword: "",
  location: "All",
  mode: "All",
  experience: "All",
  source: "All",
  status: "All", // Added status filter
  sort: "Latest",
};

const Dashboard = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const { isSaved, toggleSave } = useSavedJobs();
  const { getStatus } = useJobStatus();

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('jobTrackerPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error('Failed to parse preferences from localStorage:', error);
        setPreferences(null);
      }
    }
  }, []);

  // Calculate match scores for all jobs
  const jobsWithScores = useMemo(() => {
    if (!preferences) return jobs.map(job => ({ job, matchScore: 0 }));

    return jobs.map(job => ({
      job,
      matchScore: calculateMatchScore(job, preferences)
    }));
  }, [jobs, preferences]);

  // Apply filters and sorting
  const filtered = useMemo(() => {
    let result = [...jobsWithScores];

    // Apply keyword filter
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        ({ job }) =>
          job.title.toLowerCase().includes(kw) ||
          job.company.toLowerCase().includes(kw)
      );
    }

    // Apply location filter
    if (filters.location !== "All")
      result = result.filter(({ job }) => job.location === filters.location);

    // Apply mode filter
    if (filters.mode !== "All")
      result = result.filter(({ job }) => job.mode === filters.mode);

    // Apply experience filter
    if (filters.experience !== "All")
      result = result.filter(({ job }) => job.experience === filters.experience);

    // Apply source filter
    if (filters.source !== "All")
      result = result.filter(({ job }) => job.source === filters.source);

    // Apply status filter
    if (filters.status !== "All")
      result = result.filter(({ job }) => getStatus(job.id) === filters.status);

    // Apply match score filter if toggle is enabled
    if (showOnlyMatches && preferences) {
      result = result.filter(({ matchScore }) => matchScore >= preferences.minMatchScore);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sort === "Latest") {
        return a.job.postedDaysAgo - b.job.postedDaysAgo;
      } else if (filters.sort === "Match Score") {
        return b.matchScore - a.matchScore; // Higher scores first
      } else {
        return b.job.postedDaysAgo - a.job.postedDaysAgo; // Oldest first
      }
    });

    return result;
  }, [jobsWithScores, filters, showOnlyMatches, preferences, getStatus]);

  // Update FilterBar sorts to include Match Score
  const sorts = ["Latest", "Oldest", "Match Score"];

  return (
    <div className="flex-1 bg-background px-3 py-3 overflow-y-auto">
      <div className="mx-auto" style={{ maxWidth: 960 }}>
        <h1 className="font-serif text-display text-foreground">Dashboard</h1>
        <p className="mt-1 text-small text-muted-foreground">
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Show banner if preferences not set */}
        {!preferences && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              Set your preferences to activate intelligent matching.
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <FilterBar
            filters={{...filters, sort: filters.sort}}
            onChange={setFilters}
            sorts={sorts} // Pass updated sorts
          />

          {preferences && (
            <div className="flex items-center gap-2">
              <Switch
                id="show-only-matches"
                checked={showOnlyMatches}
                onCheckedChange={setShowOnlyMatches}
              />
              <Label htmlFor="show-only-matches" className="text-sm">
                Show only jobs above my threshold
              </Label>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5 text-center">
            {preferences && showOnlyMatches ? (
              <p className="text-body text-muted-foreground">
                No roles match your criteria. Adjust filters or lower threshold.
              </p>
            ) : (
              <p className="text-body text-muted-foreground">
                No jobs match your current filters. Try broadening your search.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2">
            {filtered.map(({ job, matchScore }) => (
              <JobCard
                key={job.id}
                job={job}
                matchScore={matchScore}
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
