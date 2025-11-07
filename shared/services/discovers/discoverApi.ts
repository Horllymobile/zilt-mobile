import { axiosBaseQuery } from "@/libs/api/request";
import { Profile } from "@/models/profile";
import { useQuery } from "@tanstack/react-query";
import { discoversEndpoints } from "./disoversEndpoints";

export const useFindPeopleQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const resp = await axiosBaseQuery(discoversEndpoints.findPeople());
      // console.log(resp);
      return resp.data as Profile[];
    },
    enabled,
  });
};

export const useFindMomentsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["moments"],
    queryFn: async () => {
      const resp = await axiosBaseQuery(discoversEndpoints.findMoments());
      console.log(resp);
      return resp.data as Profile[];
    },
    enabled,
  });
};
