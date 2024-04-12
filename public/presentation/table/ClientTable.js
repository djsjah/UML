import { Filter } from './Filter.js';
import { Autocomplete } from './Autocomplete.js';
import { SortCurator } from './SortCurator.js';
import { useTemplate, getClientArray, getLastElemInArray } from '../../main.js';

const clientTableBody = document.querySelector('.client-table__body');
const contactTemplate = document.querySelector('.contact-template');

const CONTACT_TYPE_ICON = {
  phone: {
    elem: ['Телефон', 'Доп. телефон'],
    template: 'icon-template_phone'
  },

  mail: {
    elem: 'Email',
    template: 'icon-template_mail'
  },

  vk: {
    elem: 'Vk',
    template: 'icon-template_vk'
  },

  fb: {
    elem: 'Facebook',
    template: 'icon-template_fb'
  },

  abstract: {
    elem: 'Другое',
    template: 'icon-template_abstract_contact'
  },

  preview: {
    bindValue: 6,
    template: 'icon-template_preview'
  }
};

export function ClientTable() {
  const clientTableForm = document.querySelector('.header-block__form');
  const clientTableInput = document.querySelector('.header-block__input');

  clientTableForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
  });

  Filter(clientTableInput);
  Autocomplete(clientTableInput);
  SortCurator();
}

export function resetTable() {
  clientTableBody.textContent = '';
}

export function startTablePreloader() {
  const tablePreloaderTemplate = document.querySelector('.preloader-template_table');
  useTemplate(tablePreloaderTemplate, clientTableBody);

  const tablePreloader = document.querySelector('.client-table__col_preloader');
  tablePreloader.children[0].classList.add('rotate-anim');
}

export async function endTablePreloader() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(clientTableBody.children[0].remove());
    }, 1700);
  });
}

export function setTableError(err) {
  const tableErrorTemplate = document.querySelector('.table-template_error');
  useTemplate(tableErrorTemplate, clientTableBody);

  const errMessage = document.querySelector('.client-table__text_error');
  errMessage.textContent += err;
}

export function showClientInTable(client) {
  const tableTemplate = document.querySelector('.table-template_data');
  useTemplate(tableTemplate, clientTableBody);

  const curTableRow = getLastElemInArray(document.querySelectorAll('.client-table__row'));
  const tableColArray = curTableRow.querySelectorAll('.client-table__col');

  tableColArray.forEach((tableCol) => {
    setTableCol(tableCol, client);
  });
}

export function changeClientInTable(curClientIndex) {
  const curTableRow = clientTableBody.children[curClientIndex];
  const tableColArray = curTableRow.children;
  const modClient = getClientArray()[curClientIndex];

  for (const tableCol of tableColArray) {
    setTableCol(tableCol, modClient, true);
  }
}

export function removeClientFromTable(clientIndex) {
  clientTableBody.children[clientIndex].remove();
}

export function getClientTableBody() {
  return clientTableBody;
}

function setupDateParam(dateParam) {
  if (String(dateParam).length === 1) {
    return '0' + String(dateParam);
  }
  else {
    return String(dateParam);
  }
}

function setDateInTableCol(tableCol, fullDate) {
  const date = tableCol.querySelector('.client-table__text_date');
  const time = tableCol.querySelector('.client-table__text_time');
  const fullDateObj = new Date(fullDate);

  date.textContent = setupDateParam(fullDateObj.getDate()) + '.' + setupDateParam(fullDateObj.getMonth() + 1) + '.' +
    setupDateParam(fullDateObj.getFullYear());

  time.textContent = `${setupDateParam(fullDateObj.getHours())}:${setupDateParam(fullDateObj.getMinutes())}`;
}

function setupContactTooltip(contactTooltip, contact, contactPreview = false) {
  if (contactPreview) {
    contactTooltip.children[0].textContent = 'Показать все контакты';
  }
  else {
    contactTooltip.children[0].textContent = contact.type + ':';
    contactTooltip.children[1].textContent = contact.value;
  }
}

function setupContact(contact, contactList, client, contactPreview = false) {
  const contactButton = getLastElemInArray(contactList.querySelectorAll('.client-table__button_contact'));
  const contactTooltip = getLastElemInArray(contactList.querySelectorAll('.client-table__tooltip'));

  if (contactPreview) {
    useTemplate(document.querySelector(`.${CONTACT_TYPE_ICON.preview.template}`), contactButton);
    setupContactTooltip(contactTooltip, contact, true);

    contactButton.addEventListener('click', () => {
      contactButton.remove();
      for (let i = CONTACT_TYPE_ICON.preview.bindValue - 2; i < client.contacts.length; i++) {
        useTemplate(contactTemplate, contactList);
        setupContact(client.contacts[i], contactList, client);
      }
    });

    return;
  }

  for (const key in CONTACT_TYPE_ICON) {
    if (CONTACT_TYPE_ICON[key].hasOwnProperty('elem')) {
      switch (CONTACT_TYPE_ICON[key].elem.constructor) {
        case Array:
          if (CONTACT_TYPE_ICON[key].elem.includes(contact.type)) {
            useTemplate(document.querySelector(`.${CONTACT_TYPE_ICON[key].template}`), contactButton);
            setupContactTooltip(contactTooltip, contact);
          }

          break;

        default:
          if (CONTACT_TYPE_ICON[key].elem === contact.type) {
            useTemplate(document.querySelector(`.${CONTACT_TYPE_ICON[key].template}`), contactButton);
            setupContactTooltip(contactTooltip, contact);
          }
      }
    }
  }
}

function setTableCol(tableCol, client, changeClient = false) {
  switch (true) {
    case tableCol.classList.contains('client-table__col_id'):
      tableCol.textContent = client.id;
      break;

    case tableCol.classList.contains('client-table__col_full-name'):
      tableCol.textContent = `${client.surname} ${client.name} ${client.lastName}`;
      break;

    case tableCol.classList.contains('client-table__col_date-creation'):
      setDateInTableCol(tableCol, client.createdAt);
      break;

    case tableCol.classList.contains('client-table__col_date-change'):
      setDateInTableCol(tableCol, client.updatedAt);
      break;

    case tableCol.classList.contains('client-table__col_contacts'):
      const contactList = tableCol.querySelector('.client-table__list_contacts');

      if (changeClient) {
        contactList.textContent = '';
      }

      for (const contact of client.contacts) {
        useTemplate(contactTemplate, contactList);
        if (contactList.children.length === CONTACT_TYPE_ICON.preview.bindValue - 1) {
          setupContact(contact, contactList, client, true);
          break;
        }
        else {
          setupContact(contact, contactList, client);
        }
      }

      break;
  }
}

