import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

// Define the preferences type
interface Preferences {
  roleKeywords: string;
  preferredLocations: string;
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

const Settings = () => {
  // Define default preferences
  const defaultPreferences: Preferences = {
    roleKeywords: "",
    preferredLocations: "",
    preferredMode: [],
    experienceLevel: "All",
    skills: "",
    minMatchScore: 40,
  };

  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [saved, setSaved] = useState(false);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('jobTrackerPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error('Failed to parse preferences from localStorage:', error);
      }
    }
  }, []);

  // Handle checkbox changes for preferred mode
  const handleModeChange = (mode: string, checked: boolean) => {
    let updatedModes = [...preferences.preferredMode];
    if (checked) {
      if (!updatedModes.includes(mode)) {
        updatedModes.push(mode);
      }
    } else {
      updatedModes = updatedModes.filter(m => m !== mode);
    }
    setPreferences({
      ...preferences,
      preferredMode: updatedModes
    });
  };

  // Handle slider change for minMatchScore
  const handleSliderChange = (value: number[]) => {
    setPreferences({
      ...preferences,
      minMatchScore: value[0]
    });
  };

  // Handle input changes
  const handleChange = (field: keyof Preferences, value: any) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

  // Save preferences to localStorage
  const handleSave = () => {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Reset saved message after 2 seconds
  };

  // Parse location string into array for display purposes
  const locationOptions = ["All", "Bangalore", "Chennai", "Hyderabad", "Pune", "Mumbai", "Mysore", "Noida", "Remote"];
  const selectedLocations = preferences.preferredLocations.split(',').map(loc => loc.trim()).filter(loc => loc);

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
              <Label htmlFor="roleKeywords">Role Keywords</Label>
              <Input
                id="roleKeywords"
                value={preferences.roleKeywords}
                onChange={(e) => handleChange('roleKeywords', e.target.value)}
                placeholder="e.g. Frontend Engineer, Product Designer"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords to match in job titles and descriptions</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="preferredLocations">Preferred Locations</Label>
              <Input
                id="preferredLocations"
                value={preferences.preferredLocations}
                onChange={(e) => handleChange('preferredLocations', e.target.value)}
                placeholder="e.g. Bangalore, Remote, New York"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list of preferred locations</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Preferred Mode</Label>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={preferences.preferredMode.includes('Remote')}
                    onCheckedChange={(checked) => handleModeChange('Remote', Boolean(checked))}
                  />
                  <Label htmlFor="remote" className="font-normal">Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hybrid"
                    checked={preferences.preferredMode.includes('Hybrid')}
                    onCheckedChange={(checked) => handleModeChange('Hybrid', Boolean(checked))}
                  />
                  <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onsite"
                    checked={preferences.preferredMode.includes('Onsite')}
                    onCheckedChange={(checked) => handleModeChange('Onsite', Boolean(checked))}
                  />
                  <Label htmlFor="onsite" className="font-normal">Onsite</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={preferences.experienceLevel}
                onValueChange={(value) => handleChange('experienceLevel', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="0-1">0-1 Years</SelectItem>
                  <SelectItem value="1-3">1-3 Years</SelectItem>
                  <SelectItem value="3-5">3-5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={preferences.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                placeholder="e.g. React, JavaScript, Python"
              />
              <p className="text-xs text-muted-foreground mt-1">Comma-separated list of skills to match</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="minMatchScore">
                Minimum Match Score: {preferences.minMatchScore}%
              </Label>
              <Slider
                id="minMatchScore"
                value={[preferences.minMatchScore]}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">Jobs below this threshold will be filtered out when toggle is active</p>
            </div>

            <Button className="mt-2 self-start" onClick={handleSave}>
              Save Preferences
            </Button>
            {saved && (
              <p className="text-sm text-green-600">Preferences saved successfully!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
