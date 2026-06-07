import { useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import type AuthUserRequest from "../types/requests/auth-user";
import type AuthUserResponse from "../types/responses/auth-user";
import type RegisterUserRequest from "../types/requests/register-user";
import type LoggedUserResponse from "../types/responses/logged-user";
import type RegisterCampaignRequest from "../types/requests/register-campaign";
import type CampaignsResponse from "../types/responses/campaigns";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function useApi() {
  const authenticateUser = useCallback(
    async (data: AuthUserRequest): Promise<AuthUserResponse> => {
      const { data: result } = await api.post<AuthUserResponse>(
        "/users/auth",
        data,
      );
      return result;
    },
    [],
  );

  const registerUser = useCallback(
    async (data: RegisterUserRequest): Promise<void> => {
      await api.post("/users", data);
    },
    [],
  );

  const getUser = useCallback(async (): Promise<LoggedUserResponse | null> => {
    try {
      const { data } = await api.get<LoggedUserResponse>("/users/logged-user");
      return data;
    } catch {
      return null;
    }
  }, []);

  const refreshToken =
    useCallback(async (): Promise<AuthUserResponse | null> => {
      try {
        const { data } = await api.post<AuthUserResponse>("/users/refresh");
        return data;
      } catch {
        return null;
      }
    }, []);

  const registerCampaign = useCallback(
    async (data: RegisterCampaignRequest): Promise<void> => {
      await api.post("/campaigns", data);
    },
    [],
  );

  const getCampaigns = useCallback(async (): Promise<
    CampaignsResponse[] | null
  > => {
    try {
      const { data } = await api.get<CampaignsResponse[]>("/campaigns");
      return data;
    } catch {
      return null;
    }
  }, []);

  return {
    authenticateUser,
    registerUser,
    user: getUser,
    refreshToken,
    registerCampaign,
    getCampaigns,
  };
}
