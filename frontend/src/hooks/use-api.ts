import { useCallback } from "react";
import { API_BASE_URL } from "../config/constants";
import type AuthUserRequest from "../types/requests/auth-user";
import type AuthUserResponse from "../types/responses/auth-user";
import type RegisterUserRequest from "../types/requests/register-user";
import type LoggedUserResponse from "../types/responses/logged-user";



async function getAuthToken(): Promise<string | null> {
  const token = localStorage.getItem("auth_token");
  return token;
}

export function useApi() {
  const authenticateUser = useCallback(
    async (data: AuthUserRequest): Promise<AuthUserResponse> => {
      const response = await fetch(`${API_BASE_URL}/users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const result: AuthUserResponse = await response.json();
      return result;
    },
    [],
  );

  const registerUser = useCallback(
    async (data: RegisterUserRequest): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
    },
    [],
  );

  const getUser = useCallback(async (): Promise<LoggedUserResponse | null> => {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/users/logged-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }, []);

  const refreshToken = useCallback(async (): Promise<AuthUserResponse | null> => {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;

    return response.json();
  }, []);

  return {
    authenticateUser,
    registerUser,
    user: getUser,
    refreshToken,
  };
}
