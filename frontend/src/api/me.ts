import { meClient as client, handleResponse } from '.';
import type { UpdateUserParams } from './users';

// Get the current user
export const getMe = async () => {
  const response = await client.index.$get();

  const json = await handleResponse(response);
  return json.data;
};

// Get the current user menu
export const getUserMenu = async () => {
  const response = await client.menu.$get();

  const json = await handleResponse(response);
  return json.data;
};

// Update self
export const updateSelf = async (params: Omit<UpdateUserParams, 'role'>) => {
  const response = await client.index.$put({
    json: params,
  });

  const json = await handleResponse(response);
  return json.data;
};

// Terminate a user sessions
export const terminateMySessions = async (sessionIds: string[]) => {
  const response = await client.sessions.$delete({
    query: { ids: sessionIds },
  });

  await handleResponse(response);
};
