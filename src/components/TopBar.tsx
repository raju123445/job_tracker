import { Badge } from "@/components/ui/badge";

type Status = "Not Started" | "In Progress" | "Shipped";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: Status;
}

const statusStyles: Record<Status, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning/15 text-warning-foreground border-warning/30",
  "Shipped": "bg-success/15 text-success border-success/30",
};

const TopBar = ({ projectName, currentStep, totalSteps, status }: TopBarProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-2">
      <span className="font-sans text-small font-semibold tracking-tight text-foreground">
        {projectName}
      </span>

      <span className="text-xs text-muted-foreground font-medium">
        Step {currentStep} / {totalSteps}
      </span>

      <Badge variant="outline" className={`text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </Badge>
    </header>
  );
};

export default TopBar;
