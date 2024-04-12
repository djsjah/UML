import { setupOpenModalMutator } from '../modal/ModalMutator.js';
import { setupOpenModalDestructor } from '../modal/ModalDestructor.js';
import { getClientTableBody } from '../table/ClientTable.js';
import { getChildElementIndex } from '../../main.js';

const observerConfig = {
  childList: true,
  subtree: false,
  attributes: false,
  characterData: false
}

const observerCallback = (mutationArray) => {
  for (const mutation of mutationArray) {
    if (mutation.type === 'childList') {

      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeName !== "#text" && addedNode.classList.contains('client-table__row_observer')) {
          const openModalMutatorButton = addedNode.querySelector('.client-table__button_edit');
          const openModalDestructorButton = addedNode.querySelector('.client-table__button_remove');

          setupOpenModalMutator(openModalMutatorButton, getChildElementIndex(addedNode));
          setupOpenModalDestructor(openModalDestructorButton, getChildElementIndex(addedNode));
          break;
        }
      }
    }
  }
}

const ClientTableObserver = new MutationObserver(observerCallback);

export function startClientTableObserver() {
  ClientTableObserver.observe(getClientTableBody(), observerConfig);
}
