import { useState, useCallback } from "react";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

const STORAGE_KEY = "jobTrackerStatus";

export function useJobStatus() {
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const updateStatus = useCallback((jobId: string, status: JobStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [jobId]: status };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStatus = useCallback(
    (jobId: string) => statuses[jobId] || "Not Applied",
    [statuses]
  );

  const getAllStatuses = useCallback(() => statuses, [statuses]);

  const resetStatuses = useCallback(() => {
    setStatuses({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { 
    statuses, 
    updateStatus, 
    getStatus, 
    getAllStatuses, 
    resetStatuses 
  };
}