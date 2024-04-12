import { getModalName, showModal, hideModal } from './IModal.js';

const NAME = getModalName() + 'registrar';
const modalRegistrar = document.querySelector(`.${NAME}`);

export function ModalRegistrar() {
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalRegistrar);
    });
  });
}

export function getModalRegistrar() {
  return { name: NAME, elem: modalRegistrar };
}
