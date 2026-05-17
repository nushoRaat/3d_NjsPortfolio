const BASE = '/api/portfolio';

function authHeaders() {
  const token = localStorage.getItem('admin_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ── Public reads ─────────────────────────────────────────────────────────────

export async function fetchPortfolio() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function fetchBio() {
  const res = await fetch(`${BASE}/bio`);
  if (!res.ok) throw new Error('Failed to fetch bio');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${BASE}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function fetchContact() {
  const res = await fetch(`${BASE}/contact`);
  if (!res.ok) throw new Error('Failed to fetch contact');
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to change password');
  return data;
}

// ── Admin writes ─────────────────────────────────────────────────────────────

export async function updateBio(bio) {
  const res = await fetch(`${BASE}/bio`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(bio) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update bio');
  return data;
}

export async function updateContact(contact) {
  const res = await fetch(`${BASE}/contact`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(contact) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update contact');
  return data;
}

export async function createProject(project) {
  const res = await fetch(`${BASE}/projects`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(project) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create project');
  return data;
}

export async function updateProject(id, project) {
  const res = await fetch(`${BASE}/projects/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(project) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update project');
  return data;
}

export async function deleteProject(id) {
  const res = await fetch(`${BASE}/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete project');
  return data;
}

export async function createSkill(skill) {
  const res = await fetch(`${BASE}/skills`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(skill) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create skill');
  return data;
}

export async function updateSkill(id, skill) {
  const res = await fetch(`${BASE}/skills/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(skill) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update skill');
  return data;
}

export async function deleteSkill(id) {
  const res = await fetch(`${BASE}/skills/${id}`, { method: 'DELETE', headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete skill');
  return data;
}

export async function updateExperience(data) {
  const res = await fetch(`${BASE}/experience`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Failed to update experience');
  return out;
}

export async function updateEducation(data) {
  const res = await fetch(`${BASE}/education`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Failed to update education');
  return out;
}

export async function updateSoftSkills(data) {
  const res = await fetch(`${BASE}/softskills`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Failed to update soft skills');
  return out;
}

export async function uploadFile(file) {
  const token = localStorage.getItem('admin_token');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}
