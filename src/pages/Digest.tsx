import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";
import { calculateMatchScore, Preferences } from "@/utils/match-score";
import { Clock, Copy, Mail, MailIcon, MapPin, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useJobStatus, JobStatus } from "@/hooks/use-job-status";

interface JobWithScore {
  job: Job;
  matchScore: number;
}

const Digest = () => {
  const [digestJobs, setDigestJobs] = useState<JobWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(true);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('jobTrackerPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
        setHasPreferences(true);
      } catch (error) {
        console.error('Failed to parse preferences from localStorage:', error);
        setHasPreferences(false);
      }
    } else {
      setHasPreferences(false);
    }
  }, []);

  // Check if digest already exists for today
  const getTodayDigestFromStorage = (): JobWithScore[] | null => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const digestKey = `jobTrackerDigest_${today}`;
    const storedDigest = localStorage.getItem(digestKey);
    
    if (storedDigest) {
      try {
        return JSON.parse(storedDigest);
      } catch (error) {
        console.error('Failed to parse stored digest:', error);
        return null;
      }
    }
    return null;
  };

  // Generate today's digest
  const generateDigest = async () => {
    if (!preferences) {
      setHasPreferences(false);
      return;
    }

    setIsLoading(true);

    // Check if digest already exists for today
    const existingDigest = getTodayDigestFromStorage();
    if (existingDigest) {
      setDigestJobs(existingDigest);
      setIsLoading(false);
      return;
    }

    // Calculate match scores for all jobs
    const jobsWithScores: JobWithScore[] = jobs.map(job => ({
      job,
      matchScore: calculateMatchScore(job, preferences)
    }));

    // Filter jobs with positive match scores
    const filteredJobs = jobsWithScores.filter(item => item.matchScore > 0);

    // Sort by matchScore descending, then by postedDaysAgo ascending
    const sortedJobs = filteredJobs.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.job.postedDaysAgo - b.job.postedDaysAgo;
    });

    // Take top 10 jobs
    const top10Jobs = sortedJobs.slice(0, 10);

    // Store in localStorage
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const digestKey = `jobTrackerDigest_${today}`;
    localStorage.setItem(digestKey, JSON.stringify(top10Jobs));

    setDigestJobs(top10Jobs);
    setIsLoading(false);
  };

  // Copy digest to clipboard
  const copyDigestToClipboard = () => {
    if (digestJobs.length === 0) {
      toast.error("No digest to copy");
      return;
    }

    let digestText = `Top 10 Jobs For You — 9AM Digest\n`;
    digestText += `${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

    digestJobs.forEach((item, index) => {
      digestText += `${index + 1}. ${item.job.title}\n`;
      digestText += `   Company: ${item.job.company}\n`;
      digestText += `   Location: ${item.job.location}\n`;
      digestText += `   Experience: ${item.job.experience}\n`;
      digestText += `   Match Score: ${item.matchScore}%\n`;
      digestText += `   Apply: ${item.job.applyUrl}\n\n`;
    });

    digestText += `This digest was generated based on your preferences.`;

    navigator.clipboard.writeText(digestText);
    toast.success("Digest copied to clipboard!");
  };

  // Create email draft
  const createEmailDraft = () => {
    if (digestJobs.length === 0) {
      toast.error("No digest to email");
      return;
    }

    let digestText = `Top 10 Jobs For You — 9AM Digest\n`;
    digestText += `${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;

    digestJobs.forEach((item, index) => {
      digestText += `${index + 1}. ${item.job.title}\n`;
      digestText += `   Company: ${item.job.company}\n`;
      digestText += `   Location: ${item.job.location}\n`;
      digestText += `   Experience: ${item.job.experience}\n`;
      digestText += `   Match Score: ${item.matchScore}%\n`;
      digestText += `   Apply: ${item.job.applyUrl}\n\n`;
    });

    digestText += `\nThis digest was generated based on your preferences.`;

    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  // Check if digest exists on component mount
  useEffect(() => {
    const existingDigest = getTodayDigestFromStorage();
    if (existingDigest) {
      setDigestJobs(existingDigest);
    }
  }, []);

  return (
    <div className="flex flex-1 bg-gradient-to-br from-background to-stone-50 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-full p-3 md:p-4">
              <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Daily Job Digest
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Your personalized job recommendations delivered daily
              </p>
            </div>
          </div>
        </div>

        {!hasPreferences ? (
          <div className="flex items-center justify-center min-h-64">
            <Card className="w-full max-w-md border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6 text-center">
                <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4 opacity-60" />
                <p className="text-foreground font-medium mb-2">Set up your preferences</p>
                <p className="text-sm text-muted-foreground">
                  Go to Settings to configure your job preferences and start receiving personalized digests.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : digestJobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center max-w-md">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-base md:text-lg text-foreground font-medium mb-2">
                No matching roles today
              </p>
              <p className="text-sm text-muted-foreground">
                Check again tomorrow or adjust your preferences to find more opportunities.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Digest Meta */}
            <div className="text-center pb-6 border-b border-gray-200">
              <h2 className="font-serif text-xl md:text-2xl text-foreground mb-2">
                Top 10 Jobs For You
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {digestJobs.map((item, index) => (
                <Card 
                  key={`${item.job.id}-${index}`} 
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-transparent px-4 md:px-5 py-3 md:py-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          {index + 1}
                        </div>
                        <h3 className="font-serif text-base md:text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {item.job.company}
                        </p>
                      </div>
                      <Badge 
                        className="shrink-0 text-xs md:text-sm"
                        style={{
                          backgroundColor: item.matchScore >= 80 ? 'rgb(220, 252, 231)' : item.matchScore >= 60 ? 'rgb(254, 243, 199)' : 'rgb(229, 231, 235)',
                          color: item.matchScore >= 80 ? 'rgb(22, 101, 52)' : item.matchScore >= 60 ? 'rgb(120, 53, 15)' : 'rgb(55, 65, 81)',
                          borderColor: item.matchScore >= 80 ? 'rgb(187, 247, 208)' : item.matchScore >= 60 ? 'rgb(253, 224, 71)' : 'rgb(209, 213, 219)',
                        }}
                        variant="outline"
                      >
                        {item.matchScore}%
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="px-4 md:px-5 py-4 md:py-5 flex-1">
                    <div className="space-y-3">
                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{item.job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">
                            {item.job.postedDaysAgo === 0 ? 'Today' : `${item.job.postedDaysAgo}d ago`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="text-xs">📊</span>
                          <span className="truncate">{item.job.experience === 'Fresher' ? 'Fresher' : `${item.job.experience}y`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="text-xs">🏢</span>
                          <span className="truncate">{item.job.mode}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {item.job.description}
                      </p>
                    </div>
                  </CardContent>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-4 md:px-5 py-3 md:py-4 border-t border-gray-100 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="flex-1 text-xs md:text-sm h-8 md:h-9"
                    >
                      <a href={item.job.applyUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      asChild
                      className="flex-1 text-xs md:text-sm h-8 md:h-9"
                    >
                      <a href={item.job.applyUrl} target="_blank" rel="noopener noreferrer">
                        Apply
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Footer Note */}
            <div className="text-center pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm text-muted-foreground">
                Generated based on your preferences
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Button 
            onClick={generateDigest} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
          >
            {isLoading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Generating...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Generate Digest
              </>
            )}
          </Button>

          {digestJobs.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={copyDigestToClipboard}
                className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={createEmailDraft}
                className="flex items-center justify-center gap-2 text-sm md:text-base h-9 md:h-10"
              >
                <MailIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </Button>
            </>
          )}
        </div>

        {/* Recent Status Updates Section */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="font-serif text-xl md:text-2xl text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Status Updates
          </h2>
          
          <StatusUpdatesSection />
        </div>

        {/* Demo Mode Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Demo: Daily 9AM trigger simulated manually
          </p>
        </div>
      </div>
    </div>
  );
};

// Component to display recent status updates
const StatusUpdatesSection = () => {
  const { getAllStatuses } = useJobStatus();
  
  // Get all jobs with non-default statuses
  const statusUpdates = Object.entries(getAllStatuses())
    .filter(([_, status]) => status !== "Not Applied")
    .map(([jobId, status]) => {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return null;
      
      return {
        job,
        status,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    })
    .filter(Boolean)
    .slice(0, 5); // Show only the 5 most recent updates

  if (statusUpdates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No status updates yet. Update job statuses to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {statusUpdates.map((update, index) => (
        <div 
          key={`${update.job.id}-${index}`} 
          className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{update.job.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{update.job.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline"
              className={
                update.status === "Applied" ? "bg-blue-100 text-blue-800 border-blue-200" :
                update.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" :
                update.status === "Selected" ? "bg-green-100 text-green-800 border-green-200" :
                "bg-gray-100 text-gray-800 border-gray-200"
              }
            >
              {update.status}
            </Badge>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {update.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Digest;
