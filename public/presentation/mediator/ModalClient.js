import { Client, resetClientTemplate } from '../../data/Client.js';
import { getStringDelimeter, getDataFromForm } from '../../main.js';

const CONTACT_TYPE_CODE = {
  0: 'Телефон',
  1: 'Доп. телефон',
  2: 'Email',
  3: 'Vk',
  4: 'Facebook',
  5: 'Другое'
};

const CONTACT_TYPEDEF = {
  tel: ['Телефон', 'Доп. телефон'],
  email: 'Email',
  text: ['Vk', 'Facebook', 'Другое']
};

export const ModalClient = (clientForm) => {
  const clientFormData = getDataFromForm(clientForm);
  let client = null;

  for (const key in clientFormData) {
    if (!isNaN(getContactTypeCode(key))) {
      client = Client(convertClientDataKey(key), clientFormData[key], true);
    }
    else if (key !== 'contact') {
      client = Client(key, clientFormData[key]);
    }
  }

  const clientCopy = Object.assign({}, client);
  resetClientTemplate();

  return clientCopy;
}

export function defineContactTypeCode(contactType) {
  return Object.keys(CONTACT_TYPE_CODE).find(key => CONTACT_TYPE_CODE[key] === contactType);
}

export function defineContactTypedef(contactType) {
  for (const key in CONTACT_TYPEDEF) {
    switch (CONTACT_TYPEDEF[key].constructor) {
      case Array:
        if (CONTACT_TYPEDEF[key].includes(contactType)) {
          return key;
        }

        break;

      default:
        if (CONTACT_TYPEDEF[key] === contactType) {
          return key;
        }
    }
  }
}

function getContactTypeCode(clientDataKey) {
  return Number(clientDataKey[0]);
}

function getContactTypedef(clientDataKey) {
  return clientDataKey.substring(1).split(getStringDelimeter().openDelimeter)[0];
}

function getContactTypeByCode(contactTypeCode) {
  return CONTACT_TYPE_CODE[contactTypeCode];
}

function convertClientDataKey(clientDataKey) {
  return getContactTypeByCode(getContactTypeCode(clientDataKey));
}
