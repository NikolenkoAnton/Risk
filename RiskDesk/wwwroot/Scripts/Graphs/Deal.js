google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.setOnLoadCallback(drawDeal);
let isDateChange = false;
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}

const changeDealDrops = (dropdown) => {
    changeDropdowns(dropdown);
    drawDeal();

}

const removeOldDateInput = (inpCnt1, inpCnt2) => {
    if (inpCnt1.children.length > 1) inpCnt1.children[1].remove();
    if (inpCnt2.children.length > 1) inpCnt2.children[1].remove();
}
const drawDateInputs = (dealMin, dealMax, min, max) => {

    if (!dealMin || !dealMax || !min) {
        return;
    }
    const inpConts = [...document.querySelectorAll('.inputDateCell')];


    let minDeal = String(dealMin).slice(0, 10).split('-').reverse();
    let maxDeal = String(dealMax).slice(0, 10).split('-').reverse();
    minDeal = minDeal[1] + '/' + minDeal[0] + '/' + minDeal[2];
    maxDeal = dealMax[1] + '/' + dealMax[0] + '/' + dealMax[2];
    // const minDeal = String(dealMin).slice(0, 10);
    // const maxDeal = String(dealMax).slice(0, 10);


    let minDate = String(min).slice(0, 10).split('-').reverse();
    let maxDate = String(max).slice(0, 10).split('-').reverse();
    minDate = minDate[1] + '/' + minDate[0] + '/' + minDate[2];
    maxDate = maxDate[1] + '/' + maxDate[0] + '/' + maxDate[2];
    // const minDate = String(min).slice(0, 10);
    // const maxDate = String(max).slice(0, 10);

    // removeOldDateInput(inpConts[0], inpConts[1]);
    // removeOldDateInput(inpConts[2], inpConts[3]);

    inpConts[0].innerHTML += `<input type="text" id="start" onchange="changeDateInput(this)">`;
    inpConts[1].innerHTML += `<input type="text" id="end" onchange="changeDateInput(this)">`;

    inpConts[2].innerHTML += `<input type="text" id="startDeal" onchange="changeDateInput(this)">`;

    inpConts[3].innerHTML += `<input type="text" id="endDeal" onchange="changeDateInput(this)">`;
    $("#start").datepicker();
    $("#start").datepicker("setDate", maxDate);
    $("#start").datepicker({
        maxDate,
        minDate
    });

    $("#end").datepicker();
    $("#end").datepicker("setDate", maxDate);
    $("#end").datepicker({
        maxDate,
        minDate
    });

    $("#startDeal").datepicker();
    $("#startDeal").datepicker("setDate", minDeal);
    $("#startDeal").datepicker({
        maxDate: maxDeal,
        minDate: minDeal
    });
    $("#endDeal").datepicker();
    $("#endDeal").datepicker("setDate", maxDeal);
    $("#endDeal").datepicker({
        maxDate: maxDeal,
        minDate: minDeal
    });

}
const changeDateInput = input => {
    isDateChange = true;
    drawDeal();
}
const getDealDateValue = () => {
    const start = document.querySelector('#start'); //.split('-').join('');
    const end = document.querySelector('#end'); //.split('-').join('');
    const startDeal = document.querySelector('#startDeal'); //.split('-').join('');
    const endDeal = document.querySelector('#endDeal');
    if (start && end && startDeal && endDeal && isDateChange) {
        const startParam = start.value.split('-').reverse().join('W');
        const endParam = end.value.split('-').reverse().join('W');
        const startDealParam = startDeal.value.split('-').reverse().join('W');
        const endDealParam = endDeal.value.split('-').reverse().join('W');
        console.log(`StartDate=${startParam}&EndDate=${endParam}&StartDeal=${startDealParam}&EndDeal=${endDealParam}`);
        console.log(`StartDate=${startParam}&EndDate=${endParam}&StartDeal=${startDealParam}&EndDeal=${endDealParam}`.split('&'));
        return `StartDate=${startParam}&EndDate=${endParam}&StartDeal=${startDealParam}&EndDeal=${endDealParam}`;

    }
    return `StartDate=0&EndDate=0&StartDeal=0&EndDeal=0`;

}
const getFilteringStringDeal = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const zone = `Zone=${getSelectedFields(arr[0])}`;
    const counter = `&Counter=${getSelectedFields(arr[1])}`;
    const wholesale = `&WholeSales=${getSelectedFields(arr[2])}`;
    console.log(`?${zone}${counter}${wholesale}`);
    console.log(`?${zone}${counter}${wholesale}`.split('&'));

    return `?${zone}${counter}${wholesale}`;
}
const fillDrops = async () => {

    const url = '/api/graphs/DealDrops';
    const {
        zones,
        blocks,
        counters
    } = await getRequestData(url);

    const [zonesDrop, countersDrop, blocksDrop] = [...document.querySelectorAll('.dropdownFilter')];

    zones.map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => zonesDrop.innerHTML += el);
    counters.map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => countersDrop.innerHTML += el);
    blocks.map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => blocksDrop.innerHTML += el);

    $(zonesDrop).multiselect({
        selectAll: true
    });
    $(countersDrop).multiselect({
        selectAll: true
    });
    $(blocksDrop).multiselect({
        selectAll: true
    });
}

