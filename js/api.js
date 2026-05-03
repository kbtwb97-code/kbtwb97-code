// =============================================
// ГЛАВНЫЕ НАСТРОЙКИ — МЕНЯЙ ТОЛЬКО ЭТИ ДВЕ СТРОКИ
// =============================================

const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnTX97ex-yPFXr8oeHMiaoKekTX5qRIhew8WwSbT4sh3ByDSY1NWshLf-AmdFtKmXpnxlmey-MHGRtzerQus2Ol_Sx4jdn029uHSoTRl1ZA9cfgpaLn7_KPaPGgrvBEwdn-qC9VIZ0ysSepuZCW7uc8HXfjCs67UV4wcFfK7rCGChFY0-4QF6TRlyo4WNvL2-He62n-_0QzfAhnm_EOjprYtN-yqpe7mS2w979rS34REMSYoyqv3LWrVg4VvRFOzYKwzbpoq-fYF96FqKgFoTaHNytdFcw&lib=MiZHaH3dnrTipwqMfWeivc_b40ZRUnSGk';
const SECRET_KEY = 'admin';

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
