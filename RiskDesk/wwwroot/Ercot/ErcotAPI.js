const getGraphData = (params) => {
    params = params ? params : getQueryParam();
    const url = `/api/graphs/Ercot` + params; //hours ,Month,  Scenario, WholeSales, AccNumbers
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
const getQueryParamButMonth = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')]; // month scenario wholeSales AccNumber Hours

    const hours = `Hours=${getSelectedFields(arr[4])}`;
    const zones = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `${hours}&${zones}&${wholesale}&${accNumbers}`;
}