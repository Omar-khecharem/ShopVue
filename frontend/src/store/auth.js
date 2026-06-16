import { reactive } from 'vue';
import api from '../services/api.js';

const token = localStorage.getItem('token');

const auth = reactive({
  token: token || null,
  user: null,
  initDone: false,
  get isLoggedIn() {
    return !!this.token;
  },
  get isAdmin() {
    return this.user?.role === 'admin';
  },
});

export async function initAuth() {
  if (!auth.token) {
    auth.initDone = true;
    return;
  }
  try {
    const { data } = await api.get('/auth/me');
    auth.user = data.user;
  } catch {
    auth.token = null;
    auth.user = null;
    localStorage.removeItem('token');
  } finally {
    auth.initDone = true;
  }
}

export function setAuth(data) {
  auth.token = data.token;
  auth.user = data.user;
  localStorage.setItem('token', data.token);
}

export function clearAuth() {
  auth.token = null;
  auth.user = null;
  localStorage.removeItem('token');
}

export default auth;
