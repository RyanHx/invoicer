let currency = '£';

function getNewSpan() {
    const currencySpan = document.createElement('span');
    currencySpan.classList.add('currency');
    currencySpan.textContent = currency;
    return currencySpan;
}

function saveToStorage(element) {
    localStorage.setItem(element.id, element.value);
}

function setFromStorage() {
    const inputs = [document.getElementById('personal-info'),
    document.getElementById('bill-target'),
    document.getElementById('bank-name'),
    document.getElementById('account-name'),
    document.getElementById('account-number'),
    document.getElementById('sort-code')];

    for (const element of inputs) {
        if (localStorage.getItem(element.id)) {
            element.value = localStorage.getItem(element.id);
        }
    }
}

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

function setCurrencySymbol() {
    const symbolInput = document.getElementById('currency-symbol-input');
    if (symbolInput.value) {
        localStorage.setItem('currency', symbolInput.value);
        updateCurrencyLabels();
    }
}

function updateCurrencyLabels() {
    if (localStorage.getItem('currency')) {
        currency = localStorage.getItem('currency');
    }
    document.getElementById('currency-symbol-input').value = currency;
    for (const element of document.querySelectorAll('span.currency')) {
        element.innerText = currency;
    }
}

function submitRowModal() {
    // Inputs
    const descriptionEle = document.getElementById('row-description');
    const rateEle = document.getElementById('row-rate');
    const qtyEle = document.getElementById('row-qty');
    // Table
    const table = document.getElementById('invoice-table');
    const row = table.insertRow();
    row.insertCell(0).textContent = descriptionEle.value;
    const rateCell = row.insertCell(1);
    rateCell.classList.add('text-end');
    if (rateEle.value) {
        rateCell.appendChild(getNewSpan());
        rateCell.appendChild(document.createTextNode(rateEle.value));
    }
    const qtyCell = row.insertCell(2);
    qtyCell.classList.add('text-end');
    if (qtyEle.value) {
        qtyCell.appendChild(document.createTextNode(qtyEle.value));
    }
    const totalCell = row.insertCell(3);
    totalCell.classList.add('text-end');
    if (rateEle.valueAsNumber && qtyEle.valueAsNumber) {
        totalCell.appendChild(getNewSpan());
        totalCell.appendChild(document.createTextNode(rateEle.valueAsNumber * qtyEle.valueAsNumber));
    }
    tableChanged();
}

function removeTableRow() {
    const table = document.getElementById('invoice-table');
    if (table.rows.length > 1) {
        document.getElementById('invoice-table').deleteRow(-1);
        tableChanged();
    }
}

function resetEntryInput() {
    document.getElementById('row-description').value = '';
    document.getElementById('row-rate').value = '';
    document.getElementById('row-qty').value = '';
}

document.getElementById('date').textContent = (new Date()).toLocaleDateString();
document.getElementById('due-date').valueAsDate = new Date();
setFromStorage();
tableChanged();
updateCurrencyLabels();