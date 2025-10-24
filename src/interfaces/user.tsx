// === USER RELATED TYPES ===

export type GenderIdentity = string;
export type SexRole = string;
export type UserRole = string;
export type RelationshipStatus = string;
export type BDSMInterest = string;
export type BDSMRole = string;
export type SmokingHabit = string;
export type DrinkingHabit = string;

export interface LocationData {
  country_code: string;
  country_name: string;
  city: string;
  region?: string;
  lat: number;
  lng: number;
  timezone?: string;
  display: string;
}

export interface TravelData {
  visited_countries: string[];
  travel_frequency: string;
  favorite_places?: string[];
}

export interface Media {
  id: string;
  user_id: string;
  url: string;
  type: string;
  is_profile: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface UserFantasy {
  id: string;
  user_id: string;
  fantasy_id: string;
  notes?: string;
  fantasy?: Fantasy;
}

export interface Fantasy {
  id: string;
  category: string;
  translations?: FantasyTranslation[];
}

export interface FantasyTranslation {
  id: string;
  fantasy_id: string;
  language: string;
  label: string;
  description?: string;
}

export interface SexualOrientation {
  id: string;
  key: string;
  order: number;
  translations?: SexualOrientationTranslation[];
}

export interface SexualOrientationTranslation {
  id: string;
  orientation_id: string;
  language: string;
  label: string;
}

// === USER ===
export interface User {
  id: string;
  public_id: number;
  socket_id?: string;
  username: string;
  displayname: string;
  email?: string;
  password?: string;
  profile_image_url?: string;
  bio?: string;
  date_of_birth?: string;
  gender: GenderIdentity;
  sexual_orientation?: SexualOrientation;
  sexual_orientation_id?: string;
  sex_role: SexRole;
  relationship_status: RelationshipStatus;
  user_role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_online?: string;
  location?: LocationData;
  location_point?: { lat: number; lng: number };

  bdsm_interest?: BDSMInterest;
  bdsm_role?: BDSMRole;

  smoking?: SmokingHabit;
  drinking?: DrinkingHabit;

  languages?: string[];
  hobbies?: string[];
  movies_genres?: string[];
  tv_shows_genres?: string[];
  theater_genres?: string[];
  cinema_genres?: string[];
  art_interests?: string[];
  entertainment?: string[];

  fantasies?: UserFantasy[];
  travel?: TravelData;
  media?: Media[];
}