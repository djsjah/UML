import { resetTable, showClientInTable } from './ClientTable.js';
import { reverseArray, swapValuesInArray, getClientArray, getLastElemInArray } from '../../main.js';

let sortLabelElem = document.querySelector('.client-table__text_unique');

const SORT_LABEL = {
  inc: 'inc',
  dec: 'dec'
};

const SORT_TYPE = {
  max: maxHeapify,
  min: minHeapify
};

const SORT_PARAM = {
  id: 'id',
  fullName: ['surname', 'name', 'lastName'],
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

let curSortField = SORT_PARAM.id;
let curSortLabel = SORT_LABEL.inc;

export function SortCurator() {
  const sortButtonArray = document.querySelectorAll('.client-table__main-button');

  sortButtonArray.forEach((sortButton) => {
    sortButton.addEventListener('click', () => {
      switch (true) {
        case sortButton.parentNode.classList.contains('client-table__main-col_id'):
          toggleSortLabel(sortButton, SORT_PARAM.id);
          overrideClientTable();
          break;

        case sortButton.parentNode.classList.contains('client-table__main-col_full-name'):
          toggleSortLabel(sortButton, SORT_PARAM.fullName);
          overrideClientTable();
          break;

        case sortButton.parentNode.classList.contains('client-table__main-col_date-creation'):
          toggleSortLabel(sortButton, SORT_PARAM.createdAt);
          overrideClientTable();
          break;

        case sortButton.parentNode.classList.contains('client-table__main-col_date-change'):
          toggleSortLabel(sortButton, SORT_PARAM.updatedAt);
          overrideClientTable();
          break;
      }
    });
  });
}

export function heapSort(array, arraySize, key, type = 'max') {
  for (let i = parseInt(arraySize / 2 - 1); i >= 0; i--) {
    SORT_TYPE[type](array, arraySize, i, key);
  }

  for (let i = arraySize - 1; i >= 0; i--) {
    swapValuesInArray(0, i, array);
    SORT_TYPE[type](array, i, 0, key);
  }
}

export function getSortLabel() {
  return SORT_LABEL;
}

export function getCurSortField() {
  return curSortField;
}

export function getCurSortLabel() {
  return curSortLabel;
}

function overrideClientTable() {
  resetTable();

  for (const client of getClientArray()) {
    showClientInTable(client);
  }
}

function toggleSortLabel(sortButton, sortParam) {
  const curSortLabelElem = sortButton.querySelector('.sort-label');

  if (curSortLabelElem.classList.contains('sort-label_neutral')) {
    curSortLabelElem.classList.add('sort-label_up');
    curSortLabelElem.classList.remove('sort-label_neutral');

    if (curSortLabel !== SORT_LABEL.inc) {
      curSortLabel = SORT_LABEL.inc;
    }
  }

  if (curSortField === sortParam) {
    reverseArray(getClientArray());
    curSortLabelElem.classList.toggle('sort-label_up');
    curSortLabelElem.classList.toggle('sort-label_down');

    curSortLabel === SORT_LABEL.inc ?
      curSortLabel = SORT_LABEL.dec : curSortLabel = SORT_LABEL.inc;
  }
  else {
    curSortField = sortParam;

    heapSort(getClientArray(), getClientArray().length, sortParam);

    sortLabelElem.classList.add('sort-label_neutral');

    if (sortLabelElem.classList.contains('sort-label_up')) {
      sortLabelElem.classList.remove('sort-label_up');
    }
    else {
      sortLabelElem.classList.remove('sort-label_down');
    }

    sortLabelElem = null;
  }

  if (sortLabelElem !== curSortLabelElem) {
    sortLabelElem = curSortLabelElem;
  }
}

function maxHeapify(array, arraySize, i, key) {
  let largest = i;
  let leftChild = 2 * i + 1;
  let rightChild = 2 * i + 2;

  if (leftChild < arraySize) {
    largest = setMaxHeapRoot(leftChild, largest, key, array);
  }

  if (rightChild < arraySize) {
    largest = setMaxHeapRoot(rightChild, largest, key, array);
  }

  if (largest != i) {
    swapValuesInArray(i, largest, array);
    maxHeapify(array, arraySize, largest, key);
  }
}

function minHeapify(array, arraySize, i, key) {
  let smallest = i;
  let leftChild = 2 * i + 1;
  let rightChild = 2 * i + 2;

  if (leftChild < arraySize) {
    smallest = setMinHeapRoot(leftChild, smallest, key, array);
  }

  if (rightChild < arraySize) {
    smallest = setMinHeapRoot(rightChild, smallest, key, array);
  }

  if (smallest != i) {
    swapValuesInArray(i, smallest, array);
    minHeapify(array, arraySize, smallest, key);
  }
}

function setMaxHeapRoot(child, largest, key, array) {
  let childComp = null;

  if (key.constructor === Array) {
    childComp = maxHeapCompByKeyArray(child, largest, key, array);
  }
  else {
    childComp = array[child][key] > array[largest][key];
  }

  return childComp ? child : largest;
}

function setMinHeapRoot(child, smallest, key, array) {
  let childComp = null;

  if (key.constructor === Array) {
    childComp = minHeapCompByKeyArray(child, smallest, key, array);
  }
  else {
    childComp = array[child][key] < array[smallest][key];
  }

  return childComp ? child : smallest;
}

function maxHeapCompByKeyArray(child, largest, keyArray, heap) {
  for (const key of keyArray) {
    if (heap[child][key] > heap[largest][key]) {
      return true;
    }
    else if (heap[child][key] < heap[largest][key]) {
      return false;
    }
  }

  return false;
}

function minHeapCompByKeyArray(child, smallest, keyArray, heap) {
  for (const key of keyArray) {
    if (heap[child][key] < heap[smallest][key]) {
      return true;
    }
    else if (heap[child][key] > heap[smallest][key]) {
      return false;
    }
  }

  return false;
}