function drawChart1(arr) {


    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ...arr
    ]);

    var options = {
        width: 400,
        height: 400,
        backgroundColor: 'none',
        pieSliceText: 'label',
        title: 'Gross Margin By Counterparty'
    };

    var chart = new google.visualization.BarChart(document.getElementById('graph1'));

    chart.draw(data, options);
}

function drawChart2(arr) {

    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ...arr

    ]);

    var options = {
        width: 600,
        height: 400,
        backgroundColor: 'none',
        pieSliceText: 'label',
        title: 'VolumeMWH by Shape'
    };

    var chart = new google.visualization.PieChart(document.getElementById('graph2'));

    chart.draw(data, options);
}

function drawChart3(arr) {

    var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ...arr
    ]);

    var options = {
        width: 600,
        height: 400,
        pieSliceText: 'label',
        chartArea: {
            right: 100,

        },

        backgroundColor: 'none',
        title: 'VolumeMWH by Counterparty'
    };

    var chart = new google.visualization.PieChart(document.getElementById('graph3'));

    chart.draw(data, options);
}
const addCollumnToTable = data => {
    //const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //data.addColumn('string', 'Weather Type');
    //for (const month of monthArr) {
    //  data.addColumn('number', month);
    //}
    //data.addColumn('number', 'Total');
    data.addColumn('string', 'DealID');
    data.addColumn('string', 'CounterParty');
    data.addColumn('string', 'Other CounterParty');
    data.addColumn('string', 'DealDate');
    data.addColumn('string', 'StartDate');
    data.addColumn('string', 'EndDate');
    data.addColumn('string', 'Shape');
    data.addColumn('string', 'Setpoint');
    data.addColumn('string', 'SetLocation');
    data.addColumn('number', 'VolumeMW');
    data.addColumn('number', 'Price');
    data.addColumn('number', 'Fee');
    data.addColumn('number', 'VolumeMWH');
    data.addColumn('number', 'Cost');
    data.addColumn('number', 'MTM');
    data.addColumn('number', 'GrossMargin');




}
const mapRow = row => {
    const newRow = [];
    newRow[0] = +row[2];
}
const addRowsToTable = (data, arr) => {
    const rows = [];
    for (const row of arr) {
        const newRow = row.slice(2, 18);
        newRow[0] = newRow[0] + '';
        rows.push(newRow);
    }
    data.addRows(rows);
}
const drawTableMontly = (arrOfData) => {

    const data = new google.visualization.DataTable();

    addCollumnToTable(data);
    addRowsToTable(data, arrOfData);
    //addFontStyleToTableCell(data);

    const table = new google.visualization.Table(document.getElementById('graph4'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '250px'
    });
}
async function drawDeal() {
    const str = await getFilteringStringDeal();
    const str1 = await getDealDateValue();
    const url = `/api/graphs/Deal${str}&${str1}`;
    const {
        dealMax,
        dealMin,
        max,
        min,
        graph1,
        graph2,
        graph3,
        graph4
    } = await getRequestData(url);
    drawDateInputs(dealMin, dealMax, min, max);
    drawChart1(graph4);
    drawChart2(graph2);
    drawChart3(graph3);
    drawTableMontly(graph1);
}
