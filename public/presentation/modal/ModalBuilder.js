import { setContact, isNeedToResetContact } from './Contact.js';
import
{ getModalName, showModal, hideModal, startSavePreloader, endSavePreloader, setModalError } from './IModal.js';
import { ModalClient } from '../mediator/ModalClient.js';
import { addAutocValue } from '../table/Autocomplete.js';
import { getFilterState, isClientInFilter } from '../table/Filter.js';
import { resetTable, getClientTableBody, showClientInTable } from '../table/ClientTable.js';
import { getSortLabel, getCurSortField, getCurSortLabel, heapSort } from '../table/SortCurator.js';
import { getClientArray } from '../../main.js';
import {
  convertResponseToJson, addClientToDb, getClientFromDb, getClientIdByLocation, isStatusOk
} from '../../data/Api.js';

const NAME = getModalName() + 'builder';
const modalBuilder = document.querySelector(`.${NAME}`);

export function ModalBuilder() {
  const openModalButton = document.querySelector('.crm-panel__button');
  const modalForm = document.querySelector(`.${NAME} .modal__body_form`);
  const addContactButton = document.querySelector(`.${NAME} .modal__button_contact`);
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  openModalButton.addEventListener('click', async () => {
    await showModal(modalBuilder, NAME);
  });

  modalForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const addClientButton = document.querySelector(`.${NAME} .modal__button_save`);
    let client = null;

    startSavePreloader(addClientButton);

    try {
      const response = await addClientToDb(ModalClient(modalForm));
      isStatusOk(response);

      client = await getClientFromDb(getClientIdByLocation(response));
      isStatusOk(client);
      client = await convertResponseToJson(client);
    }
    catch (err) {
      await endSavePreloader(addClientButton);
      setModalError(err);
      return;
    }

    await endSavePreloader(addClientButton);
    await hideModal(modalBuilder);
    resetModal(modalForm);

    if (getFilterState() && !isClientInFilter(client)) {
      return;
    }

    getClientArray().push(client);
    resetTable();
    addAutocValue(client);

    if (getClientTableBody().children.length !== 1) {
      switch (true) {
        case getCurSortLabel() === getSortLabel().inc:
          heapSort(getClientArray(), getClientArray().length, getCurSortField());
          break;

        default:
          heapSort(getClientArray(), getClientArray().length, getCurSortField(), 'min');
      }

      for (const client of getClientArray()) {
        showClientInTable(client);
      }
    }
  });

  addContactButton.addEventListener('click', () => {
    setContact(addContactButton);
  });

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalBuilder);
    });
  });
}

function resetModal(modalForm) {
  modalForm.reset();
  isNeedToResetContact(NAME);
}
