let isSelected = false;
const changes = [];
let customers = [];
let facilities = [];
let facilities2 = [];
let selectedRow;

//accNumber customerName
let changedFacility = [];

async function sendGetRequest(url) {
    const response = await fetch(url);
    console.log(response.json());
    console.log(JSON.stringify(response.json()));
    console.log(response.body())
    return response.json();
}

const getCustomers = () => {
    const url = '/api/generic/GetCustomers';
    return [...ReturnDataFromService(url)];
}

const getFacilities = () => {
    const url = '/api/generic/GetFacilities';
    return [...ReturnDataFromService(url)];
}

const updateRequest = (data) => {
    const url = `/api/generic/CustomerFacilityUpdate`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(response => alertify.success(`Facility  ${data.AccNumber} updated!`));
}

async function updateRequest1(obj) {
    const url = `/api/generic/CustomerFacilitiesUpdate`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj)
    });
    const facilities = await response.json();
    return facilities;
}
async function updateFacilities() {
    if (!changedFacility.length) {
        alertify.error(`No changed facilities found!`);
        return;
    }
    const testArr = [];
    const facilitiesNum = [];
    for (const facility of changedFacility) {
        const AccNumber = facility.accNumber;
        facilitiesNum.push(AccNumber);
       for (const customer of customers) {
           if (customer.name === facility.customerName) {
               const CustomerId = customer.id;
               testArr.push({ CustomerId, AccNumber });
               //updateRequest({ CustomerId, AccNumber });
           }
       }
    }

    facilities = (await updateRequest1({ facilities: testArr })).map(el => ({ ...el, customerName: el.customerId === 0 ? 'Unassigned' : el.customerName }));;

    renderFacilities(facilities);
    changedFacility = [];
    for (const num of facilitiesNum) {
        alertify.success(`Facility ${num} updated!`)
    }

    const filterFacility = document.querySelector('#FacilityFilter');
    filterFacility.value = 'All';
}
//#region CustomerMethods
const getRowHeader = (type) => {

       const custHeader = `<div class="custRow header"><div class="custName custHeader">Customer</div></div>`;
       const accHeader = ` <div class="accRow header">
                                                    <div class="accNum accHeader" > Utilty Account Number</div>
                                                    <div class="accCust accHeader">Current Customer</div>
                                                </div>`;
        return type === 'Customer' ? custHeader : accHeader;                                        
};
                                    
const getCustomerRow = customer => {
    const { id,name } = customer;
    return `<div class="custRow" data-customer-name="${name}" data-customer-id="${id}">
                <div class="custName">${name}</div>
                </div>`;
}
const renderCustomers = (customers) => {
    let rows = getRowHeader('Customer');
    for(const customer of customers) {
        rows += getCustomerRow(customer); 
    }
    const container = document.querySelector('.customerContainer');
    container.innerHTML = rows;
    addEventsToCust();
}
//#endregion
//#region FacilityMethods
const getUnassignedFacilities = () => facilities.filter(el => el.customerName === 'Unassigned');
//const mapFacilities = facility => ({
//    accNumber:facility.accNumber,
//    customer: facility.customerId === 0? 'Unassigned' : facility.customerName,
//})
const getAccountRow = account => {
    const { accNumber,customerName } = account;

    return `<div class="accRow" onclick="assignCustomerToFacility()">
    <div class="accNum">${accNumber}</div>
    <div class="accCust">${customerName}</div>
    </div>`;
}
const renderFacilities = (fac) => {
    let rows = getRowHeader('Facility');
    for (const facility of fac) {
        rows+=getAccountRow(facility); 
    }
    
    const container = document.querySelector('.accContainer');
    container.innerHTML = rows;
    addEventsToAcc();
}

const renderUnassignedFacilities = (facilities) => {
   const UnassignedFacilities = facilities.filter(el => el.customerId === 0);
   renderFacilities(UnassignedFacilities);
}
const filterFacilities = (select) => select.value === 'All' ? renderFacilities(facilities) : renderFacilities(getUnassignedFacilities());

function assignCustomerToFacility() {
    if(!selectedRow) return;
    const customerName = selectedRow.dataset.customerName;
    const [accNumDiv, custNameDiv] = [...this.children];
    if (customerName === custNameDiv.innerText) {

        alertify.error(`Customer already assigned!`);
        return;
    }
    for (const fclt of facilities) {
        if (fclt.accNumber === accNumDiv.innerText) {
            fclt.customerName = customerName;
        }
    }
    custNameDiv.innerText = customerName; 
    for (const facility of changedFacility) {
        if (facility.accNumber === accNumDiv.innerText) {
            facility.customerName = customerName;
            return;
        }
    }
    changedFacility.push({
                            customerName,
        accNumber: accNumDiv.innerText
    });
}
//#endregion
//#region select
const getSelectedCustRow = () => {
    const custRows = [...document.querySelectorAll('.custRow')];
    for (const row of custRows) {
        if (row.classList.toString().includes('selected')) return row;
    }
}
const isSelectedCustRow = (row) => {
    return row.classList.includes('selected');
}

const selectToggle = (custRow) => {
    selectedRow = isSelected? null : custRow;
    isSelected = isSelected ? false : true;
    custRow.classList.toggle('selected');
}

function selectCustomerToggle () {
    let selectedRow;
    if(isSelected) {
        selectedRow = getSelectedCustRow();
        if(selectedRow === this) {
            selectToggle(selectedRow);
            return;
        }
        else {
            selectToggle(selectedRow);
        }     
    }
    selectToggle(this);
}
//#endregion

function addEventsToCust() {
    const custRows = [...document.querySelectorAll('.custRow')];

    for(const row of custRows) {
        if(!row.classList.toString().includes('header')) {
            row.onclick = selectCustomerToggle;
        }
    }
}
function addEventsToAcc() {
    const accRows = [...document.querySelectorAll('.accRow')];
    for(const row of accRows) {
        if (!row.classList.toString().includes('header')) {
            row.onclick = assignCustomerToFacility;
        }
    }
}

function initialize (){

    //id, name
    customers = getCustomers();

    //customerId, customerName, accNumber
    facilities = getFacilities().map(el => ({...el, customerName: el.customerId === 0? 'Unassigned' : el.customerName}));
    renderCustomers(customers);
    renderFacilities(facilities);    
}
