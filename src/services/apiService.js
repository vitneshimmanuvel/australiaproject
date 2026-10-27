const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  // 1. Hierarchy & Departments
  async getHierarchy() {
    try {
      const res = await fetch(`${API_BASE}/hierarchy`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error, using local fallback for hierarchy:', e);
      return null;
    }
  },

  async createDepartment(name, icon = 'folder', created_by = 'Department Manager') {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, icon, created_by })
    });
    return await res.json();
  },

  // 2. Policies
  async getPolicies(departmentId = 'all', search = '', userRole = 'employee') {
    try {
      const url = new URL(`${API_BASE}/policies`);
      if (departmentId && departmentId !== 'all') url.searchParams.append('department_id', departmentId);
      if (search) url.searchParams.append('search', search);
      url.searchParams.append('user_role', userRole);

      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error, using local fallback for policies:', e);
      return null;
    }
  },

  async getPolicyDetails(id, userRole = 'employee') {
    try {
      const res = await fetch(`${API_BASE}/policies/${id}?user_role=${userRole}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error for policy details:', e);
      return null;
    }
  },

  async createPolicy(policyData) {
    const res = await fetch(`${API_BASE}/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData)
    });
    return await res.json();
  },

  async updatePolicy(id, updateData) {
    const res = await fetch(`${API_BASE}/policies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  async togglePolicyStatus(id, status, userName) {
    const res = await fetch(`${API_BASE}/policies/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, user_name: userName })
    });
    return await res.json();
  },

  async togglePolicyMasking(id, is_masked, userName) {
    const res = await fetch(`${API_BASE}/policies/${id}/mask`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_masked, user_name: userName })
    });
    return await res.json();
  },

  // 3. Maker-Checker Governance & Notifications
  async getMakerCheckerItems() {
    try {
      const res = await fetch(`${API_BASE}/maker-checker`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error for maker-checker:', e);
      return { pendingCount: 0, pending: [], history: [] };
    }
  },

  async actionMakerChecker(id, action, checkerName, comments) {
    const res = await fetch(`${API_BASE}/maker-checker/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, checker_name: checkerName, comments })
    });
    return await res.json();
  },

  async closeMakerCheckerItem(id) {
    const res = await fetch(`${API_BASE}/maker-checker/${id}/close`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_closed: true })
    });
    return await res.json();
  },

  // 4. Change Logs
  async getChangeLogs() {
    try {
      const res = await fetch(`${API_BASE}/change-logs`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error for change logs:', e);
      return [];
    }
  },

  // 5. Operational Dashboard Metrics
  async getDashboardMetrics(departmentId = 'all') {
    try {
      const res = await fetch(`${API_BASE}/dashboard-metrics?department_id=${departmentId}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      console.warn('API error for metrics:', e);
      return [];
    }
  },

  // 6. AI Document Ingestion (Groq) & RAG (Neon pgvector)
  async ingestDocuments(payload) {
    let headers = {};
    let body = payload;

    if (!(payload instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(payload);
    }

    const res = await fetch(`${API_BASE}/ai/ingest-documents`, {
      method: 'POST',
      headers,
      body
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to ingest documents');
    }
    return await res.json();
  },

  async queryRag(question, departmentId = 'all') {
    try {
      const res = await fetch(`${API_BASE}/ai/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, department_id: departmentId })
      });
      if (!res.ok) throw new Error('RAG query error');
      return await res.json();
    } catch (e) {
      console.warn('RAG query error:', e);
      return null;
    }
  }
};
