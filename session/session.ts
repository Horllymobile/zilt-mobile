// import { queryClient } from "@/app/providers";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getAccessToken = () => {
  return cookies.get("atk");
};

export const saveAccessToken = (token: string, expiredIn: string) => {
  const expires = new Date(expiredIn);

  cookies.set("atk", token, {
    secure: true,
    path: "/",
    expires,
    sameSite: "strict",
  });
};

export const removeAccessToken = () => {
  cookies.remove("atk", { path: "/" });
};

export const getRefreshToken = () => {
  return localStorage.getItem("rtk");
};

export const saveRefreshToken = (token: string) => {
  localStorage.setItem("rtk", token);
};

export const removeRefreshToken = () => {
  localStorage.removeItem("rtk");
};

export const logout = () => {
  // queryClient.removeQueries();
  localStorage.clear();
  removeAccessToken();
  window.location.href = "/login";
};
