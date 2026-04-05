// ── Auth Utilities ────────────────────────────────────────────────────────────
// Default credentials (used on first run, before any password change)
const DEFAULT_PASSWORD = "admin123";
const AUTH_KEY = "fd_auth";
const PWD_KEY = "fd_password";
const SESSION_KEY = "fd_session";

/** Get the stored password (or default if none set yet) */
export function getStoredPassword() {
  return localStorage.getItem(PWD_KEY) || DEFAULT_PASSWORD;
}

/** Set a new password */
export function setStoredPassword(newPassword) {
  localStorage.setItem(PWD_KEY, newPassword);
}

/** Check if user is currently logged in */
export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

/** Login: validate password and set session */
export function login(password) {
  if (password === getStoredPassword()) {
    localStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

/** Logout: clear session */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
