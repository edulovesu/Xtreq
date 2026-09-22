import { useCallback, useState } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";
import { useAuth } from "../context/AuthContext";

// GET /api/v1/admins/me/activity?limit&offset
export function useAdminActivity(limit = 10) {
  const [offset, setOffset] = useState(0);
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/admins/me/activity", { limit, offset }),
    [limit, offset]
  );
  return {
    // Heads up: this only logs rider dispute actions, trip refunds, and
    // remittance lifecycle events — not a full audit trail of every action.
    items: data?.items ?? [],
    count: data?.count ?? 0,
    loading,
    error,
    refetch,
    nextPage: () => setOffset((o) => o + limit),
    prevPage: () => setOffset((o) => Math.max(o - limit, 0)),
  };
}

export function useAdminProfileActions() {
  const { updateUser, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const updateProfile = useCallback(
    async (body) => {
      // { first_name?, last_name?, phone? } — email isn't editable here.
      setSubmitting(true);
      try {
        const updated = await api.patch("/api/v1/admins/me", body);
        updateUser(updated);
        return updated;
      } finally {
        setSubmitting(false);
      }
    },
    [updateUser]
  );

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    // 400s if current_password doesn't match — let the caller catch and show it.
    setSubmitting(true);
    try {
      return await api.post("/api/v1/admins/me/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deactivateAccount = useCallback(async () => {
    // Irreversible, and 400s if this is the last active admin.
    setSubmitting(true);
    try {
      const result = await api.post("/api/v1/admins/me/deactivate");
      logout();
      return result;
    } finally {
      setSubmitting(false);
    }
  }, [logout]);

  return { updateProfile, changePassword, deactivateAccount, submitting };
}
