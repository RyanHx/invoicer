let currency = '£';
let entries = [];

/**
 * Generates a new span element, used for currency symbol labels.
 * @returns {HTMLSpanElement} Span element with 'currency' class.
 */
function getNewCurrencySpan() {
    const currencySpan = document.createElement('span');
    currencySpan.classList.add('currency');
    currencySpan.textContent = currency;
    return currencySpan;
}

/**
 * Resizes height of text area based on content, extending till all text is shown (no scroll).
 * @param {HTMLTextAreaElement} element 
 */
function autoSize(element) {
    element.style.overflow = 'hidden';
    element.style.height = 0;
    element.style.height = element.scrollHeight + 'px';
}

/**
 * Save input value to local storage. Called on input event.
 * @param {HTMLInputElement} element 
 */
function saveToStorage(element) {
    localStorage.setItem(element.id, element.value);
    if (element.nodeName === "TEXTAREA") {
        autoSize(element);
    }
}

/**
 * Set billing and entry fields from local storage.
 */
function setFromStorage() {
    const inputs = [document.getElementById('personal-info'),
    document.getElementById('bill-target'),
    document.getElementById('bank-name'),
    document.getElementById('account-name'),
    document.getElementById('account-number'),
    document.getElementById('sort-code')];
    for (const element of inputs) {
        const stored = localStorage.getItem(element.id);
        if (stored) {
            element.value = stored;
            if (element.nodeName === "TEXTAREA") {
                autoSize(element);
            }
        }
    }
    const storedEntries = localStorage.getItem('entries');
    if (storedEntries) {
        entries = JSON.parse(storedEntries);
        for (const entry of entries) {
            addTableRow(entry);
        }
    }
}

/**
 * Update "amount due" throughout invoice using entry table totals.
 */
function tableChanged() {
    let total = 0.0;
    const invoiceTableRows = document.getElementById('invoice-table').getElementsByTagName('tr');
    for (const row of invoiceTableRows) {
        const cellTotal = parseFloat(row.cells[3].textContent.replace(currency, ''));
        if (cellTotal) {
            total += cellTotal;
        }
    }
    for (const span of document.querySelectorAll('span.due')) {
        span.textContent = total;
    }
}

/**
 * Set currency symbol in local storage, call currency label update.
 */
function setCurrencySymbol() {
    const symbolInput = document.getElementById('currency-symbol-input');
    if (symbolInput.value) {
        localStorage.setItem('currency', symbolInput.value);
        updateCurrencyLabels();
    }
}

/**
 * Set currency labels throughout invoice via given input.
 */
function updateCurrencyLabels() {
    if (localStorage.getItem('currency')) {
        currency = localStorage.getItem('currency');
    }
    document.getElementById('currency-symbol-input').value = currency;
    for (const element of document.querySelectorAll('span.currency')) {
        element.innerText = currency;
    }
}

/**
 * Pull data from entry modal and push to localStorage + table.
 */
function submitRowModal() {
    const descriptionEle = document.getElementById('row-description');
    const rateEle = document.getElementById('row-rate');
    const qtyEle = document.getElementById('row-qty');
    const entry = {
        desc: descriptionEle.value,
        rate: rateEle.value,
        qty: qtyEle.value
    };
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    addTableRow(entry);
}

/**
 * Add row to entry table via entry object.
 * @param {{desc: string, rate: string, qty: string}} entry - Object containing entry data.
 */
function addTableRow(entry) {
    const table = document.getElementById('invoice-table');
    const row = table.insertRow();
    row.insertCell(0).textContent = entry.desc;
    const rateCell = row.insertCell(1);
    rateCell.classList.add('text-end');
    if (entry.rate) {
        rateCell.appendChild(getNewCurrencySpan());
        rateCell.appendChild(document.createTextNode(entry.rate));
    }
    const qtyCell = row.insertCell(2);
    qtyCell.classList.add('text-end');
    if (entry.qty) {
        qtyCell.appendChild(document.createTextNode(entry.qty));
    }
    const totalCell = row.insertCell(3);
    totalCell.classList.add('text-end');
    if (!isNaN(entry.rate) && !isNaN(entry.qty)) {
        totalCell.appendChild(getNewCurrencySpan());
        totalCell.appendChild(document.createTextNode(Number(entry.rate) * Number(entry.qty)));
    }
    tableChanged();
}

/**
 * Remove last entry from table and local storage.
 */
function removeTableRow() {
    const table = document.getElementById('invoice-table');
    if (table.rows.length > 1) {
        document.getElementById('invoice-table').deleteRow(-1);
        tableChanged();
        entries.pop();
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

/**
 * Clear inputs in "Add entry" modal.
 */
function resetEntryInput() {
    document.getElementById('row-description').value = '';
    document.getElementById('row-rate').value = '';
    document.getElementById('row-qty').value = '';
}

const date = new Date();
const dueDateElem = document.getElementById('due-date');
dueDateElem.valueAsDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
document.getElementById('date').textContent = dueDateElem.valueAsDate.toLocaleDateString();
setFromStorage();
tableChanged();
updateCurrencyLabels();