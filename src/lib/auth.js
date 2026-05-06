export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
}

export function getRole() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_role');
}

export function getUserName() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_name');
}
