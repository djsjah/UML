const client = {
  name: null,
  surname: null,
  lastName: null,
  contacts: []
};

export const Client = (clientDataKey, clientDataValue, contact = false) => {
  contact ?
    client.contacts.push({ type: clientDataKey, value: clientDataValue }) :
    client[clientDataKey] = clientDataValue;

  return client;
}

export function resetClientTemplate() {
  for (const key in client) {
    switch (client[key].constructor) {
      case Array:
        client[key] = [];
        break;

      default:
        client[key] = null;
    }
  }
}
