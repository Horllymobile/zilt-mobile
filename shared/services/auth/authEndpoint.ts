import { BASE_URL } from "@/shared/constants/endpoints";

export const authEndpoints = {
  login: {
    url: `${BASE_URL}/auth/login`,
    method: "post",
  },
  register: {
    url: `${BASE_URL}/auth/register`,
    method: "post",
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
