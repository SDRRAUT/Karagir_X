import { create } from 'zustand';

export type SortOrder = 'TRENDING' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'AUTHENTICITY_RATING';

export interface MarketplaceFilters {
  categoryCode: string | null;
  minPrice: number;
  maxPrice: number;
  artisanState: string | null;
  stockType: 'ALL' | 'READY_STOCK' | 'MADE_TO_ORDER';
  sortBy: SortOrder;
}

export interface MarketplaceState {
  searchQuery: string;
  filters: MarketplaceFilters;
  recentSearches: string[];
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (categoryCode: string | null) => void;
  setFilters: (patch: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const DEFAULT_FILTERS: MarketplaceFilters = {
  categoryCode: null,
  minPrice: 0,
  maxPrice: 50000,
  artisanState: null,
  stockType: 'ALL',
  sortBy: 'TRENDING',
};

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  recentSearches: ['मधुबनी पेंटिंग', 'बनारसी साड़ी', 'टेराकोटा', 'कांस्य मूर्ति', 'जूट बैग'],

  setSearchQuery: (query) => set({ searchQuery: query }),

  setCategoryFilter: (categoryCode) => {
    set({
      filters: {
        ...get().filters,
        categoryCode,
      },
    });
  },

  setFilters: (patch) => {
    set({
      filters: {
        ...get().filters,
        ...patch,
      },
    });
  },

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  addRecentSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const filtered = get().recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    set({ recentSearches: [trimmed, ...filtered].slice(0, 8) });
  },

  clearRecentSearches: () => set({ recentSearches: [] }),
}));
