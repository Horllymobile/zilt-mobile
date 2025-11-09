import { axiosBaseQuery } from "@/libs/api/request";
import { CreateMomentDto, Moment } from "@/models/moments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { momentsEndpoints } from "./momentsEndpoints";

export const useCreateMomentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMomentDto) =>
      axiosBaseQuery({ ...momentsEndpoints.createMoment, data }),
    onError: (error: any) => {
      console.log(error);
      // Alert.alert(formatErrorMessage(error));
    },
  });
};

export const useFindMomentsQuery = (
  params: { userId?: string; page?: number; size?: number },
  enabled: boolean
) => {
  const { userId, page, size } = params;
  return useQuery({
    queryKey: ["moments", userId, page, size],
    queryFn: async () => {
      const resp = await axiosBaseQuery(
        momentsEndpoints.getMoments({ page, size })
      );
      // console.log(resp);
      return resp as Moment[];
    },
    enabled,
  });
};

// export const useFindMomentsQuery = (
//   params: { userId?: string; page?: number; size?: number },
//   enabled: boolean
// ) => {
//   const { userId, page, size } = params;

//   return useQuery({
//     queryKey: ["moments", userId, page, size],
//     queryFn: async () => {
//       const resp = await axiosBaseQuery(
//         momentsEndpoints.getMoments({ page, size })
//       );

//       console.log(resp);

//       // ✅ Ensure something is always returned
//       if (!resp || !resp.data) {
//         console.warn("⚠️ No response data found for useFindMomentsQuery");
//         return [];
//       }

//       return resp ?? [];
//     },
//     enabled: Boolean(enabled && userId),
//   });
// };
