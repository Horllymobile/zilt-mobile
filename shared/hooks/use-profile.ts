"use client";

import { Profile } from "@/models/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfileQuery } from "../services/auth/authApi";

export function useProfile() {
  const queryClient = useQueryClient();

  // const cachedUser = queryClient.getQueryData<Profile>(["profile"]);

  const cachedProfile = queryClient.getQueryData<Profile>(["profile"]);

  const { data, ...rest } = useGetProfileQuery(true);

  const profile = cachedProfile ?? data;

  return { profile, ...rest };
}
