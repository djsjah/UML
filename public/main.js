import { IModal } from './presentation/modal/IModal.js';
import { ModalBuilder } from './presentation/modal/ModalBuilder.js';
import { ModalMutator } from './presentation/modal/ModalMutator.js';
import { ModalDestructor } from './presentation/modal/ModalDestructor.js';
import { ModalAuthorizer } from './presentation/modal/ModalAuthorizer.js';
import { ModalRegistrar } from './presentation/modal/ModalRegistrar.js';
import { ModalRestorer } from './presentation/modal/ModalRestorer.js';
import { ModalInstaller } from './presentation/modal/ModalInstaller.js';
import { startClientTableObserver } from './presentation/observer/ClientTableObserver.js';
import {
  ClientTable, startTablePreloader, endTablePreloader, setTableError, showClientInTable
} from './presentation/table/ClientTable.js';
import { convertResponseToJson, getClientArrayFromDb, isStatusOk } from './data/Api.js';

const STRING_DELIMETER = {
  openDelimeter: '{',
  closeDelimeter: '}'
};

let clientArray = [];

function main() {
  const clientLoadTime = document.querySelector('.footer-block__time_client');
  clientLoadTime.textContent = ` ${parseFloat(((new Date() - startLoadDate) * 0.001).toFixed(3))} seconds`;

  app();
}

async function app() {
  IModal();
  ModalAuthorizer();
  ModalRegistrar();
  ModalRestorer();
  ModalInstaller();

  startTablePreloader();

  try {
    clientArray = await getClientArrayFromDb();
    isStatusOk(clientArray);
    clientArray = await convertResponseToJson(clientArray);
  }
  catch (err) {
    console.log(err);
    await endTablePreloader();
    setTableError(err);
    return;
  }

  await endTablePreloader();
  startClientTableObserver();

  console.log(clientArray);

  for (const client of clientArray) {
    showClientInTable(client);
  }

  ClientTable();

  ModalBuilder();
  ModalMutator();
  ModalDestructor();
}

main();

export function spliceArray(array) {
  array.splice(0, array.length);
}

export function useTemplate(template, curElem) {
  curElem.append(template.content.cloneNode(true));
}

export function reverseArray(array) {
  array = array.reverse();
}

export function setClientArray(array) {
  clientArray = array;
}

export function swapValuesInArray(firstIndex, secondIndex, array) {
  const memory = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = memory;
}

export function swapTextContent(elem1, elem2) {
  const memory = elem1.textContent;
  elem1.textContent = elem2.textContent;
  elem2.textContent = memory;
}

export function getStringDelimeter() {
  return STRING_DELIMETER;
}

export function getClientArray() {
  return clientArray;
}

export function getLastElemInArray(array) {
  return array[array.length - 1];
}

export function getChildElementIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}

export function getDataFromForm(form) {
  return Object.values(form).reduce((obj, field) => {
    if (field.name !== '') {
      obj[field.name] = field.value;
    }

    return obj;
  }, {});
}

export function removeDuplFromArray(array) {
  const seen = {};
  return array.filter((item) => {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

export function binarySearch(array, value) {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (array[mid] == value) {
      return mid;
    }
    else if (value > array[mid]) {
      start = mid + 1;
    }
    else if (value < array[mid]) {
      end = mid - 1;
    }
  }

  return false;
}

export function quickSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const pivot = array[array.length - 1];
  const leftList = [];
  const rightList = [];

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivot) {
      leftList.push(array[i]);
    }
    else {
      rightList.push(array[i])
    }
  }

  return [...quickSort(leftList), pivot, ...quickSort(rightList)];
}
