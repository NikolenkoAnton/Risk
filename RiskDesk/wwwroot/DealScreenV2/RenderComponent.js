const renderDealsHeaders = () => {
    return `<div class="dropRow dropHeader">
                                <div class="dropCell">DealID</div>
                                <div class="dropCell">DealName</div>
                                <div class="dropCell">DealDate</div>
                            </div>`;
}

const renderPartsHeaders = () => {
    return `<div class="dropRow dropHeader">
                                <div class="dropCell">Term</div>
                                <div class="dropCell">Broker Fee</div>
                                <div class="dropCell">Deal Margin</div>
                                <div class="dropCell">Risk Premium</div>
                                <div class="dropCell">Delete</div>

                            </div>`;
}
const renderDealRow = (deal) => {
    const {
        wholeSaleDealName,
        wholeSaleDealID,
        startDate
    } = deal;
    const mappedDate = mapDate(startDate);
    const classes = selectedDealID === +wholeSaleDealID ? "dropRow selected" : "dropRow";
    return `<div class="${classes}">
     <div class="dropCell"> ${wholeSaleDealID}</div>
     <div class="dropCell"> ${wholeSaleDealName} </div>
     <div class="dropCell"> ${mappedDate}</div>
     </div>`;
}
async function renderDeal (){
    const deals = await getDeals();
    const dealsContainer = document.querySelector('#DealDrop');
    let renderedDeals = renderDealsHeaders();
    renderedDeals += deals.map(el => renderDealRow(el)).join('');
    dealsContainer.innerHTML = renderedDeals;
}
async function renderInputs() {
    const [customers, brokers] = await Promise.all([getDealsCustomers(), getDealsBrokers()]);

    console.log(customers, brokers);
    const custCont = document.querySelector('#CustomerSelect');
    const brokerCont = document.querySelector('#BrokerSelect');

    custCont.innerHTML += customers.map(el => `
                                        <option value="${el.customerid}">
                                        ${el.customername}
                                        </option>`).join('');
    brokerCont.innerHTML += brokers.map(el => `
                                        <option value="${el.brokerID}">
                                        ${el.brokerName}
                                        </option>`).join('');
}
const renderParts = (part) => {
    return `<div class="dropRow">
                                <div class="dropCell"><input type="number" value="${part.term}" class="partInput"></div>
                                <div class="dropCell"><input type="number" value="${part.brokerFee}" class="partInput"></div>
                                <div class="dropCell"><input type="number" value="${part.dealMargin}" class="partInput"></div>
                                <div class="dropCell"><input type="number" value="${part.riskPremium}" class="partInput"></div>
                                <div class="dropCell"><img height="20" onclick="RemoveDealPart(event.target)" class="backet" width="23"src="/csss/deal/trash.svg"></div>

                            </div>`;
}
const renderNewPart = () => {
    return `<div class="dropRow">
                                <div class="dropCell"><input type="number" onblur="SaveInputValue(this)" class="partInput"></div>
                                <div class="dropCell"><input type="number" onblur="SaveInputValue(this)" class="partInput"></div>
                                <div class="dropCell"><input type="number" onblur="SaveInputValue(this)" class="partInput"></div>
                                <div class="dropCell"><input type="number" onblur="SaveInputValue(this)" class="partInput"></div>
                                <div class="dropCell"><img height="20" onclick="RemoveDealPart(event.target)" class="backet" width="23"src="/csss/deal/trash.svg"></div>

                            </div>`;
}
//term brokerFee dealMargin riskPremium 
const fillSelect = (id, selectName) => {
    [...$(`#${selectName}`)[0].children].forEach(el => {
        console.log(el);
        if (+el.value === id) el.selected = true
    })

}
const fillPickedDealInfo = (deal) => {
    const {
        brokerID,
        customerID,
        wholeSaleDealName,
        comitted,
        notes,
        startDate,
        parts
    } = deal;

    fillSelect(brokerID, 'BrokerSelect');
    fillSelect(customerID, 'CustomerSelect');
    $('#InputName').val(wholeSaleDealName);
    $('#Notes').val(notes);
    $('#StartDate').val(mapDate(startDate));
    if (comitted) {
        $('#contactChoice1')[0].checked = true;
    } else {
        $('#contactChoice2')[0].checked = true;
    }
    const mapParts = renderPartsHeaders()+parts.map(el => renderParts(el)).join('');
    $('#PartDrop').html(mapParts);
}