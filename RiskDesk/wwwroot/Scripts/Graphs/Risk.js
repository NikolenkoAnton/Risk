google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(draw);
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}
const fillMonth = async () => {
    const shortMonths = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

}
const drawChart = async (arr) => {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const asd = shortMonths.map(el => [el, 0, 0]);

    for (const a of arr) {
        const i = shortMonths.indexOf(a.shortMonth);

        asd[i][1] = Number(a.adder);
        asd[i][2] = Number(a.norm);
    }
    //const mapArr = arr.map((el, i) => [shortMonths[i], el.firstBlock, el.secondBlock, el.thirdBlock]);
    var data = google.visualization.arrayToDataTable([
        ['Months', 'retailadder', 'volriskmultiplierNorm'],
        ...asd,

    ]);

    var options = {
        width: 1140,
        height: 600,
        backgroundColor: 'none',
        legend: {
            position: 'top',
            maxLines: 3
        },
        chart: {
            title: 'Volumetric Risk and Revenue at Risk (%)',
        },

        //hAxis: {
        //    format: '#'
        //},
        bar: {
            groupWidth: '61.8%'
        },
        isStacked: true,
        vAxis: {
            minValue: 0
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}
const drawTable = async (arr) => {
    const data = new google.visualization.DataTable();

    data.addColumn('string', ' ');
    for (let i = 1; i < 13; i++) {
        data.addColumn('number', String(i));
    }

    const rows = [
        ['retailadder'],
        ['volriskmultiplierNorm']
    ];

    for (let i = 1; i < 13; i++) {
        rows[0][i] = 0;
        rows[1][i] = 0;

    }
    for (const el of arr) {
        const ind = +el.month;

        rows[0][ind] = +el.adder;
        rows[1][ind] = +el.norm;
    }
    data.addRows([
        ...rows
    ]);


    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '100%'
    });
}
const changeDrops = drop => {
    changeDropdowns(drop);
    draw();
}
const fillDrops = async () => {

    const url = '/api/graphs/RiskDrops';
    const {
        months,
        zones,
        numbers
    } = await getRequestData(url);

    const [monthsDrop, zonesDrop, numbersDrop] = [...document.querySelectorAll('.dropdownFilter')];

    months.slice(1).map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => monthsDrop.innerHTML += el);
    numbers.map((el, ind) => getSelectOption(el.accNumber, el.accNumberId)).forEach(el => numbersDrop.innerHTML += el);
    zones.map((el, ind) => getSelectOption(el.zone, ind + 1)).forEach(el => zonesDrop.innerHTML += el);

    $(monthsDrop).multiselect({
        selectAll: true
    });
    $(zonesDrop).multiselect({
        selectAll: true
    });
    $(numbersDrop).multiselect({
        selectAll: true
    });
}
const getSelectedMonths = (dropdown) => {
    let indexes = '';
    const options = [...dropdown.selectedOptions];
    for (const opt of options) {
        if (opt.value == '0') return '0';


        if (opt.value.length > 1) {
            if (opt.value == '10') indexes += 'O';

            if (opt.value == '11') indexes += 'N';

            if (opt.value == '11') indexes += 'D';
        } else indexes += opt.value;
    }
    return indexes.length ? indexes : '0';
}
const getFiltering = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const month = `Month=${getSelectedMonths(arr[0])}`;
    const zone = `Zone=${getSelectedFields(arr[1])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[2])}`;
    return `?${month}&${zone}&${accNumbers}`;
}
async function draw() {
    const url = `/api/graphs/Risk${getFiltering()}`;
    const data = await getRequestData(url);
    drawChart(data);
    drawTable(data)
}
