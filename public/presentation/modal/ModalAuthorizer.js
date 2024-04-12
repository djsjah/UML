import { getModalName, showModal, hideModal } from './IModal.js';
import { getModalRegistrar } from './ModalRegistrar.js';
import { getModalRestorer } from './ModalRestorer.js';

const NAME = getModalName() + 'authorizer';
const modalAuthorizer = document.querySelector(`.${NAME}`);

export function ModalAuthorizer() {
  const openModalButton = document.querySelector('.user__button_in');
  const callModalRegistrar = document.querySelector('.modal__button_call_registrar');
  const callModalRestorer = document.querySelector('.modal__button_restore');
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  openModalButton.addEventListener('click', async () => {
    await showModal(modalAuthorizer, NAME);
  });

  callModalRegistrar.addEventListener('click', async () => {
    await hideModal(modalAuthorizer);
    await showModal(getModalRegistrar().elem, getModalRegistrar().name);
  });

  callModalRestorer.addEventListener('click', async () => {
    await hideModal(modalAuthorizer);
    await showModal(getModalRestorer().elem, getModalRestorer().name);
  });

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalAuthorizer);
    });
  });
}
