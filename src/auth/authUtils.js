// ── Auth Utilities ────────────────────────────────────────────────────────────
// Default credentials (used on first run, before any password change)
const DEFAULT_EMAIL = "admin@dashboard.com";
const DEFAULT_PASSWORD = "admin123";
const AUTH_KEY = "fd_auth";
const PWD_KEY = "fd_password";
const EMAIL_KEY = "fd_email";
const SESSION_KEY = "fd_session";

/** Get the stored email (or default if none set yet) */
export function getStoredEmail() {
  return localStorage.getItem(EMAIL_KEY) || DEFAULT_EMAIL;
}

/** Get the stored password (or default if none set yet) */
export function getStoredPassword() {
  return localStorage.getItem(PWD_KEY) || DEFAULT_PASSWORD;
}

/** Set a new password */
export function setStoredPassword(newPassword) {
  localStorage.setItem(PWD_KEY, newPassword);
}

/** Sign up: store new email and password */
export function signup(email, password) {
  localStorage.setItem(EMAIL_KEY, email);
  localStorage.setItem(PWD_KEY, password);
  localStorage.setItem(SESSION_KEY, "true");
}

/** Check if user is currently logged in */
export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

/** Login: validate email and password and set session */
export function login(email, password) {
  if (email === getStoredEmail() && password === getStoredPassword()) {
    localStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

/** Logout: clear session */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

