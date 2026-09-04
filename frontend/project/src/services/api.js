import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =========================
// ERROR HANDLING
// =========================

export function getApiError(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || 'Something went wrong.';
  }

  if (typeof data === 'string') {
    return data;
  }

  return (
    data.error ||
    data.detail ||
    Object.values(data)
      .flat()
      .join(' ') ||
    'Request failed.'
  );
}


// =========================
// AUTHENTICATION
// =========================

export async function login(username, password) {
  const res = await api.post('/accounts/login/', {
    username,
    password,
  });

  return res.data;
}

export async function register({
  username,
  email,
  password,
  role,
}) {
  const res = await api.post('/accounts/register/', {
    username,
    email,
    password,
    role,
  });

  return res.data;
}


// =========================
// CHALLENGES
// =========================

export async function getChallenges() {
  const res = await api.get('/challenges/');
  return res.data;
}

export async function createChallenge(payload) {
  const res = await api.post('/challenges/', payload);
  return res.data;
}

export async function getChallenge(id) {
  const res = await api.get(`/challenges/${id}/`);
  return res.data;
}

export async function updateChallenge(id, payload) {
  const res = await api.patch(`/challenges/${id}/`, payload);
  return res.data;
}

export async function deleteChallenge(id) {
  const res = await api.delete(`/challenges/${id}/`);
  return res.data;
}

export async function getDepartments() {
  const res = await api.get('/departments/');
  return res.data;
}


// =========================
// AI MATCHING
// =========================

export async function getRecommendations(challengeId) {
  const res = await api.get(
    `/matching/challenges/${challengeId}/recommendations/`
  );

  return res.data;
}


// =========================
// STARTUPS
// =========================

// Government can view a startup by ID
export async function getStartupById(id) {
  const res = await api.get(`/startups/${id}/`);
  return res.data;
}


// Startup creates its profile
export async function createStartupProfile(payload) {
  const res = await api.post(
    '/startups/profile/',
    payload
  );

  return res.data;
}


// Startup gets its own profile
export async function getMyStartupProfile() {
  const res = await api.get(
    '/startups/my-profile/'
  );

  return res.data;
}


// Startup updates its own profile
export async function updateMyStartupProfile(payload) {
  const res = await api.patch(
    '/startups/my-profile/',
    payload
  );

  return res.data;
}


// =========================
// APPLICATIONS
// =========================

export async function selectStartup(
  challenge_id,
  startup_id
) {
  const res = await api.post(
    '/applications/select-startup/',
    {
      challenge_id,
      startup_id,
    }
  );

  return res.data;
}

export async function getStartupApplications() {
  const res = await api.get(
    '/applications/startup/'
  );

  return res.data;
}

export async function respondToApplication(
  id,
  action
) {
  const res = await api.post(
    `/applications/${id}/respond/`,
    {
      action,
    }
  );

  return res.data;
}

export async function updateApplicationProgress(
  id,
  progress_percentage
) {
  const res = await api.patch(
    `/applications/${id}/progress/`,
    {
      progress_percentage,
    }
  );

  return res.data;
}

export async function getGovernmentApplications() {
  const res = await api.get(
    '/applications/government/'
  );

  return res.data;
}


// =========================
// NOTIFICATIONS
// =========================

export async function getNotifications() {
  const res = await api.get(
    '/notifications/'
  );

  return res.data;
}

export async function markNotificationRead(id) {
  const res = await api.patch(
    `/notifications/${id}/read/`
  );

  return res.data;
}


export default api;