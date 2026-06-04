export type Feed = {
  id: number;
  title: string;
  link: string;
  summary: string | null;
  author: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  published_date: string | null;
  city: string | null;
  category: string | null;
  relevance_score: number | null;
  scoring_breakdown: string | null;
  scoring_reason: string | null;
  scoring_confidence: number | null;
  approval_status: 'pending' | 'approved' | 'rejected' | string;
  editor_notes: string | null;
  created_at: string | null;
};

export type FeedApprovalResponse = {
  message: string;
  feed: Feed;
  content_generation?: {
    created?: number[];
    skipped_existing?: number[];
    feed_count?: number;
  };
  brand_validation?: {
    validated?: number;
    results?: Array<{
      content_id: number;
      status: string;
      score: number;
      issues: string[];
      revised?: boolean;
    }>;
  };
};

export type GeneratedContent = {
  id: number;
  feed_id: number;
  platform: string;
  headline: string;
  slug: string | null;
  content: string;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  keywords: string | null;
  hashtags: string | null;
  photography_direction: string | null;
  source_url: string | null;
  suggested_post_time: string | null;
  scheduled_publish_time: string | null;
  validation_status: string | null;
  validation_score: number | null;
  validation_issues: string | null;
  revision_count: number | null;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | string;
  created_at?: string | null;
};

export type PublishLog = {
  id: number;
  content_id: number;
  platform: string;
  status: string;
  scheduled_publish_time: string | null;
  post_url: string | null;
  response_message: string | null;
  published_at: string | null;
  created_at: string | null;
};

export type AgentRun = {
  id: number;
  agent_name: string;
  action: string | null;
  status: string | null;
  message: string | null;
  created_at: string | null;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  username: string;
};

const TOKEN_KEY = 'neem_admin_token';
const USER_KEY = 'neem_admin_user';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(USER_KEY);
}

export function saveAdminSession(session: LoginResponse) {
  window.localStorage.setItem(TOKEN_KEY, session.access_token);
  window.localStorage.setItem(USER_KEY, session.username);
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function adminLogin(username: string, password: string) {
  const session = await adminFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }, false);

  saveAdminSession(session);
  return session;
}

export async function verifyAdminSession() {
  return adminFetch<{ username: string }>('/auth/me');
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
  includeAuth = true
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');

  if (includeAuth) {
    const token = getAdminToken();
    if (!token) {
      clearAdminSession();
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      throw new Error('Admin authentication required');
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    const message =
      typeof data === 'object' && data && 'detail' in data
        ? String(data.detail)
        : typeof data === 'object' && data && 'error' in data
        ? String(data.error)
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export async function fetchFeeds(params: { city?: string; status?: string } = {}) {
  const search = new URLSearchParams();
  if (params.city) search.set('city', params.city);
  if (params.status) search.set('status', params.status);
  const suffix = search.toString() ? `?${search.toString()}` : '';
  return adminFetch<Feed[]>(`/rss-feeds/${suffix}`);
}

export function runRssFetch() {
  return adminFetch<{ message: string; result: Record<string, unknown> }>('/rss-feeds/fetch', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export function approveFeed(feedId: number, editor_notes?: string) {
  return adminFetch<FeedApprovalResponse>(`/rss-feeds/${feedId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ approved_by: getAdminUser() || 'admin', editor_notes }),
  });
}

export function rejectFeed(feedId: number, rejection_reason?: string) {
  return adminFetch<Feed>(`/rss-feeds/${feedId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejected_by: getAdminUser() || 'admin', rejection_reason }),
  });
}

export function runScoring(limit = 10, city?: string, only_unscored = true) {
  return adminFetch<{ message: string; result: Record<string, unknown> }>('/scoring/run', {
    method: 'POST',
    body: JSON.stringify({ limit, city: city || null, only_unscored }),
  });
}

export async function fetchContent(params: { status?: string; platform?: string } = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.platform) search.set('platform', params.platform);
  const suffix = search.toString() ? `?${search.toString()}` : '';
  return adminFetch<GeneratedContent[]>(`/content/${suffix}`);
}

export function generateContent(feedIds?: number[]) {
  return adminFetch<{ message: string; result: Record<string, unknown> }>('/content/generate', {
    method: 'POST',
    body: JSON.stringify({ feed_ids: feedIds && feedIds.length > 0 ? feedIds : null }),
  });
}

export function runBrandValidation(contentIds?: number[]) {
  return adminFetch<{ message: string; result: Record<string, unknown> }>('/brand-validation/run', {
    method: 'POST',
    body: JSON.stringify({ content_ids: contentIds && contentIds.length > 0 ? contentIds : null }),
  });
}

export function approveContent(contentId: number, scheduled_publish_time?: string) {
  return adminFetch<GeneratedContent>(`/content/${contentId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({
      approved_by: getAdminUser() || 'admin',
      scheduled_publish_time: scheduled_publish_time || null,
    }),
  });
}

export function rejectContent(contentId: number, reason?: string) {
  return adminFetch<GeneratedContent>(`/content/${contentId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejected_by: getAdminUser() || 'admin', reason }),
  });
}

export function schedulePublish(contentId: number, platform: string, scheduled_publish_time: string) {
  return adminFetch<{ message: string; result: Record<string, unknown> }>('/publish/schedule', {
    method: 'POST',
    body: JSON.stringify({
      items: [{ content_id: contentId, platform, scheduled_publish_time }],
    }),
  });
}

export function fetchPublishLogs() {
  return adminFetch<PublishLog[]>('/publish/logs');
}

export function updatePublishStatus(logId: number, status: string, post_url?: string) {
  return adminFetch<PublishLog>(`/publish/logs/${logId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, post_url: post_url || null }),
  });
}

export function fetchAgentRuns() {
  return adminFetch<AgentRun[]>('/agent-runs/');
}
