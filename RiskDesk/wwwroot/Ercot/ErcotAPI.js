async function getRequestData(url) {

    const response = await fetch(url);
    return response.json();
}

const getGraphData = () => {
    const url = `/api/graphs/Ercot` + getQueryParam(); //hours ,Month,  Scenario, WholeSales, AccNumbers
    return getRequestData(url);
}

const getQueryParam = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')]; // month scenario wholeSales AccNumber Hours

    const hours = `Hours=${getSelectedFields(arr[4])}`;
    const month = `Month=${getSelectedMonths(arr[0])}`;
    const zones = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${hours}&${month}&${zones}&${wholesale}&${accNumbers}`;
}