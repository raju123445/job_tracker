import { Job } from "@/types/job";

// Define the preferences type
export interface Preferences {
  roleKeywords: string;
  preferredLocations: string;
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

/**
 * Calculate match score for a job based on user preferences
 * Scoring rules:
 * +25 if any roleKeyword appears in job.title (case-insensitive)
 * +15 if any roleKeyword appears in job.description
 * +15 if job.location matches preferredLocations
 * +10 if job.mode matches preferredMode
 * +10 if job.experience matches experienceLevel
 * +15 if overlap between job.skills and user.skills (any match)
 * +5 if postedDaysAgo <= 2
 * +5 if source is LinkedIn
 * Cap score at 100.
 */
export const calculateMatchScore = (job: Job, preferences: Preferences): number => {
  let score = 0;

  // Parse role keywords
  const roleKeywords = preferences.roleKeywords
    ? preferences.roleKeywords.split(',').map(keyword => keyword.trim().toLowerCase())
    : [];

  // Parse preferred locations
  const preferredLocations = preferences.preferredLocations
    ? preferences.preferredLocations.split(',').map(location => location.trim().toLowerCase())
    : [];

  // Parse user skills
  const userSkills = preferences.skills
    ? preferences.skills.split(',').map(skill => skill.trim().toLowerCase())
    : [];

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (roleKeywords.length > 0) {
    const titleLower = job.title.toLowerCase();
    for (const keyword of roleKeywords) {
      if (titleLower.includes(keyword)) {
        score += 25;
        break; // Only count once even if multiple keywords match
      }
    }
  }

  // +15 if any roleKeyword appears in job.description
  if (roleKeywords.length > 0) {
    const descriptionLower = job.description.toLowerCase();
    for (const keyword of roleKeywords) {
      if (descriptionLower.includes(keyword)) {
        score += 15;
        break; // Only count once even if multiple keywords match
      }
    }
  }

  // +15 if job.location matches preferredLocations
  if (preferredLocations.length > 0) {
    if (preferredLocations.includes(job.location.toLowerCase())) {
      score += 15;
    }
  }

  // +10 if job.mode matches preferredMode
  if (preferences.preferredMode.length > 0) {
    if (preferences.preferredMode.includes(job.mode)) {
      score += 10;
    }
  }

  // +10 if job.experience matches experienceLevel
  if (preferences.experienceLevel !== "All" && preferences.experienceLevel) {
    if (job.experience === preferences.experienceLevel) {
      score += 10;
    }
  }

  // +15 if overlap between job.skills and user.skills (any match)
  if (userSkills.length > 0) {
    const jobSkillsLower = job.skills.map(skill => skill.toLowerCase());
    for (const userSkill of userSkills) {
      if (jobSkillsLower.some(jobSkill => jobSkill.toLowerCase().includes(userSkill) || userSkill.includes(jobSkill))) {
        score += 15;
        break; // Count once even if multiple skills match
      }
    }
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  // Cap score at 100
  return Math.min(score, 100);
};