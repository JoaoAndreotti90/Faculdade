export function handleApiError(response: any, fallback = 'Erro desconhecido') {
  if (!response.ok) {
    return response.json().then((data: any) => {
      throw new Error(data.erro || fallback);
    });
  }
  return response.json();
}