// Shared API helper functions for MentorConnect frontend

const API_BASE = 'http://localhost:3000/api';

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// --- Simple "logged in user" storage (NOT real auth/security) ---

function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
  const raw = localStorage.getItem('currentUser');
  return raw ? JSON.parse(raw) : null;
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}