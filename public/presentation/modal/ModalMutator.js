import { isNeedToResetContact, setContact } from './Contact.js';
import { getModalDestructor, setCurClientIndex } from './ModalDestructor.js';
import { getModalName, showModal, hideModal, startSavePreloader, endSavePreloader, setModalError } from './IModal.js';
import { ModalClient } from '../mediator/ModalClient.js';
import { resetAutocValueArray } from '../table/Autocomplete.js';
import { getFilterState, isClientInFilter } from '../table/Filter.js';
import { getClientTableBody, changeClientInTable } from '../table/ClientTable.js';
import { getSortLabel, getCurSortField, getCurSortLabel, heapSort } from '../table/SortCurator.js';
import { getClientArray } from '../../main.js';
import { convertResponseToJson, changeClientInDb, getClientFromDb, isStatusOk } from '../../data/Api.js';

const NAME = getModalName() + 'mutator';

const modalMutator = document.querySelector(`.${NAME}`);
const addContactButton = document.querySelector(`.${NAME} .modal__button_contact`);

let curClientIndex = null;

export function ModalMutator() {
  const modalForm = document.querySelector(`.${NAME} .modal__body_form`);
  const modalRemoveButton = document.querySelector('.modal__button_call_remove');
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  modalForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const changeClientButton = document.querySelector(`.${NAME} .modal__button_save`);
    const modClient = ModalClient(modalForm);
    let client = null;

    startSavePreloader(changeClientButton);
    modClient.id = getClientArray()[curClientIndex].id;

    try {
      const response = await changeClientInDb(modClient);
      isStatusOk(response);

      client = await getClientFromDb(modClient.id);
      isStatusOk(client);
      client = await convertResponseToJson(client);
    }
    catch (err) {
      await endSavePreloader(changeClientButton);
      setModalError(err);
      return;
    }

    await endSavePreloader(changeClientButton);
    await hideModal(modalMutator);

    if (getFilterState() && !isClientInFilter(client)) {
      return;
    }

    getClientArray()[curClientIndex] = client;
    resetAutocValueArray();

    if (getClientTableBody().children.length !== 1) {
      switch (true) {
        case getCurSortLabel() === getSortLabel().inc:
          heapSort(getClientArray(), getClientArray().length, getCurSortField());
          break;

        default:
          heapSort(getClientArray(), getClientArray().length, getCurSortField(), 'min');
      }

      for (let i = 0; i < getClientArray().length; i++) {
        changeClientInTable(i);
      }
    }
    else {
      changeClientInTable(curClientIndex);
    }
  });

  addContactButton.addEventListener('click', () => {
    setContact(addContactButton);
  });

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalMutator);
    });
  });

  modalRemoveButton.addEventListener('click', async () => {
    await hideModal(modalMutator);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(setCurClientIndex(curClientIndex));
      }, 200);
    });
    await showModal(getModalDestructor().elem, getModalDestructor().name);
  });
}

function fillModalMutator(client) {
  const modalDataClientId = document.querySelector('.modal__data');
  const modalInputNameArray = document.querySelectorAll(`.${NAME} .modal__input_name`);

  isNeedToResetContact();
  modalDataClientId.textContent = client.id;

  Object.keys(client).forEach((clientKey) => {
    modalInputNameArray.forEach((modalInputName) => {
      if (modalInputName.name === clientKey) {
        modalInputName.value = `${client[clientKey]}`;
      }
    });
  });

  for (let i = 0; i < client.contacts.length; i++) {
    setContact(addContactButton, client.contacts[i]);
  }
}

export function setupOpenModalMutator(openModalButton, clientIndex) {
  openModalButton.addEventListener('click', async () => {
    curClientIndex = clientIndex;
    await showModal(modalMutator, NAME);
    fillModalMutator(getClientArray()[curClientIndex]);
  });
}
