import { useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import type AuthUserRequest from "../types/requests/auth-user";
import type AuthUserResponse from "../types/responses/auth-user";
import type RegisterUserRequest from "../types/requests/register-user";
import type LoggedUserResponse from "../types/responses/logged-user";
import type RegisterCampaignRequest from "../types/requests/register-campaign";
import type UpdateCampaignRequest from "../types/requests/update-campaign";
import type CampaignsResponse from "../types/responses/campaigns";
import type CampaignGridRequest from "../types/requests/campaign-grid";
import type CampaignGridResponse from "../types/responses/campaign-grid";
import type CampaignSearchResponse from "../types/responses/campaign-search";
import type CampaignFolderResponse from "../types/responses/campaign-folder";
import type CreateFolderRequest from "../types/requests/create-folder";
import type UpdateFolderRequest from "../types/requests/update-folder";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status !== 401 && status !== 403) return Promise.reject(error);

    const requestUrl = error.config?.url || "";
    if (requestUrl.includes("/users/auth") || requestUrl.includes("/users/refresh")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          error.config.headers.Authorization = `Bearer ${token}`;
          resolve(api(error.config));
        });
      });
    }

    isRefreshing = true;
    const currentToken = localStorage.getItem("auth_token");

    try {
      const { data } = await api.post<AuthUserResponse>("/users/refresh", {
        token: currentToken,
      });

      localStorage.setItem("auth_token", data.token);
      const expiresAt = Date.now() + data.expiresIn * 1000;
      localStorage.setItem("auth_token_expires_at", String(expiresAt));

      pendingRequests.forEach((cb) => cb(data.token));
      pendingRequests = [];

      error.config.headers.Authorization = `Bearer ${data.token}`;
      return api(error.config);
    } catch {
      pendingRequests = [];
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_token_expires_at");
      window.location.href = "/";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

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

  const updateCampaign = useCallback(
    async (id: number, data: UpdateCampaignRequest): Promise<void> => {
      await api.put(`/campaigns/${id}`, data);
    },
    [],
  );

  const deleteCampaign = useCallback(
    async (id: number): Promise<void> => {
      await api.delete(`/campaigns/${id}`);
    },
    [],
  );

  const getCampaignGridById = useCallback(
    async (campaignId: number, gridId: number): Promise<CampaignGridResponse | null> => {
      try {
        const { data } = await api.get<CampaignGridResponse>(
          `/campaigns/${campaignId}/grid/${gridId}`,
        );
        return data;
      } catch {
        return null;
      }
    },
    [],
  );

  const createCampaignGrid = useCallback(
    async (campaignId: number, data: CampaignGridRequest): Promise<boolean> => {
      try {
        await api.post(`/campaigns/${campaignId}/grid`, data);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const updateCampaignGrid = useCallback(
    async (campaignId: number, gridId: number, data: CampaignGridRequest): Promise<boolean> => {
      try {
        await api.put(`/campaigns/${campaignId}/grid/${gridId}`, data);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const deleteCampaignGrid = useCallback(
    async (campaignId: number, gridId: number): Promise<{ success: boolean; error?: string }> => {
      try {
        await api.delete(`/campaigns/${campaignId}/grid/${gridId}`);
        return { success: true };
      } catch (err) {
        const message = (err as any)?.response?.data?.message;
        return { success: false, error: message };
      }
    },
    [],
  );

  const search = useCallback(
    async (campaignId: number, q?: string): Promise<CampaignSearchResponse | null> => {
      try {
        const { data } = await api.get<CampaignSearchResponse>(
          `/campaigns/${campaignId}/search`,
          { params: { q } },
        );
        return data;
      } catch {
        return null;
      }
    },
    [],
  );

  const getFolder = useCallback(
    async (campaignId: number, folderId: number): Promise<CampaignFolderResponse | null> => {
      try {
        const { data } = await api.get<CampaignFolderResponse>(
          `/campaigns/${campaignId}/folder/${folderId}`,
        );
        return data;
      } catch {
        return null;
      }
    },
    [],
  );

  const createFolder = useCallback(
    async (campaignId: number, data: CreateFolderRequest): Promise<CampaignFolderResponse | null> => {
      try {
        const { data: result } = await api.post<CampaignFolderResponse>(
          `/campaigns/${campaignId}/folder`,
          data,
        );
        return result;
      } catch {
        return null;
      }
    },
    [],
  );

  const updateFolder = useCallback(
    async (campaignId: number, folderId: number, data: UpdateFolderRequest): Promise<CampaignFolderResponse | null> => {
      try {
        const { data: result } = await api.put<CampaignFolderResponse>(
          `/campaigns/${campaignId}/folder/${folderId}`,
          data,
        );
        return result;
      } catch {
        return null;
      }
    },
    [],
  );

  const deleteFolder = useCallback(
    async (campaignId: number, folderId: number): Promise<boolean> => {
      try {
        await api.delete(`/campaigns/${campaignId}/folder/${folderId}`);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const assignGridToFolder = useCallback(
    async (campaignId: number, gridId: number, folderId: number): Promise<boolean> => {
      try {
        await api.post(`/campaigns/${campaignId}/grid/${gridId}/assign-folder`, { folderId });
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  return {
    authenticateUser,
    registerUser,
    user: getUser,
    registerCampaign,
    getCampaigns,
    updateCampaign,
    deleteCampaign,
    getCampaignGridById,
    createCampaignGrid,
    updateCampaignGrid,
    deleteCampaignGrid,
    search,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    assignGridToFolder,
  };
}
