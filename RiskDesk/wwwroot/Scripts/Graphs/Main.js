let FilterAccNumber = ['0'];
let FilterCongestionZone = ['0'];
let FilterScenario = ['0'];
let FilterMonth = ['0'];
let FilterWholeSales = ['0'];
let FilterCounterparty = ['0'];
let currentGraphs = '';
let positionBooks;
const graphsNames = ['monthly', 'hourlyscalar', 'risk', 'weatherhourly', 'scatterplot', 'ercot', 'peak', ];

let filtersKeys = {
    FilterMonth: "monthsID",
    FilterScenario: "scenariosID",
    FilterCongestionZone: "zonesID",
    FilterWholeSales: "blocksID",
    FilterAccNumber: "accNumbersID",
    FilterCounterparty: "counterpartyID",
    FilterHours: "hoursID"
}

const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}

const addDataAttributesToFilters = () => {

    $('.dropdownFilter').each(function () {
        const id = $(this).attr("id");

        const attrValue = filtersKeys[id];

        $(this).data("filter", attrValue);
    });


}
const getSelectedFields = (dropdown) => {
    let indexes = '';
    if (dropdown) {
        const options = [...dropdown.selectedOptions];
        for (const opt of options) indexes += opt.value === '0' ? '' : opt.value;
    }
    return indexes.length ? indexes : '0';
}

