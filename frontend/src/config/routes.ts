export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/app",
  APP: "/app",
  CHARACTERS: "/app/characters",
  LIBRARY: "/app/library",
  COMMUNITY: "/app/community",
  SETTINGS: "/app/settings",
  PROFILE: "/app/profile",
  MAP: "/app/map",
  MAP_CAMPAIGN: "/app/map/:campaignId",
  APP_WILDCARD: "/app/*",
} as const;

export const APP_ROUTES = {
  HOME: "",
  CHARACTERS: "characters",
  LIBRARY: "library",
  COMMUNITY: "community",
  SETTINGS: "settings",
  PROFILE: "profile",
  MAP: "map/:campaignId",
} as const;
