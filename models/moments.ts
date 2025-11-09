import { Profile } from "./profile";

export interface CreateMomentDto {
  content?: string;
  mediaUrl?: string;
  type: string;
  mediaType?: string;
  // locationTag?: string;
}

export interface Moment {
  author: Profile;
  commentsCount: number;
  content: string;
  createdAt: string;
  distance: number;
  authorId: string;
  id: string;
  isChatFriend: boolean;
  isLiked: boolean;
  isOwnPost: boolean;
  likes: number;
  likesCount: number;
  locationTag?: string;
  mediaType?: MEDIA_TYPE;
  mediaUrl?: string;
  thumbnail: string;
  type: POST_TYPE;
  updatedAt: string;
}

export enum POST_TYPE {
  text = "TEXT",
  photo = "PHOTO",
  video = "VIDEO",
  mixed = "MIXED",
}

export enum MEDIA_TYPE {
  audio = "AUDIO",
  photo = "PHOTO",
  video = "VIDEO",
}
