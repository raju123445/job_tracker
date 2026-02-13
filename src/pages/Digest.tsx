import { Mail } from "lucide-react";

const Digest = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-3">
      <div className="text-center max-w-[var(--text-max-width)]">
        <Mail className="mx-auto h-5 w-5 text-muted-foreground" />
        <h1 className="mt-2 font-serif text-display text-foreground">Digest</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Your daily 9AM digest will be assembled here once matching is active.
        </p>
      </div>
    </div>
  );
};

export default Digest;
