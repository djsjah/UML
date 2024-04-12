import { getCurModal } from './IModal.js';
import { defineContactTypedef, defineContactTypeCode } from '../mediator/ModalClient.js';
import { useTemplate, swapTextContent, getStringDelimeter, getLastElemInArray } from '../../main.js';

const CONTACT_LIMIT = 10;

const installerContactTemplate = document.querySelector('.installer-template_contact');

let contactWrapper = null;
let contactList = null;
let contactInputId = 0;

export function resetContact() {
  contactList.textContent = '';
  contactWrapper.classList.remove('modal__wrapper_exposed');
  contactList.classList.add('hidden-total');
}

export function isNeedToResetContact(modalName = getCurModal().name) {
  updateContact(modalName);
  if (isContact()) {
    resetContact();
  }
}

export function setContact(addContactButton, contact = false) {
  updateContact();

  if (!isContactLimit() && addContactButton.classList.contains('hidden-total')) {
    addContactButton.classList.remove('hidden-total');
  }

  if (!isContact()) {
    contactWrapper.classList.add('modal__wrapper_exposed');
    contactList.classList.remove('hidden-total');
  }

  useTemplate(installerContactTemplate, contactList);
  setupInstallerContact(addContactButton, contact);
  setupSelectContact(contact);

  if (isContactLimit()) {
    addContactButton.classList.add('hidden-total');
  }
}

function updateContact(modalName = getCurModal().name) {
  contactWrapper = document.querySelector(`.${modalName} .modal__wrapper_contact`);
  contactList = document.querySelector(`.${modalName} .modal__list_contact`);
}

function overrideInputContactName(inputContact, inputContactType) {
  const inputTypeCode = defineContactTypeCode(inputContactType);
  const openDelimeter = getStringDelimeter().openDelimeter;
  const closeDelimeter = getStringDelimeter().closeDelimeter;

  inputContact.name = inputTypeCode + inputContact.type + `${openDelimeter + String(++contactInputId) + closeDelimeter}`;
}

function toggleSelectContact(selectWrapper, selectButton) {
  selectWrapper.classList.toggle('hidden');
  selectButton.classList.toggle('custom-select__flag-close');
  selectButton.classList.toggle('custom-select__flag-open');
}

function setupSelectContact(contact) {
  const selectWrapper = getLastElemInArray(document.querySelectorAll(`.${getCurModal().name} .modal__wrapper_select`));
  const selectButton = getLastElemInArray(document.querySelectorAll(`.${getCurModal().name} .custom-select__button`));
  const inputContact = getLastElemInArray(document.querySelectorAll(`.${getCurModal().name} .modal__input_contact`));

  const selectInputArray = selectWrapper.querySelectorAll('.custom-select__input');
  const selectValueArray = selectWrapper.querySelectorAll('.custom-select__text');

  document.addEventListener('mouseup', (ev) => {
    if (
      !selectButton.contains(ev.target) && !selectWrapper.contains(ev.target) &&
      !selectWrapper.classList.contains('hidden')
    ) {
      toggleSelectContact(selectWrapper, selectButton);
    }
  });

  if (contact && selectButton.textContent.trim() !== contact.type) {
    for (let i = 0; i < selectValueArray.length; i++) {
      if (selectValueArray[i].textContent.trim() === contact.type) {
        swapTextContent(selectButton, selectValueArray[i]);
        break;
      }
    }
  }

  selectButton.addEventListener('click', () => {
    toggleSelectContact(selectWrapper, selectButton);
  });

  overrideInputContactName(inputContact, selectButton.textContent.trim());

  for (let i = 0; i < selectInputArray.length; i++) {
    selectInputArray[i].addEventListener('change', () => {
      if (selectInputArray[i].checked) {
        const contactTypedef = defineContactTypedef(selectValueArray[i].textContent.trim());

        if (inputContact.type !== contactTypedef) {
          inputContact.type = contactTypedef;
        }

        if (inputContact.value.length !== 0) {
          inputContact.parentNode.classList.add('modal__label_contact_empty');
        }

        overrideInputContactName(inputContact, selectValueArray[i].textContent.trim());
        swapTextContent(selectButton, selectValueArray[i]);
        toggleSelectContact(selectWrapper, selectButton);

        selectInputArray[i].checked = false;
      }
    });
  }
}

function setupInstallerContact(addContactButton, contact) {
  const itemContact = getLastElemInArray(
    contactList.querySelectorAll(`.${getCurModal().name} .modal__item`)
  );

  const installerContact = getLastElemInArray(
    document.querySelectorAll(`.${getCurModal().name} .modal__installer_contact`)
  );

  const inputContact = getLastElemInArray(
    document.querySelectorAll(`.${getCurModal().name} .modal__input_contact`)
  );

  const removeContactButton = getLastElemInArray(
    document.querySelectorAll(`.${getCurModal().name} .modal__button_remove`)
  );

  if (contact) {
    installerContact.classList.add('modal__installer_exposed');
    removeContactButton.classList.remove('hidden-total');

    inputContact.type = defineContactTypedef(contact.type);
    inputContact.value = contact.value;
  }

  inputContact.addEventListener('input', () => {
    if (inputContact.value.length > 0 && removeContactButton.classList.contains('hidden-total')) {
      installerContact.classList.add('modal__installer_exposed');
      removeContactButton.classList.remove('hidden-total');
    }
    else if (inputContact.value.length === 0) {
      if (inputContact.parentNode.classList.contains('modal__label_contact_empty')) {
        inputContact.parentNode.classList.remove('modal__label_contact_empty');
      }

      installerContact.classList.remove('modal__installer_exposed');
      removeContactButton.classList.add('hidden-total');
    }
  });

  removeContactButton.addEventListener('click', () => {
    if (isContactLimit()) {
      addContactButton.classList.remove('hidden-total');
    }

    itemContact.remove();

    if (!isContact()) {
      contactWrapper.classList.remove('modal__wrapper_exposed');
      contactList.classList.add('hidden-total');
    }
  });
}

function isContactLimit() {
  return contactList.children.length === CONTACT_LIMIT;
}

function isContact() {
  return contactList.children.length > 0;
}
