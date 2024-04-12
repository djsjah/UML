import { getModalName, showModal, hideModal } from './IModal.js';

const NAME = getModalName() + 'restorer';
const modalRestorer = document.querySelector(`.${NAME}`);

export function ModalRestorer() {
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalRestorer);
    });
  });
}

export function getModalRestorer() {
  return { name: NAME, elem: modalRestorer };
}

