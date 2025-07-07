import { getItem } from '../services/storageService';

export async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getItem('userToken');

  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
