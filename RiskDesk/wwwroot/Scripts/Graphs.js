//google.charts.load('current', { 'packages': ['corechart'] });

//google.charts.load('current', { packages: ['table'] });
//google.charts.setOnLoadCallback(draw);

//function draw() {
//    fillDropdowns();
//    drawGraphs();

//}
//function drawChart1(arr) {

    
//    var data = google.visualization.arrayToDataTable([
//        ['Task', 'Hours per Day'],
//        ...arr,
//    ]);

//    var options = {
//        width: 400,
//        height: 400,
//        pieSliceText: 'label',
//        title: 'Usage by Congestion Zone'
//    };

//    var chart = new google.visualization.PieChart(document.getElementById('graph1'));

//    chart.draw(data, options);
//}

//function drawTable1(arr) {
//    const mapArr = arr.map(el => [el[0], { v: el[1] }]);
//    let all = 0;
//    for (const el of arr) {
//        all += el[1];
//    }
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'Zone');
//    data.addColumn('number', 'Usage(MWH)');
//    data.addRows([
//        ...mapArr,
//        ['All', { v: all }]
//    ]);

//    var table = new google.visualization.Table(document.getElementById('table1'));

//    table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
//}

//function drawChart2(arr) {

//    var data = google.visualization.arrayToDataTable([
//        ['Task', 'Hours per Day'],
//        ...arr
//    ]);

//    var options = {
//        width: 400,
//        height: 400,
//        pieSliceText: 'label',
//        title: 'Usage by AccountID'
//    };

//    var chart = new google.visualization.PieChart(document.getElementById('graph2'));

//    chart.draw(data, options);
//}

//function drawTable2(arr) {
//    const mapArr = arr.map(el => [el[0], { v: el[1] }]);
//    let all = 0;
//    for (const el of arr) {
//        all += el[1];
//    }
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'Utility Account Number');
//    data.addColumn('number', 'Usage(MWH)');
//    data.addRows([
//        ...mapArr,
//        ['All', { v: all }]
//    ]);

//    var table = new google.visualization.Table(document.getElementById('table2'));

//    table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
//}

//function drawChart3(arr) {

//    var data = google.visualization.arrayToDataTable([
//        ['Task', 'Hours per Day'],
//        ...arr
//    ]);

//    var options = {
//        width: 400,
//        height: 400,
//        pieSliceText: 'label',
//        title: 'Usage by Wholesale Block'
//    };

//    var chart = new google.visualization.PieChart(document.getElementById('graph3'));

//    chart.draw(data, options);
//}

//function drawTable3(arr) {
//    const mapArr = arr.map(el => [el[0], { v: el[1] }]);
//    let all = 0;
//    for (const el of arr) {
//        all += el[1];
//    }
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'Wholesale Block');
//    data.addColumn('number', 'Usage(MWH)');
//    data.addRows([
//        ...mapArr,
//        ['All', { v: all }]
//    ]);

//    var table = new google.visualization.Table(document.getElementById('table3'));

//    table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
//}

//function drawChart4(arr) {

//    var data = google.visualization.arrayToDataTable([
//        ['Genre', 'RetailRiskAdder', 'RevatRisk', { role: 'annotation' }],
//        ...arr
//    ]);

//    var options = {
//        width: 400,
//        height: 400,
//        legend: { position: 'top', maxLines: 3 },
//        bar: { groupWidth: '75%' },
//        isStacked: true,
//        vAxis: { format: 'percent' }
//    };

//    var chart = new google.visualization.ColumnChart(document.getElementById('graph4'));

//    chart.draw(data, options);
//}

//function drawTable4(arr) {
//    const a = [];
//    for (const s of arr) {
//        const zx = s.map(el => typeof el === 'number' ? { v: el, f: el + '%' } : el);
//        a.push(zx);
//    }
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'Utility Account Number');
//    data.addColumn('number', 'RetailRiskAdder');
//    data.addColumn('number', 'RevatRisk');
//    data.addRows([
//        ...a
       
//    ]);

//    var table = new google.visualization.Table(document.getElementById('table4'));

//    table.draw(data, { showRowNumber: false, width: '100%', height: '100%' });
//}

const getSelectedFields = (dropdown) => {
    let indexes = '';
    const options = [...dropdown.selectedOptions];
    for (const opt of options) indexes += opt.value === '0' ? '' : opt.value;
    return indexes.length ? indexes : '0';
}

const getFilteringString = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const zone = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[0])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[2])}`;
    return `?${zone}&${wholesale}&${accNumbers}`;
}

const getRequestData = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

const getSelectOption = (value,index) => {
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

//function changeFilter() {
//    drawGraphs();
//}

async function fillDropdowns() {

    const accNumbers = await getAccNumbers();

    const congestionZones = await getCongestionZones();

    const wholeSales = await getWholeSales();

    const accNumberDropdown = document.querySelector('#FilterAccNumber');

    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');

    const congestionZonesDropdown = document.querySelector('#FilterCongestionZone');

    for (const number of accNumbers) {
        const index = accNumbers.indexOf(number) + 1;
        accNumberDropdown.innerHTML += getSelectOption(number.accNumber,index);
    }

    for (const block of wholeSales) {
        const index = wholeSales.indexOf(block) + 1;
        wholeSalesDropdown.innerHTML += getSelectOption(block.block,index);
    }

    for (const zone of congestionZones) {
        const index = congestionZones.indexOf(zone) + 1;
        congestionZonesDropdown.innerHTML += getSelectOption(zone.zone,index);
    }

}

//const getDataCongestionGraph = async () => {
//    const url = `/api/graphs/CongestionZonesGraphs` + getFilteringString();
//   return getRequestData(url);
//}

//const getDataAccountIDGraph = async () => {
//    const url = `/api/graphs/AccNumbersGraphs` + getFilteringString();
//    return getRequestData(url);
//}

//const getDataWholeSalesGraph = async () => {
//    const url = `/api/graphs/WholeSalesGraphs` + getFilteringString();
//    return getRequestData(url);
//}

//async function drawGraphs() {
//    const zones = await getDataCongestionGraph();
//    const numbers = await getDataAccountIDGraph();
//    const blocks = await getDataWholeSalesGraph();
//    const mapZones = await zones.map(el => [el.zone, el.percentage]);
//    const mapNumber = await numbers.map(el => [el.accNumber, el.percentage]);
//    const mapBlocks = await blocks.map(el => [el.block, el.percentage]);
//    const mapNumbersFor = await numbers.map(el => [el.accNumber, el.retailRiskAdder / 100, el.revatRisk / 100, '']);
//    const mapNumberFor1 = await numbers.map(el => [el.accNumber, el.retailRiskAdder , el.revatRisk]);
//    drawChart1(mapZones);
//    drawTable1(mapZones);
//    drawChart2(mapNumber);
//    drawTable2(mapNumber);
//    drawChart3(mapBlocks);
//    drawTable3(mapBlocks);
//    drawChart4(mapNumbersFor);
//    drawTable4(mapNumberFor1);
//}

