export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  bio: string;
  onboarded: boolean;
  lastSeen: string;
  qr_url?: string;
  location?: {
    lat?: number;
    long?: number;
  };
  distance: number; // numeric value (km)
  distanceReadable: string;
}

export type Session = {
  token: string;
  expiresIn: number;
  expiresAt: number;
  refresh: string;
};

export interface ILoginReponse {
  session: Session;
  profile: Profile;
}

export interface OnboardingDto {
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: {
    lat?: number;
    long?: number;
  };
}
