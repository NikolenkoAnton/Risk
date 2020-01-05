google.charts.load('current', {
    'packages': ['line', 'corechart']
});
google.charts.setOnLoadCallback(drawHourly);
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}
fillDropdownsWeatherMonthly();
const getDataMontlyGraphs = async () => {
    const url = `/api/graphs/WeatherMontlyGraphs` + getFilteringStringMontly();
    return getRequestData(url);
}


const drawGraphHourly = (data) => {
    const rows = data.map(el => [el.xdate, el.weatherScenario, el.TotalLoad])
    // const data = google.visualization.arrayToDataTable([
    //     ['Weather Scenario', ...shortScenarios],

    // ]);
    // const data = new google.visualization.DataTable();
    // data.addColumn()

    const data = google.visualization.arrayToDataTable([
        ['Date', 'WeatherScenario', 'Load'],
        ...data
    ]);

    const options = {
        height: 500,
        backgroundColor: 'none',
        chart: {
            title: 'Hourly Usage(KWH)',
        },
        title: 'Hourly Usage(KWH)2',
    };

    const chart = new google.charts.Bar(document.getElementById('graph1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}
const drawGraphMontly = (arr) => {
    const data = google.visualization.arrayToDataTable([
        ['Weather Scenario', 'avg', 'mild', 'xtreme'],
        ...arr
    ]);

    const options = {
        height: 500,
        width: 1205,
        backgroundColor: 'none',
        title: 'Usage by Weather Scenario',
    };

    const chart = new google.charts.Bar(document.getElementById('graph1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

const getAvgRow = (arr) => {
    const arrs = ['avg'];
    let total = 0;
    for (const record of arr) {
        total += record.avg;
        arrs.push(record.avg);
    };
    return [...arrs, total];
}

const getMildRow = (arr) => {
    const arrs = ['mild'];
    let total = 0;
    for (const record of arr) {
        total += record.mild;
        arrs.push(record.mild);
    };
    return [...arrs, total];
}

const getXtremeRow = (arr) => {
    const arrs = ['xtreme'];
    let total = 0;
    for (const record of arr) {
        total += record.xtreme;
        arrs.push(record.avg);
    };
    return [...arrs, total];
}

const getTotalRow = (a1, a2, a3) => {
    const arr = ['Total'];
    for (let i = 1; i < 14; i++) {
        const sum = a1[i] + a2[i] + a3[i];
        arr.push(sum);
    }
    return arr;
}

const addCollumnToTable = data => {
    const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    data.addColumn('string', 'Weather Type');
    for (const month of monthArr) {
        data.addColumn('number', month);
    }
    data.addColumn('number', 'Total');

}

const addFontStyleToTableCell = data => {
    data.setProperties(0, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(1, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(2, 13, {
        style: 'font-weight:bold;'
    });
    for (let i = 0; i < 14; i++) {
        data.setProperties(3, i, {
            style: 'font-weight:bold;'
        });
    }
}

const addRowsToTable = (data, arr) => {
    const avrRow = getAvgRow(arr);
    const mildRow = getMildRow(arr);
    const xtremeRow = getXtremeRow(arr);
    const totalRow = getTotalRow(avrRow, mildRow, xtremeRow);
    data.addRows([
        avrRow,
        mildRow,
        xtremeRow,
        totalRow,
    ]);
}

const drawTableMontly = (arrOfData) => {

    const data = new google.visualization.DataTable();

    addCollumnToTable(data);
    addRowsToTable(data, arrOfData);
    addFontStyleToTableCell(data);

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '100%'
    });
}

const changeMontlyDropdowns = dropdown => {
    changeDropdowns(dropdown);
    drawMonthly();
}

async function drawMonthly() {
    const data = await getDataMontlyGraphs();
    const mapData = data.map(el => [el.monthName, el.avg, el.mild, el.xtreme]);
    drawGraphMontly(mapData);
    drawTableMontly(data);
}

async function fillDropdownsWeatherMonthly() {
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
    //setStartedDropdownValue([monthDropdown, scenatioDropdown, accNumberDropdown, wholeSalesDropdown]);
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