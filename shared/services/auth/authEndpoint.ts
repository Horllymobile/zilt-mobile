import { BASE_URL } from "@/shared/constants/endpoints";

export const authEndpoints = {
  login: {
    url: `${BASE_URL}/auth/login`,
    method: "post",
  },
  loginOtp: {
    url: `${BASE_URL}/auth/login-otp`,
    method: "post",
  },
  verifyOtp: {
    url: `${BASE_URL}/auth/verify-otp`,
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

  registerOtp: {
    url: `${BASE_URL}/auth/register-otp`,
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
