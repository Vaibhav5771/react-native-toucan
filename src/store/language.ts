import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Platform } from "react-native";

import type { LanguageId } from "@/types/learning";

const LANGUAGE_STORAGE_KEY = "tucana-selected-language";
const isServer = Platform.OS === "web" && typeof window === "undefined";

const languageStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    if (isServer) {
      return null;
    }

    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    if (isServer) {
      return;
    }

    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Storage is optional for routing; the in-memory selection still works.
    }
  },
  removeItem: async (name: string) => {
    if (isServer) {
      return;
    }

    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Storage is optional for routing; the in-memory reset still works.
    }
  },
}));

type LanguageStore = {
  selectedLanguageId: LanguageId | null;
  hasHydrated: boolean;
  setSelectedLanguage: (languageId: LanguageId) => void;
  clearSelectedLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguage: (selectedLanguageId) => set({ selectedLanguageId }),
      clearSelectedLanguage: () => {
        set({ selectedLanguageId: null });
        void useLanguageStore.persist.clearStorage();
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: languageStorage,
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
      onRehydrateStorage: () => () => {
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);
