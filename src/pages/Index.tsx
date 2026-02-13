import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-3">
      <div className="text-center max-w-[var(--text-max-width)]">
        <h1 className="font-serif text-display text-foreground">
          Stop Missing The Right Jobs.
        </h1>
        <p className="mt-3 text-body-lg text-muted-foreground text-block mx-auto">
          Precision-matched job discovery delivered daily at 9AM.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/settings">Start Tracking</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
