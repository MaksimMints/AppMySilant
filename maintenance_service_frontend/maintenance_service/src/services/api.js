export async function fetchMachineBySerial(serial) {
  const url = `/api/machines/?serial_number_machine=${encodeURIComponent(serial)}`;

  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, 
  });

  if (!resp.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await resp.json();
  if (Array.isArray(data)) {
    return data.length ? data[0] : null;
  }
  return data;
}

export async function fetchMachinesForCurrentUser() {
  const url = '/api/machines/';
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = await res.json();
  console.log('Machines response:', data);
  return Array.isArray(data) ? data : [data];
}

export async function fetchTmForCurrentUser() {
  const url = '/api/tm/';
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = await res.json();
  console.log('TM response:', data);
  return Array.isArray(data) ? data : [data];
}

export async function fetchClaimsForCurrentUser() {
  const url = '/api/claims/';
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = await res.json();
  console.log('Claims response:', data);
  return Array.isArray(data) ? data : [data];
}

export async function fetchMachineById(id) { 
    if (!id) return null; 
    const url = `/api/machines/${id}`; 
    const res = await fetch(url, { credentials: 'include' }); 
    if (!res.ok) { 
        throw new Error(`Failed to fetch machine with id ${id}`); 
    } const data = await res.json();
     return Array.isArray(data) ? data[0] : data; }

export async function fetchAllMachines() { 
    const url = '/api/machines/all';
    const res = await fetch(url, { credentials: 'include' }); 
    if (!res.ok) throw new Error('Failed to fetch all machines'); 
    const data = await res.json(); 
    return data; }

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export async function createMachine(data) {
  const csrfToken = getCookie('csrftoken');
  const res = await fetch('/api/machines/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Ошибка' }));
    throw new Error(err.detail || 'Ошибка создания машины');
  }

  return await res.json();
}

export async function createTm(data) {
  const csrfToken = getCookie('csrftoken');
  const res = await fetch('/api/tm/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Ошибка' }));
    throw new Error(err.detail || 'Ошибка создания ТО');
  }

  return await res.json();
}

export const createClaim = async (claimData) => {
  const res = await fetch('/api/claims/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(claimData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Ошибка создания рекламации');
  }
  return res.json();
};
