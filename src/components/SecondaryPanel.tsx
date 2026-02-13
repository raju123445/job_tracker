import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, AlertCircle, Camera } from "lucide-react";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  prompt: string;
}

const SecondaryPanel = ({ stepTitle, stepDescription, prompt }: SecondaryPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-serif text-subheading text-foreground">{stepTitle}</h3>
        <p className="mt-1 text-small text-muted-foreground text-block">{stepDescription}</p>
      </div>

      <div className="rounded-md border border-border bg-muted/50 p-2">
        <p className="text-small text-foreground font-mono leading-relaxed whitespace-pre-wrap">{prompt}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        <Button variant="default" size="sm" onClick={handleCopy}>
          {copied ? <Check className="mr-0.5" /> : <Copy className="mr-0.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="secondary" size="sm">
          <ExternalLink className="mr-0.5" />
          Build in Lovable
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        <Button variant="success" size="sm">
          <Check className="mr-0.5" />
          It Worked
        </Button>
        <Button variant="outline" size="sm">
          <AlertCircle className="mr-0.5" />
          Error
        </Button>
        <Button variant="ghost" size="sm">
          <Camera className="mr-0.5" />
          Screenshot
        </Button>
      </div>
    </div>
  );
};

export default SecondaryPanel;
