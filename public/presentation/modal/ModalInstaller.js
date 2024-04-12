import { getModalName, showModal, hideModal } from './IModal.js';

const NAME = getModalName() + 'installer';
const modalInstaller = document.querySelector(`.${NAME}`);

export function ModalInstaller() {
  const closeModalButtonArray = document.querySelectorAll(`.${NAME} .modal__button_cancel`);

  closeModalButtonArray.forEach((closeModalButton) => {
    closeModalButton.addEventListener('click', async () => {
      await hideModal(modalInstaller);
    });
  });
}
