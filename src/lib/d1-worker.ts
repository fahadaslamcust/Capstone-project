
import "server-only";

type CreateProjectInput = {
  name: string;
  description: string | null;
  organizationId: string;
  createdById: string;
};

export type RecentActivityRow = {
  id: string;
  action: string;
  createdAt: number;
  userName: string;
  projectName: string | null;
};

function getConfig() {
  const url = process.env.D1_WORKER_URL;
  const secret = process.env.D1_WORKER_SECRET;

  if (!url || !secret) {
    throw new Error("D1 Worker environment variables are missing.");
  }

  return { url: url.replace(/\/+$/, ""), secret };
}

async function workerRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, secret } = getConfig();

  const response = await fetch(`${url}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init.headers,
      "X-API-Secret": secret,
      "Content-Type": "application/json",
    },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`D1 Worker request failed (${response.status}).`);
  }

  return data as T;
}

export async function createProjectInD1(
  input: CreateProjectInput,
) {
  return workerRequest<{ success: true; projectId: string }>(
    "/projects/create",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function getRecentActivityFromD1(
  organizationId: string,
) {
  const query = new URLSearchParams({ organizationId });

  return workerRequest<{ rows: RecentActivityRow[] }>(
    `/activity/recent?${query.toString()}`,
  );
}

export type D1Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  organizationId: string;
  createdById: string;
  createdAt: number;
  updatedAt: number;
};

export async function getFilteredProjectsFromD1(
  orgId: string,
  query: string,
  status: string,
) {
  const params = new URLSearchParams({
    organizationId: orgId,
    query,
    status,
  });

  return workerRequest<{ projects: D1Project[] }>(
    `/projects?${params.toString()}`,
  );
}

export async function getProjectStatsFromD1(organizationId: string) {
  const query = new URLSearchParams({ organizationId });

  return workerRequest<{
    rows: { status: string; total: number }[];
  }>(`/projects/stats?${query.toString()}`);
}
export async function archiveProjectInD1(input: {
  projectId: string;
  organizationId: string;
  userId: string;
}) {
  return workerRequest<{ success: true }>(
    "/projects/archive",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
export async function updateProjectInD1(input: {
  projectId: string;
  name: string;
  description: string | null;
  organizationId: string;
  userId: string;
}) {
  return workerRequest<{ success: true }>(
    "/projects/update",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}