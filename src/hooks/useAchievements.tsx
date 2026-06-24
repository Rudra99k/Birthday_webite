import { createContext, useContext, useState, type ReactNode } from "react";

export type AchievementId =
  | "secret-found"
  | "cake-cut"
  | "heart-clicked-27"
  | "birthday-completed"
  | "all-letters-opened";

export const ACHIEVEMENT_LABELS: Record<AchievementId, string> = {
  "secret-found": "Secret Found",
  "cake-cut": "Cake Cut",
  "heart-clicked-27": "Heart Clicked 27 Times",
  "birthday-completed": "Birthday Completed",
  "all-letters-opened": "All Letters Opened",
};

export const ALL_ACHIEVEMENT_IDS: AchievementId[] = [
  "secret-found",
  "cake-cut",
  "heart-clicked-27",
  "birthday-completed",
  "all-letters-opened",
];

interface AchievementsContextValue {
  unlocked: Set<AchievementId>;
  unlock: (id: AchievementId) => void;
  isUnlocked: (id: AchievementId) => boolean;
}

const AchievementsContext = createContext<AchievementsContextValue | null>(
  null
);

/**
 * AchievementsProvider — Phase 8.
 * Wraps the whole app (in App.tsx) so any section can unlock or read
 * achievement state without prop-drilling. Nothing is persisted to
 * localStorage — achievements reset on page reload, which is fine for a
 * one-sitting experience like this.
 */
export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());

  const unlock = (id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const isUnlocked = (id: AchievementId) => unlocked.has(id);

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock, isUnlocked }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) {
    throw new Error(
      "useAchievements must be used within an AchievementsProvider"
    );
  }
  return ctx;
}
