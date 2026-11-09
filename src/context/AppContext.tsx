import React, { createContext, useContext, useState } from "react";
import { 
  UserRole, 
  MainTab, 
  OwnerTab, 
  Space, 
  StartupStory, 
  SupportProgram, 
  ReviewReport, 
  ChatRoom,
  SpaceType,
  SpaceCondition
} from "../types";
import { SPACES_DATA } from "../data/spaces";
import { STARTUP_STORIES_DATA } from "../data/stories";
import { SUPPORT_PROGRAMS_DATA } from "../data/programs";
import { REVIEW_REPORTS_DATA } from "../data/reports";
import { CHATS_DATA } from "../data/chats";

interface FilterState {
  neighborhood: string; // '전체' 또는 동네명
  type: SpaceType;
  condition: SpaceCondition | "ALL";
  searchQuery: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOnboarded: boolean;
  completeOnboarding: (interest?: { businessType: string; budget: string; neighborhood: string }) => void;
  resetOnboarding: () => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  ownerActiveTab: OwnerTab;
  setOwnerActiveTab: (tab: OwnerTab) => void;
  bookmarks: string[];
  toggleBookmark: (spaceId: string) => void;
  isBookmarked: (spaceId: string) => boolean;
  selectedSpaceId: string | null;
  setSelectedSpaceId: (id: string | null) => void;
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
  spaces: Space[];
  stories: StartupStory[];
  programs: SupportProgram[];
  reports: ReviewReport[];
  chats: ChatRoom[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  startupStep: number; // 1 ~ 5
  setStartupStep: (step: number) => void;
  youthInterest: {
    businessType: string;
    budget: string;
    neighborhood: string;
  };
  startAiReviewForSpace: (spaceId: string) => void;
  startChatForSpace: (spaceId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("YOUTH");
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<MainTab>("HOME");
  const [ownerActiveTab, setOwnerActiveTab] = useState<OwnerTab>("HOME");
  const [bookmarks, setBookmarks] = useState<string[]>(["space-01", "space-03"]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [startupStep, setStartupStep] = useState<number>(2); // AI 검토 단계 진행 중
  const [youthInterest, setYouthInterest] = useState({
    businessType: "F&B / 로컬 카페 & 브루펍",
    budget: "3,000만 ~ 5,000만원",
    neighborhood: "철암동"
  });

  const [filters, setFilters] = useState<FilterState>({
    neighborhood: "전체",
    type: "ALL",
    condition: "ALL",
    searchQuery: ""
  });

  const [spaces] = useState<Space[]>(SPACES_DATA);
  const [stories] = useState<StartupStory[]>(STARTUP_STORIES_DATA);
  const [programs] = useState<SupportProgram[]>(SUPPORT_PROGRAMS_DATA);
  const [reports] = useState<ReviewReport[]>(REVIEW_REPORTS_DATA);
  const [chats, setChats] = useState<ChatRoom[]>(CHATS_DATA);

  const toggleBookmark = (spaceId: string) => {
    setBookmarks(prev => 
      prev.includes(spaceId) 
        ? prev.filter(id => id !== spaceId) 
        : [...prev, spaceId]
    );
  };

  const isBookmarked = (spaceId: string) => bookmarks.includes(spaceId);

  const completeOnboarding = (interest?: { businessType: string; budget: string; neighborhood: string }) => {
    if (interest) {
      setYouthInterest(interest);
    }
    setIsOnboarded(true);
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
  };

  const startAiReviewForSpace = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setActiveTab("AI_REVIEW");
  };

  const startChatForSpace = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setActiveTab("CHAT");
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isOnboarded,
        completeOnboarding,
        resetOnboarding,
        activeTab,
        setActiveTab,
        ownerActiveTab,
        setOwnerActiveTab,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        selectedSpaceId,
        setSelectedSpaceId,
        selectedStoryId,
        setSelectedStoryId,
        spaces,
        stories,
        programs,
        reports,
        chats,
        filters,
        setFilters,
        startupStep,
        setStartupStep,
        youthInterest,
        startAiReviewForSpace,
        startChatForSpace
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
