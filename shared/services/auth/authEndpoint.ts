import { BASE_URL } from "@/shared/constants/endpoints";

export const authEndpoints = {
  login: {
    url: `${BASE_URL}/auth/login`,
    method: "post",
  },
  forgotPassword: {
    url: `${BASE_URL}/auth/forgot-password`,
    method: "post",
  },
  register: {
    url: `${BASE_URL}/auth/register`,
    method: "post",
  },

  resetPassword: {
    url: `${BASE_URL}/auth/reset-password`,
    method: "put",
  },

  onboarding: {
    url: `${BASE_URL}/auth/onboarding`,
    method: "put",
  },

  checkUsername: (name: string) => ({
    url: `${BASE_URL}/auth/check-name/${name}`,
    method: "get",
  }),

  findFriend: (name: string) => ({
    url: `${BASE_URL}/auth/find-friend/${name}`,
    method: "get",
  }),

  getProfile: {
    url: `${BASE_URL}/auth/me`,
    method: "get",
  },
};
