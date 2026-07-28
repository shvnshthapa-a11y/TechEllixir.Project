export type QueryStatus = "new" | "in-progress" | "resolved" | "archived";

export type ContactQuery = {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  type?: string;
  phone?: string;
  resumeUrl?: string;
  college?: string;
  year?: string;
};

export type QueryPayload = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data as T;
}

export function submitQuery(payload: QueryPayload) {
  return request<{ query: ContactQuery }>("/api/queries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function adminLogin(password: string, username = "admin") {
  return request<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function getAdminQueries(token: string) {
  return request<{ queries: ContactQuery[] }>("/api/admin/queries", {
    headers: { authorization: `Bearer ${token}` },
  });
}

export function updateQueryStatus(token: string, id: string, status: QueryStatus) {
  return request<{ query: ContactQuery }>(`/api/admin/queries/${id}`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}

export function deleteQuery(token: string, id: string) {
  return request<{ query: ContactQuery }>(`/api/admin/queries/${id}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });
}
