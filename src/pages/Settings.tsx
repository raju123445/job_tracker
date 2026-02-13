import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="flex-1 bg-background px-3 py-4 overflow-y-auto">
      <div className="mx-auto" style={{ maxWidth: "var(--text-max-width)" }}>
        <h1 className="font-serif text-display text-foreground">Settings</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Configure your job tracking preferences.
        </p>

        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-subheading">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="keywords">Role Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g. Frontend Engineer, Product Designer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="locations">Preferred Locations</Label>
              <Input
                id="locations"
                placeholder="e.g. Bangalore, Remote, New York"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Mode</Label>
              <RadioGroup defaultValue="remote" className="flex gap-3 pt-0.5">
                <div className="flex items-center gap-0.5">
                  <RadioGroupItem value="remote" id="remote" />
                  <Label htmlFor="remote" className="font-normal">Remote</Label>
                </div>
                <div className="flex items-center gap-0.5">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                </div>
                <div className="flex items-center gap-0.5">
                  <RadioGroupItem value="onsite" id="onsite" />
                  <Label htmlFor="onsite" className="font-normal">Onsite</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                placeholder="e.g. 2–5 years, Senior, Entry-level"
              />
            </div>

            <Button className="mt-1 self-start" disabled>
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
