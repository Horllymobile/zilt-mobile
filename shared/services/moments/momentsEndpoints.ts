import { BASE_URL } from "@/shared/constants/endpoints";
// import query from "qs";
export const momentsEndpoints = {
  createMoment: {
    url: `${BASE_URL}/moments/create`,
    method: "post",
  },
  getMoments: ({ page, size }: { page?: number; size?: number }) => {
    // const queryString = query.stringify(
    //   {
    //     page,
    //     size,
    //   },
    //   { skipNulls: true }
    // );
    // console.log(queryString);
    return {
      url: `${BASE_URL}/moments?page=${page}&size=${size}`,
      method: "get",
    };
  },

  getMoment: ({ page, size }: { page?: number; size?: number }) => {
    // const queryString = query.stringify(
    //   {
    //     page,
    //     size,
    //   },
    //   { skipNulls: true }
    // );
    // console.log(queryString);
    return {
      url: `${BASE_URL}/moments?page=${page}&size=${size}`,
      method: "get",
    };
  },
};
