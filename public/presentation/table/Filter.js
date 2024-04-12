import { resetTable, startTablePreloader, endTablePreloader, setTableError, showClientInTable } from './ClientTable.js';
import { setClientArray } from '../../main.js';
import { convertResponseToJson, getClientArrayFromDb, isStatusOk } from '../../data/Api.js';

let filterTimeout = null;
let filterState = false;

export function Filter(filterInput) {
  filterInput.addEventListener('input', () => {
    if (filterInput.value.length > 0) {
      filterState = filterInput.value;
    }
    else {
      filterState = false;
    }

    applyFilter(filterInput);
  });
}

export function applyFilter(filterInput) {
  clearTimeout(filterTimeout);

  filterTimeout = setTimeout(async () => {
    let requestClientArray = null;
    let filterInputValue = filterInput.value;

    resetTable();
    startTablePreloader();

    if (filterInput.value.indexOf(' ') >= 0 && !Number(filterInput.value.trim()[1])) {
      filterInputValue = filterInput.value.split(' ')[0];
    }

    try {
      requestClientArray = await getClientArrayFromDb(filterInputValue);
      isStatusOk(requestClientArray);
      requestClientArray = await convertResponseToJson(requestClientArray);
    }
    catch (err) {
      await endTablePreloader();
      setTableError(err);
      return;
    }

    await endTablePreloader();
    setClientArray(requestClientArray);

    if (requestClientArray.length === 0) {
      setTableError("No results were found for your request");
    }
    else {
      for (const client of requestClientArray) {
        showClientInTable(client);
      }
    }
  }, 300);
}

export function getFilterState() {
  return filterState;
}

export function isClientInFilter(client) {
  if (`${client.surname} ${client.name} ${client.lastName}`.includes(filterState)) {
    return true;
  }
  else {
    for (const contact of client.contacts) {
      if (filterState.includes(contact.value)) {
        return true;
      }
    }
  }

  return false;
}
