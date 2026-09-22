// Thin wrapper around fetch() for the XTREQ API.
//
// Everything else in the app (hooks, components) should go through the
// helpers here rather than calling fetch() directly, so that auth headers,
// error shapes, and the base URL are handled in exactly one place.


const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const TOKEN_KEY = "xtreq_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// A typed error so callers can branch on status / validation detail instead
// of parsing strings. Thrown by request() below.
export class ApiError extends Error {
  constructor(message, { status, detail } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail; // raw HTTPValidationError.detail array, when present
  }
}

function buildQuery(params) {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    usp.append(key, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

// Turns FastAPI's 422 HTTPValidationError shape into one readable line,
// e.g. "email: field required, password: ensure this value has at least 8 characters"
function formatValidationDetail(detail) {
  if (!Array.isArray(detail)) return null;
  return detail
    .map((d) => `${(d.loc || []).slice(1).join(".")}: ${d.msg}`)
    .join(", ");
}

/**
 * @param {string} path - e.g. "/api/v1/riders"
 * @param {object} options
 * @param {"GET"|"POST"|"PATCH"|"DELETE"} [options.method]
 * @param {object} [options.body] - JSON-serializable request body
 * @param {object} [options.params] - query params
 * @param {boolean} [options.auth] - attach the bearer token (default true)
 * @param {object} [options.headers] - extra headers, e.g. Idempotency-Key
 */
export async function request(
  path,
  { method = "GET", body, params, auth = true, headers = {} } = {}
) {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    // Network failure (server down, CORS, offline, etc.)
    throw new ApiError("Couldn't reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  // 401 anywhere means the stored token is dead — clear it so the next
  // render drops the user back to /login instead of looping on stale auth.
  if (res.status === 401) {
    setToken(null);
    if (auth) {
      window.dispatchEvent(new Event("xtreq:unauthorized"));
    }
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const detail = payload && typeof payload === "object" ? payload.detail : null;
    const message =
      formatValidationDetail(detail) ||
      (typeof detail === "string" ? detail : null) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, detail });
  }

  return payload;
}

// Convenience verbs
export const api = {
  get: (path, params, options) => request(path, { method: "GET", params, ...options }),
  post: (path, body, options) => request(path, { method: "POST", body, ...options }),
  patch: (path, body, options) => request(path, { method: "PATCH", body, ...options }),
  del: (path, options) => request(path, { method: "DELETE", ...options }),
};

// CSV export endpoints (`/export`) return text/csv, not JSON, and are meant
// to be downloaded rather than parsed — so they get their own helper that
// triggers a browser download instead of returning data to render.
export async function downloadCsv(path, params, filename) {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;
  const token = getToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event("xtreq:unauthorized"));
  }
  if (!res.ok) {
    throw new ApiError(`Export failed (${res.status})`, { status: res.status });
  }
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename || "export.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
