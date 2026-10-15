/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { setUser } from "../Features/Auth/authSlice";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://localhost:5000/api/v1",
  // baseUrl: "https://hanjifinance-api.vercel.app/api/v1",
  baseUrl: "https://api.hanjifinance.com/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    console.log(getState);
    const token = Cookies.get("accessToken");
    // const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<any> = async (
  args,
  api,
  extraOptions
): Promise<any> => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const res = await fetch(
      "https://api.hanjifinance.com/api/v1/auth/refresh-token",
      {
        credentials: "include",
        method: "POST",
      }
    );

    const data = await res.json();
    const user = (api.getState() as RootState).auth.user;
    api.dispatch(
      setUser({
        user,
        token: data?.data?.accessToken,
      })
    );
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "user",
    "course",
    "courseBundle",
    "category",
    "product",
    "offerNotice",
    "newsletter",
    "availability",
    "chatAndChill",
    "chatAndChill",
    "boardroomBanter",
    "productOrder",
    "courseOrder",
    "couponCode",
    "helpdesk",
  ],
  endpoints: () => ({}),
});

// export const { } = baseApi;
