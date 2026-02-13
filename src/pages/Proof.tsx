import { ClipboardCheck } from "lucide-react";

const Proof = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-3">
      <div className="text-center max-w-[var(--text-max-width)]">
        <ClipboardCheck className="mx-auto h-5 w-5 text-muted-foreground" />
        <h1 className="mt-2 font-serif text-display text-foreground">Proof</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Artifacts, screenshots, and build evidence will be collected here.
        </p>
      </div>
    </div>
  );
};

export default Proof;
