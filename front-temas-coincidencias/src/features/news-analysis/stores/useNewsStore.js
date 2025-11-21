import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNewsStore = create(
	persist(
		(set, get) => ({
			// Theme
			darkMode: true,
			toggleDarkMode: () => {
				const newMode = !get().darkMode;
				set({ darkMode: newMode });
				document.body.setAttribute("data-theme", newMode ? "dark" : "light");
			},

			// Data
			categories: [],
			competencias: [],
			setCategories: (categories) => set({ categories }),
			setCompetencias: (competencias) => set({ competencias }),

			// Filters
			selectedCompetencias: [],
			selectedCategories: [],
			filtersLocked: false,

			setSelectedCompetencias: (competencias) =>
				set({ selectedCompetencias: competencias }),
			setSelectedCategories: (categories) =>
				set({ selectedCategories: categories }),
			lockFilters: () => set({ filtersLocked: true }),
			unlockFilters: () => set({ filtersLocked: false }),
			resetFilters: () =>
				set({
					selectedCompetencias: [],
					selectedCategories: [],
					filtersLocked: false,
					results: {},
				}),

			// Results
			results: {},
			setResults: (results) => set({ results }),

			// Cache (5 min TTL)
			cache: {},
			getCachedData: (key) => {
				const cached = get().cache[key];
				if (cached && Date.now() - cached.timestamp < 300000) {
					return cached.data;
				}
				return null;
			},
			setCachedData: (key, data) => {
				set((state) => ({
					cache: {
						...state.cache,
						[key]: { data, timestamp: Date.now() },
					},
				}));
			},
		}),
		{
			name: "news-tracker-storage",
			partialize: (state) => ({
				darkMode: state.darkMode,
				cache: state.cache,
			}),
		},
	),
);
