import { Bookmark } from "lucide-react";

const Saved = () => {
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
};

export default Saved;
