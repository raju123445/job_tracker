import TopBar from "@/components/TopBar";
import ContextHeader from "@/components/ContextHeader";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import SecondaryPanel from "@/components/SecondaryPanel";
import ProofFooter from "@/components/ProofFooter";
import { Card } from "@/components/ui/card";

const PrimaryContent = () => (
  <div className="flex flex-col gap-3">
    <Card className="p-3">
      <h3 className="font-serif text-subheading text-foreground">Design System</h3>
      <p className="mt-1 text-small text-muted-foreground text-block">
        All tokens, typography, spacing, and color definitions are in place. Components follow a single visual language with no drift.
      </p>
    </Card>

    <Card className="p-3">
      <h3 className="font-serif text-subheading text-foreground">Component Library</h3>
      <p className="mt-1 text-small text-muted-foreground text-block">
        Buttons, inputs, cards, badges, and checkboxes are styled to spec. Primary uses solid deep red. Secondary uses outlined borders. Consistent radius and hover across all.
      </p>
    </Card>

    <Card className="p-3">
      <h3 className="font-serif text-subheading text-foreground">Layout Structure</h3>
      <p className="mt-1 text-small text-muted-foreground text-block">
        Every page follows the prescribed structure: Top Bar → Context Header → Primary Workspace + Secondary Panel → Proof Footer. No exceptions.
      </p>
    </Card>
  </div>
);

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar
        projectName="KodNest Premium Build System"
        currentStep={1}
        totalSteps={6}
        status="In Progress"
      />

      <ContextHeader
        headline="Design System"
        subtext="Foundation tokens, components, and layout structure — built for coherence."
      />

      <WorkspaceLayout
        primary={<PrimaryContent />}
        secondary={
          <SecondaryPanel
            stepTitle="Step 1: Foundation"
            stepDescription="Establish your design tokens, color palette, typography scale, and spacing system before writing any feature code."
            prompt={`Create a premium SaaS design system with:\n- Background: #F7F6F3\n- Primary text: #111111\n- Accent: #8B0000\n- Serif headings, sans-serif body\n- 8px spacing scale`}
          />
        }
      />

      <ProofFooter />
    </div>
  );
};

export default Index;