const getFilteringString = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const zone = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[0])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[2])}`;
    return `?${zone}&${wholesale}&${accNumbers}`;
}

const getFilteringStringMontly = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const month = `Month=${getSelectedFields(arr[0])}`;
    const scenario = `Scenario=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${month}&${scenario}&${wholesale}&${accNumbers}`;
}

const setStartedDropdownValue = dropdowns => {
    for (const drop of dropdowns) {
        drop.selectedIndex = 0;
    }

};




//dropdownItems - list dropdown items  example:   [{ AccNumber: 1, AccNumberId : 25},{ AccNumber: 1, AccNumberId : 25}]
// itemValueName - item = { AccNumber: 1, AccNumberId : 25} == itemValueName = "AccNumber"; item = { Zone = "2x5" , Id = 22} == itemValueName = "Zo
const fillCurrentDropdown = (dropdownItems, itemValueName, dropdownID, itemIdName = "id") => {

    const dropdown = document.querySelector(dropdownID);

    if (!dropdown) {
        return;
    }
    for (const item of dropdownItems) {
        dropdown.innerHTML += getSelectOption(item[itemValueName], item[itemIdName]);
    }

    $(dropdown).multiselect({
        selectAll: true
    });

}

const getSelectOption = (value, index) => {
    return ` <option value="${index}">
                            ${value}
                            </option>`
}
const getCounterparties = async () => {
    const url = `/api/graphs/Counterparties`;
    return getRequestData(url);
}

const getCongestionZones = async () => {
    const url = `/api/graphs/CongestionZones`;
    return getRequestData(url);
}

const getAccNumbers = async () => {
    const url = `/api/graphs/AccNumbers`;
    return getRequestData(url);
}

const getWholeSales = async () => {
    const url = `/api/graphs/WholeSales`;
    return getRequestData(url);
}

const isAllPicked = arr => arr.includes('0');

const getOptionAllValue = dropdown => {
    for (const opt of dropdown.children) {
        if (opt.value === '0') return opt;
    }
}
const resetAllOption = dropdown => {
    for (const opt of dropdown.children) {
        opt.selected = false;
    }
}
const getAllOpt = dropdown => [...dropdown.selectedOptions].map(el => el.value);

const changeDropdowns = dropdown => {
    // const newSelectedOptions = getAllOpt(dropdown);
    // const currentOptions = filtersKeys[dropdown.id];
    // if (!newSelectedOptions.length || (isAllPicked(newSelectedOptions) && !isAllPicked(currentOptions))) {

    //     resetAllOption(dropdown);
    //     const allOpt = getOptionAllValue(dropdown);
    //     allOpt.selected = true;
    //     filtersKeys[dropdown.id] = ['0'];
    //     return;

    // }
    // if (!isAllPicked(newSelectedOptions) && isAllPicked(currentOptions)) {

    //     const allOpt = getOptionAllValue(dropdown);
    //     allOpt.selected = false;
    //     filtersKeys[dropdown.id] = newSelectedOptions;
    //     return;

    // }
    // if (!isAllPicked(newSelectedOptions) && !isAllPicked(currentOptions)) {
    //     filtersKeys[dropdown.id] = newSelectedOptions;
    //     return;
    // }

}

const genericChangeDropdowbs = () => {

    const filterObj = {};
    $('.dropdownFilter').each(function () {

        const filterField = $(this).data('filter');
        filterObj[filterField] = [];
        let opt = $(this.selectedOptions);
        opt.each(function () {
            filterObj[filterField].push(this.value);
        });
    });
    const filters = Object.keys(filterObj).includes('undefined') ? {} : filterObj;

    return filters;

}
const genericGetGraphData = async (url) => {
    const filters = await genericChangeDropdowbs();
    return await postData(url, filters);
}

const getMonth = async () => {
    const urls = window.location.origin;
    const url = `/api/graphs/Month`;
    return getRequestData(url);
}

const getScenario = async () => {
    const url = `/api/graphs/Scenario`;
    return getRequestData(url);
}

async function fillDropdownsAggregates() {
    const accNumbers = await getAccNumbers();

    const congestionZones = await getCongestionZones();

    const wholeSales = await getWholeSales();
    // const fillCurrentDropdown = (dropdownItems, itemValueName, dropdownID, itemIdName = "id") => {

    fillCurrentDropdown(accNumbers, 'accNumber', '#FilterAccNumber');
    fillCurrentDropdown(congestionZones, 'zone', '#FilterCongestionZone');
    fillCurrentDropdown(wholeSales, 'block', '#FilterWholeSales');

}


var shortMonths;
var shortScenarios;

var shortBlocks;
async function genericFillDropdowns() {
    shortMonths = (await getMonth()).map(m => m.shortName);
    shortScenarios = (await getScenario()).map(el => el.name);

    shortBlocks = (await getWholeSales()).map(el => el.block);
    const accNumbers = await getAccNumbers();

    const congestionZones = await getCongestionZones();

    const wholeSales = await getWholeSales();
    // const fillCurrentDropdown = (dropdownItems, itemValueName, dropdownID, itemIdName = "id") => {

    const scenarios = await getScenario();

    const monthes = await getMonth();

    const counterparties = await getCounterparties();

    const hours = await (new Array(25)).fill(0).map((el, ind) => ({
        value: ind,
        id: ind
    }));


    fillCurrentDropdown(accNumbers, 'accNumber', '#FilterAccNumber');
    fillCurrentDropdown(monthes, 'name', '#FilterMonth');
    fillCurrentDropdown(congestionZones, 'zone', '#FilterCongestionZone');
    fillCurrentDropdown(wholeSales, 'block', '#FilterWholeSales');
    fillCurrentDropdown(scenarios, 'name', '#FilterScenario');
    fillCurrentDropdown(hours, 'value', '#FilterHours');
    fillCurrentDropdown(counterparties, 'counterparty', "#FilterCounterparty");

    addDataAttributesToFilters();

}

async function fillDropdownsMonthly() {
    const accNumbers = await getAccNumbers();

    const wholeSales = await getWholeSales();

    const monthes = (await getMonth()).slice(1);

    const scenarios = await getScenario();
    //const [accNumbers, wholeSales, monthes, scenarios] = await Promise.all([getAccNumbers(), getWholeSales(), getMonth(), getScenario()]);

    const monthDropdown = document.querySelector('#FilterMonth');


    const scenatioDropdown = document.querySelector('#FilterScenario');


    const accNumberDropdown = document.querySelector('#FilterAccNumber');


    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');

    for (const month of monthes) {
        const index = monthes.indexOf(month);
        monthDropdown.innerHTML += getSelectOption(month.name, index);
    }

    for (const scenario of scenarios) {
        const index = scenarios.indexOf(scenario) + 1;
        scenatioDropdown.innerHTML += getSelectOption(scenario.name, index);
    }

    for (const number of accNumbers) {
        const index = accNumbers.indexOf(number) + 1;
        accNumberDropdown.innerHTML += getSelectOption(number.accNumber, index);
    }

    for (const block of wholeSales) {
        const index = wholeSales.indexOf(block) + 1;
        wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);
    }
    // setStartedDropdownValue([monthDropdown, scenatioDropdown, accNumberDropdown, wholeSalesDropdown]);
    $(monthDropdown).multiselect({
        selectAll: true
    });
    $(scenatioDropdown).multiselect({
        selectAll: true
    });

    $(accNumberDropdown).multiselect({
        selectAll: true
    });
    $(wholeSalesDropdown).multiselect({
        selectAll: true
    });
}

const getGraphUrl = () => {}
const getGraphDiv = (graphUrl) => {}

function SetCurrentGraph() {

    const graphs = document.querySelectorAll('#navCont > div');
    const graphName = window.location.pathname.split('/')[2];
    const graphIndex = graphsNames.indexOf(graphName.toLowerCase()) + 1;
    graphs[graphIndex].setAttribute('id', 'selected');
}
async function DrawHorizontalGraphsNav() {
    let wrapper = document.querySelector('.sub-nav');
    let html = `
                    <div id="navCont">
                    <div>Graphs</div>
                    <div><a href="Monthly">  Standard Graphs</a></div>
                    <div><a href="HourlyScalar">  Hourly Shapes</a></div>
                    <div><a href="Risk">  Volumetric Risk</a></div>
                    <div><a href="WeatherHourly">  Weather Scenario</a></div>
                    <div><a href="ScatterPlot">  Scatter Plot</a></div>
                    <div><a href="Ercot">  Ercot Load Animation</a></div>
                    <div><a href="Peak">  Peak Model</a></div>`;
    wrapper.innerHTML = html;
    SetCurrentGraph();
}
const getSelectedIndexesArray = (dropdown) => {
    const options = [...dropdown.selectedOptions].map(opt => opt.value);
    return options;
}
const getMonthlyPositionDetailFilters = () => {
    const booksDrop = document.getElementById('Books');
    const linesDrop = document.getElementById('Lines');
    const zonesDrop = document.getElementById('Zones');


    const ZonesID = getSelectedIndexesArray(zonesDrop);
    const LinesOfBussinesID = getSelectedIndexesArray(linesDrop)
    const BooksID = getSelectedIndexesArray(booksDrop);

    if (!$('#StartDate').datepicker('getDate')) {
        $('#StartDate').datepicker('setDate', '12/31/2019');

    }
    if (!$('#EndDate').datepicker('getDate')) {
        $('#EndDate').datepicker('setDate', '12/31/2020')
    }

    const StartDate = $('#StartDate').datepicker('getDate');
    const EndDate = $('#EndDate').datepicker('getDate');

    return {
        ZonesID,
        BooksID,
        LinesOfBussinesID,
        StartDate,
        EndDate

    }
}
// // } public string[] ZonesID { get; set; }
// public string[] LinesOfBussinesID { get; set; }
// public string[] BooksID { get; set; }
// public DateTime? StartDate { get; set; }
// public DateTime? EndDate { get; set; }
const fillMonthlyPositionDetailDropdowns = async (changeFunction) => {
    const books = await getRequestData('/api/graphs/Books');
    const lines = await getRequestData('/api/graphs/Lines');
    const zones = await getCongestionZones();

    positionBooks = books;
    const booksDrop = document.getElementById('Books');
    const linesDrop = document.getElementById('Lines');
    const zonesDrop = document.getElementById('Zones');

    for (const book of books) {
        booksDrop.innerHTML += getSelectOption(book.book, book.id);
    }

    for (const line of lines) {
        linesDrop.innerHTML += getSelectOption(line.line, line.id);
    }

    for (const zone of zones) {
        zonesDrop.innerHTML += getSelectOption(zone.zone, zone.id);
    }

    $(booksDrop).multiselect({
        selectAll: true,
    })

    $(linesDrop).multiselect({
        selectAll: true,
    })
    $(zonesDrop).multiselect({
        selectAll: true,
    })
    $(booksDrop).change(changeFunction);
    $(linesDrop).change(changeFunction);
    $(zonesDrop).change(changeFunction);
    $('#StartDate').datepicker({
        onSelect: changeFunction,
    });
    $('#StartDate').datepicker('setDate', '12/31/2019');

    $('#EndDate').datepicker({
        onSelect: changeFunction,
    });
    $('#EndDate').datepicker('setDate', '12/31/2020')



}


async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    });
    return response.json();
    //.then(response => response.json()); // парсит JSON ответ в Javascript объект
}


async function getFilters(d) {

}

//wholeSaleBlocksID
//he 
//ubar