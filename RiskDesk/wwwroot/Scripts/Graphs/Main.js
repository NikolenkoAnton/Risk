let FilterAccNumber = ['0'];
let FilterCongestionZone = ['0'];
let FilterScenario = ['0'];
let FilterMonth = ['0'];
let FilterWholeSales = ['0'];
let FilterCounterparty = ['0'];
let currentGraphs = '';

let filtersKeys = {
    FilterMonth,
    FilterScenario,
    FilterCongestionZone,
    FilterWholeSales,
    FilterAccNumber,
    FilterCounterparty,
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
//const getRequestData = async (url) => {

//    const response = await fetch(url);
//    return response.json();
//}

const setStartedDropdownValue = dropdowns => {
    for (const drop of dropdowns) {
        drop.selectedIndex = 0;
    }

};

const getSelectOption = (value, index) => {
    return ` <option value="${index}">
                            ${value}
                            </option>`
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

    const accNumberDropdown = document.querySelector('#FilterAccNumber');

    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');

    const congestionZonesDropdown = document.querySelector('#FilterCongestionZone');

    for (const number of accNumbers) {
        const index = accNumbers.indexOf(number) + 1;
        accNumberDropdown.innerHTML += getSelectOption(number.accNumber, index);
    }

    for (const block of wholeSales) {
        const index = wholeSales.indexOf(block) + 1;
        wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);
    }

    for (const zone of congestionZones) {
        const index = congestionZones.indexOf(zone) + 1;
        congestionZonesDropdown.innerHTML += getSelectOption(zone.zone, index);
    }

    //setStartedDropdownValue([accNumberDropdown, wholeSalesDropdown, congestionZonesDropdown]);

    $(wholeSalesDropdown).multiselect({
        selectAll: true
    });
    $(congestionZonesDropdown).multiselect({
        selectAll: true
    });

    $(accNumberDropdown).multiselect({
        selectAll: true
    });
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