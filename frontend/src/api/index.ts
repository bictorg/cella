import type { ErrorType } from 'backend/lib/errors';
import type { AuthRoutes } from 'backend/modules/auth/index';
import type { GeneralRoutes } from 'backend/modules/general/index';
import type { MeRoutes } from 'backend/modules/me/index';
import type { MembershipsRoutes } from 'backend/modules/memberships/index';
import type { OrganizationsRoutes } from 'backend/modules/organizations/index';
import type { ProjectsRoutes } from 'backend/modules/projects/index';
import type { RequestsRoutes } from 'backend/modules/requests/index';
import type { UsersRoutes } from 'backend/modules/users/index';
import type { WorkspacesRoutes } from 'backend/modules/workspaces/index';
import type { EntityType } from 'backend/types/common';

import { config } from 'config';
import { hc, type ClientResponse } from 'hono/client';

// Custom error class to handle API errors
export class ApiError extends Error {
  status: string | number;
  type?: string;
  entityType?: EntityType;
  severity?: string;
  logId?: string;
  path?: string;
  method?: string;
  timestamp?: string;
  usr?: string;
  org?: string;

  constructor(error: ErrorType) {
    super(error.message);
    this.status = error.status;
    this.type = error.type;
    this.entityType = error.entityType;
    this.severity = error.severity;
    this.logId = error.logId;
    this.path = error.path;
    this.method = error.method;
    this.timestamp = error.timestamp;
    this.usr = error.usr;
    this.org = error.org;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: any is used to handle any type of response
export const handleResponse = async <T extends Record<string, any>, U extends ClientResponse<T, number, 'json'>>(response: U) => {
  if (response.ok) {
    const json = await response.json();
    return json as Awaited<ReturnType<Extract<U, { status: 200 }>['json']>>;
  }

  const json = await response.json();
  if ('error' in json) throw new ApiError(json.error);
  throw new Error('Unknown error');
};

const clientConfig = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
};

// Create Hono clients to make requests to the backend
export const meClient = hc<MeRoutes>(`${config.backendUrl}/me`, clientConfig);
export const usersClient = hc<UsersRoutes>(`${config.backendUrl}/users`, clientConfig);
export const membershipsClient = hc<MembershipsRoutes>(`${config.backendUrl}/memberships`, clientConfig);
export const organizationsClient = hc<OrganizationsRoutes>(`${config.backendUrl}/organizations`, clientConfig);
export const requestsClient = hc<RequestsRoutes>(`${config.backendUrl}/requests`, clientConfig);
export const generalClient = hc<GeneralRoutes>(config.backendUrl, clientConfig);
export const authClient = hc<AuthRoutes>(config.backendUrl, clientConfig);
export const workspacesClient = hc<WorkspacesRoutes>(`${config.backendUrl}/workspaces`, clientConfig);
export const projectsClient = hc<ProjectsRoutes>(`${config.backendUrl}/projects`, clientConfig);
