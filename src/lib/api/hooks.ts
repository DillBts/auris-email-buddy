import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi, audioApi, summariesApi, userApi, authApi } from "./services";
import type { UserPrefs, VoiceSpeed, Priority } from "./types";

export const queryKeys = {
  inbox: (filters?: object) => ["emails", "inbox", filters] as const,
  starred: () => ["emails", "starred"] as const,
  trash: () => ["emails", "trash"] as const,
  email: (id: string) => ["emails", id] as const,
  audioUrls: (id: string, speed: VoiceSpeed) => ["audio", id, speed] as const,
  dailySummaries: (days: number) => ["summaries", "daily", days] as const,
  weeklySummary: () => ["summaries", "weekly"] as const,
  userProfile: () => ["user", "profile"] as const,
  userPrefs: () => ["user", "prefs"] as const,
  authStatus: () => ["auth", "status"] as const,
};

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.authStatus(),
    queryFn: () => authApi.getStatus(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDisconnectGmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.disconnectGmail(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
      qc.invalidateQueries({ queryKey: queryKeys.userProfile() });
    },
  });
}

export function useInbox(opts: { priority?: Priority; unread?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.inbox(opts),
    queryFn: () => emailsApi.getInbox({ maxResults: 30, ...opts }),
    staleTime: 1000 * 30,
  });
}

export function useStarred() {
  return useQuery({
    queryKey: queryKeys.starred(),
    queryFn: () => emailsApi.getStarred(),
    staleTime: 1000 * 60,
  });
}

export function useTrash() {
  return useQuery({
    queryKey: queryKeys.trash(),
    queryFn: () => emailsApi.getTrash(),
    staleTime: 1000 * 60,
  });
}

export function useEmail(id: string) {
  return useQuery({
    queryKey: queryKeys.email(id),
    queryFn: () => emailsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStarEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, starred }: { id: string; starred: boolean }) =>
      emailsApi.setStar(id, starred),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useTrashEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailsApi.trash(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useRestoreEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailsApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useDeletePermanently() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailsApi.deletePermanently(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.trash() });
    },
  });
}

export function useGenerateAudio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ emailId, speed }: { emailId: string; speed: VoiceSpeed }) =>
      audioApi.generate(emailId, speed),
    onSuccess: (_, { emailId, speed }) => {
      qc.invalidateQueries({ queryKey: queryKeys.audioUrls(emailId, speed) });
    },
  });
}

export function useAudioUrls(emailId: string, speed: VoiceSpeed = "normal", enabled = false) {
  return useQuery({
    queryKey: queryKeys.audioUrls(emailId, speed),
    queryFn: () => audioApi.getUrls(emailId, "both", speed),
    enabled: enabled && !!emailId,
    staleTime: 1000 * 60 * 12,
    refetchInterval: 1000 * 60 * 12,
  });
}

export function useGenerateSummaryAudio() {
  return useMutation({
    mutationFn: ({ summaryId, text, type, speed }: {
      summaryId: string;
      text: string;
      type: "daily" | "weekly";
      speed: VoiceSpeed;
    }) => audioApi.generateSummaryAudio(summaryId, text, type, speed),
  });
}

export function useDailySummaries(days = 7) {
  return useQuery({
    queryKey: queryKeys.dailySummaries(days),
    queryFn: () => summariesApi.getDaily(days),
    staleTime: 1000 * 60 * 10,
  });
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: queryKeys.weeklySummary(),
    queryFn: () => summariesApi.getWeekly(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useRefreshDailySummary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => summariesApi.refreshToday(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["summaries", "daily"] });
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile(),
    queryFn: () => userApi.getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserPrefs() {
  return useQuery({
    queryKey: queryKeys.userPrefs(),
    queryFn: () => userApi.getPrefs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: Partial<UserPrefs>) => userApi.updatePrefs(prefs),
    onMutate: async (newPrefs) => {
      await qc.cancelQueries({ queryKey: queryKeys.userPrefs() });
      const prev = qc.getQueryData(queryKeys.userPrefs());
      qc.setQueryData(queryKeys.userPrefs(), (old: { prefs: UserPrefs } | undefined) => ({
        prefs: { ...(old?.prefs ?? {}), ...newPrefs },
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.userPrefs(), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.userPrefs() });
    },
  });
}