export async function convertResponseToJson(response) {
  return (
    await response.json()
  );
}

export async function addClientToDb(client) {
  return (
    await fetch(`${window.API_URL}/clients`, {
      method: 'POST',
      body: JSON.stringify(client),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
}

export async function removeClientFromDb(clientId) {
  return (
    await fetch(`${window.API_URL}/clients/${clientId}`, {
      method: 'DELETE'
    })
  );
}

export async function changeClientInDb(client) {
  return (
    await fetch(`${window.API_URL}/clients/${client.id}`, {
      method: 'PATCH',
      body: JSON.stringify(client),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
}

export async function getClientArrayFromDb(searchString = '', page = 1, limit = 10) {
  return (
    await fetch(`${window.API_URL}/clients?search=${searchString}&page=${page}&limit=${limit}`)
  );
}

export async function getClientFromDb(clientId) {
  return (
    await fetch(`${window.API_URL}/clients/${clientId}`)
  );
}

export function getClientIdByLocation(response) {
  const clientURL = response.headers.get('Location');
  return clientURL.substring(clientURL.lastIndexOf('/') + 1);
}

export function isStatusOk(response) {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
