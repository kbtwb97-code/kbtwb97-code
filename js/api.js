// =============================================
// ГЛАВНЫЕ НАСТРОЙКИ — МЕНЯЙ ТОЛЬКО ЭТИ ДВЕ СТРОКИ
// =============================================

const API_URL = 'https://script.google.com/macros/s/AKfycbwUZI-aFKp2urRlvvVRLDao29mwz7p2GFLPcluyxZ80eL7WykV2N6v71vC9WGyZQKA5/exec';
const SECRET_KEY = 'keykeykey';

// =============================================
// НЕ ТРОГАЙ КОД НИЖЕ
// =============================================

async function apiRequest(action, data = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, key: SECRET_KEY, ...data })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function saveSession(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function getSession() {
  const u = localStorage.getItem('currentUser');
  return u ? JSON.parse(u) : null;
}

function clearSession() {
  localStorage.removeItem('currentUser');
}

function requireAuth() {
  const user = getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

const API = {

  async register(username, email, password) {
    return await apiRequest('register', { username, email, password });
  },

  async login(email, password) {
    const result = await apiRequest('login', { email, password });
    if (result.success) saveSession(result.user);
    return result;
  },

  async logout() {
    const user = getSession();
    if (user) {
      await apiRequest('updateUser', { userId: user.id, isOnline: false });
    }
    clearSession();
    window.location.href = 'login.html';
  },

  async sendMessage(text) {
    const user = getSession();
    if (!user) return { success: false, error: 'Не авторизован' };
    return await apiRequest('sendMessage', {
      userId: user.id,
      username: user.username,
      email: user.email,
      text: text
    });
  },

  async getMessages(limit = 50) {
    const res = await fetch(`${API_URL}?action=getMessages&key=${SECRET_KEY}&limit=${limit}`);
    return await res.json();
  },

  async saveTable(tableData) {
    const user = getSession();
    if (!user) return { success: false, error: 'Не авторизован' };
    return await apiRequest('saveTable', {
      userId: user.id,
      username: user.username,
      email: user.email,
      tableData: tableData
    });
  },

  async getTables() {
    const user = getSession();
    if (!user) return { success: false, error: 'Не авторизован' };
    return await apiRequest('getTables', {
      userId: user.id,
      role: user.role
    });
  },

  async getUsers() {
    return await apiRequest('getUsers', {});
  }
};
