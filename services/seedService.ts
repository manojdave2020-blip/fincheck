
export const SEEDED_DATA = {
  "AkshatZayn": {
    creator: {
      name: "Akshat Shrivastava",
      handle: "@AkshatZayn",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Akshat&backgroundColor=b6e3f4",
      description: "Macro strategist focusing on long-term wealth cycles.",
      niche: "Macro & Strategy"
    }
  },
  "CARachanaRanade": {
    creator: {
      name: "CA Rachana Ranade",
      handle: "@CARachanaRanade",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rachana&backgroundColor=ffdfbf",
      description: "Fundamental analysis expert simplifying stock markets.",
      niche: "Stock Analysis"
    }
  },
  "udayanadhye": {
    creator: {
      name: "Udayan Adhye",
      handle: "@udayanadhye",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Udayan&backgroundColor=d1d4f9",
      description: "Equity research professional focusing on value investing.",
      niche: "Equity Research"
    }
  }
};

export const seedDatabase = () => {
  const recentSearches = Object.values(SEEDED_DATA).map(d => ({
    id: d.creator.handle,
    name: d.creator.name,
    avatar: d.creator.avatar
  }));

  // We only seed basic search history to populate the UI. 
  // Clicking these will now trigger a LIVE audit instead of showing old mock data.
  localStorage.setItem('recent_searches', JSON.stringify(recentSearches));
};
