import { axiosBaseQuery } from "@/libs/api/request";
import { useAuthStore } from "@/libs/store/authStore";
import { formatErrorMessage } from "@/libs/utils/lib";
import {
  ForgotPasswordDto,
  LoginDto,
  LoginMagicDto,
  RegisterDto,
  ResetPasswordDto,
} from "@/models/auth";
import { ILoginReponse, OnboardingDto, Profile } from "@/models/profile";
import { IApiResponse } from "@/models/response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { authEndpoints } from "./authEndpoint";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuthData, session } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginDto) =>
      axiosBaseQuery({ ...authEndpoints.login, data }),
    onSuccess: (resp: IApiResponse<ILoginReponse>) => {
      queryClient.setQueryData(["user"], resp.data.profile);

      // console.log(resp);

      setAuthData({
        session: resp.data.session,
        profile: resp.data.profile,
      });

      // saveAccessToken(resp.data.session.token, resp.data?.session?.expiresIn);

      // saveRefreshToken(resp.data?.session.refresh);

      if (resp.data.profile.onboarded) {
        router.replace("/main/(dashboard)");
      } else {
        router.replace("/onboarding");
      }
    },
    onError: (error: any) => {
      // console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useLoginMagicMutation = () => {
  return useMutation({
    mutationFn: (data: LoginMagicDto) =>
      axiosBaseQuery({ ...authEndpoints.loginMagic, data }),
    onError: (error: any) => {
      console.log(error);
      Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordDto) =>
      axiosBaseQuery({ ...authEndpoints.forgotPassword, data }),
    onSuccess: (resp: IApiResponse<void>) => {
      // if (resp.data.profile.onboarded) {
      //   router.replace("/main/(dashboard)/");
      // } else {
      //   router.replace("/onboarding");
      // }
      return resp;
    },
    onError: (error: any) => {
      // console.log(error);
      Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) =>
      axiosBaseQuery({ ...authEndpoints.register, data }),
    onSuccess: (resp: IApiResponse<ILoginReponse>) => {
      // queryClient.setQueryData(["user"], resp.data.profile);
      Alert.alert(resp.message);
    },
    onError: (error: any) => {
      // console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) =>
      axiosBaseQuery({ ...authEndpoints.resetPassword, data }),
    onSuccess: (resp: IApiResponse<void>) => {
      // queryClient.setQueryData(["user"], resp.data.profile);
      Alert.alert(resp.message);
    },
    onError: (error: any) => {
      // console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useOnboardingMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: OnboardingDto) =>
      axiosBaseQuery({ ...authEndpoints.onboarding, data }),
    onError: (error: any) => {
      // console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useGetProfileQuery = (enabled: boolean) => {
  // const { setAuthData, session } = useAuthStore();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const resp = await axiosBaseQuery(authEndpoints.getProfile);

      return resp as Profile;
    },
    enabled,
  });
};

export const useFindFriendQuery = (enabled: boolean, name: string) => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      const resp = (await axiosBaseQuery(
        authEndpoints.findFriend(name)
      )) as IApiResponse<Profile>;
      console.log(resp);
      return resp;
    },
    enabled: Boolean(enabled && name),
  });
};

export const useCheckNameQuery = (enabled: boolean, name: string) => {
  return useQuery({
    queryKey: ["checkName", name],
    queryFn: async () => {
      const resp = (await axiosBaseQuery(
        authEndpoints.checkUsername(name)
      )) as IApiResponse<any>;
      return resp;
    },
    enabled,
  });
};
