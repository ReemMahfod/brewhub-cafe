const KEY = 'brewhub_staff';

export function isLoggedIn() {
  return sessionStorage.getItem(KEY) === '1';
}

export function doLogin() {
  sessionStorage.setItem(KEY, '1');
}

export function doLogout() {
  sessionStorage.removeItem(KEY);
}
