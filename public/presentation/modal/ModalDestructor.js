import { getModalName, hideModal, showModal, startSavePreloader, endSavePreloader, setModalError } from './IModal.js';
import { resetAutocValueArray } from '../table/Autocomplete.js';
import { resetTable, showClientInTable } from '../table/ClientTable.js';
import { getClientArray } from '../../main.js';
import { removeClientFromDb, isStatusOk } from '../../data/Api.js';

const NAME = getModalName() + 'destructor';
const modalDestructor = document.querySelector(`.${NAME}`);
let curClientIndex = null;

export function ModalDestructor() {
  const removeClientButton = document.querySelector(`.${NAME} .modal__button_save`);
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  removeClientButton.addEventListener('click', async () => {
    startSavePreloader(removeClientButton);

    try {
      const response = await removeClientFromDb(getClientArray()[curClientIndex].id);
      isStatusOk(response);
    }
    catch (err) {
      await endSavePreloader(removeClientButton);
      setModalError(err);
      return;
    }

    await endSavePreloader(removeClientButton);
    await hideModal(modalDestructor);
    getClientArray().splice(curClientIndex, 1);
    resetTable();
    resetAutocValueArray();

    for (const client of getClientArray()) {
      showClientInTable(client);
    }
  });

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalDestructor);
    });
  });
}

export function setCurClientIndex(clientIndex) {
  curClientIndex = clientIndex;
}

export function setupOpenModalDestructor(openModalButton, clientIndex) {
  openModalButton.addEventListener('click', async () => {
    setCurClientIndex(clientIndex);
    await showModal(modalDestructor, NAME);
  });
}

export function getModalDestructor() {
  return { name: NAME, elem: modalDestructor };
}
