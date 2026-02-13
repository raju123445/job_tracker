import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Filters {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  sorts?: string[]; // Allow custom sorts to be passed in
}

const locations = ["All", "Bangalore", "Chennai", "Hyderabad", "Pune", "Mumbai", "Mysore", "Noida"];
const modes = ["All", "Remote", "Hybrid", "Onsite"];
const experiences = ["All", "Fresher", "0-1", "1-3", "3-5"];
const sources = ["All", "LinkedIn", "Naukri", "Indeed"];
const defaultSorts = ["Latest", "Oldest"];

const FilterBar = ({ filters, onChange, sorts = defaultSorts }: FilterBarProps) => {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by title or company…"
          value={filters.keyword}
          onChange={(e) => set("keyword", e.target.value)}
          className="h-4"
        />
      </div>

      <Select value={filters.location} onValueChange={(v) => set("location", v)}>
        <SelectTrigger className="w-[140px] h-4 bg-card">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          {locations.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.mode} onValueChange={(v) => set("mode", v)}>
        <SelectTrigger className="w-[120px] h-4 bg-card">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          {modes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.experience} onValueChange={(v) => set("experience", v)}>
        <SelectTrigger className="w-[130px] h-4 bg-card">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          {experiences.map((e) => (
            <SelectItem key={e} value={e}>{e}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.source} onValueChange={(v) => set("source", v)}>
        <SelectTrigger className="w-[120px] h-4 bg-card">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          {sources.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={(v) => set("sort", v)}>
        <SelectTrigger className="w-[110px] h-4 bg-card">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="bg-card z-50">
          {sorts.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
