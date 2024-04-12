import { applyFilter } from './Filter.js';
import {
  useTemplate, getClientArray, getLastElemInArray, removeDuplFromArray, binarySearch, quickSort
} from '../../main.js';

const tableDataList = document.querySelector('.header-block__datalist');
const dataListTemplate = document.querySelector('.datalist-template');

let curFocus = null;
let autocValueArray = [];

export function Autocomplete(autocInput) {
  setTableDataList();

  document.addEventListener('mouseup', (ev) => {
    if (
      !autocInput.contains(ev.target) && !tableDataList.contains(ev.target) &&
      !tableDataList.classList.contains('hidden-total')
    ) {
      tableDataList.classList.add('hidden-total');
    }
  });

  autocInput.addEventListener('input', () => {
    curFocus = -1;

    if (tableDataList.children.length !== 0) {
      resetTableDataList();
    }

    if (tableDataList.classList.contains('hidden-total')) {
      tableDataList.classList.remove('hidden-total');
    }

    if (autocInput.value.length === 0) {
      tableDataList.classList.add('hidden-total');
    }

    for (let i = 0; i < autocValueArray.length; i++) {
      if (autocValueArray[i].toLowerCase().includes(autocInput.value.toLowerCase())) {
        useTemplate(dataListTemplate, tableDataList);

        const tableDataListItem = getLastElemInArray(tableDataList.children);
        const tableDataListButton = tableDataListItem.querySelector('.header-block__button');

        const subValueIndex = autocValueArray[i].toLowerCase().indexOf(autocInput.value.toLowerCase());
        const autocInputValue = autocValueArray[i].substr(subValueIndex, autocInput.value.length);

        tableDataListButton.innerHTML = autocValueArray[i].replace(autocInputValue, '<b>' + autocInputValue + '</b>');

        tableDataListButton.addEventListener('click', () => {
          autocInput.value = tableDataListButton.textContent.trim();
          tableDataList.classList.add('hidden-total');
        });
      }
    }
  });

  autocInput.addEventListener('keydown', (ev) => {
    if (!tableDataList.classList.contains('hidden-total')) {
      switch (ev.key) {
        case 'ArrowUp':
          curFocus--;
          addActiveFocus();
          break;

        case 'ArrowDown':
          curFocus++;
          addActiveFocus();
          break;

        case 'Enter':
          if (curFocus > -1) {
            autocInput.value = tableDataList.children[curFocus].firstElementChild.textContent.trim();
            tableDataList.classList.add('hidden-total');
            applyFilter(autocInput);
          }

          break;
      }
    }
  });
}

export function resetAutocValueArray() {
  autocValueArray = [];
  setTableDataList();
}

export function addAutocValue(client) {
  autocValueArray = quickSort(autocValueArray);
  if (!binarySearch(`${client.surname} ${client.name} ${client.lastName}`, autocValueArray)) {
    autocValueArray.push(`${client.surname} ${client.name} ${client.lastName}`);

    for (const contact of client.contacts) {
      autocValueArray.push(contact.value);
    }
  }
}

function resetTableDataList() {
  tableDataList.textContent = '';
}

function addActiveFocus() {
  removeActiveFocus();

  if (curFocus === tableDataList.children.length) {
    curFocus = 0;
  }
  else if (curFocus < 0) {
    curFocus = tableDataList.children.length - 1;
  }

  tableDataList.children[curFocus].firstElementChild.scrollIntoView({ behavior: 'smooth' });
  tableDataList.children[curFocus].firstElementChild.classList.add('header-block__button_active');
}

function removeActiveFocus() {
  for (const tableData of tableDataList.children) {
    if (tableData.firstElementChild.classList.contains('header-block__button_active')) {
      tableData.firstElementChild.classList.remove('header-block__button_active');
    }
  }
}

function setTableDataList() {
  for (const client of getClientArray()) {
    autocValueArray.push(`${client.surname} ${client.name} ${client.lastName}`);

    for (const contact of client.contacts) {
      autocValueArray.push(contact.value);
    }
  }

  autocValueArray = removeDuplFromArray(autocValueArray);
}
