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
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const drawGrap = async (arr) => {

    const arrMap = shortMonths.map(el => [el, 0, 0]);

    for (const rec of arrMap) {
        for (const value of arr) {

            if (value.month == rec[0]) {
                rec[1] = value.cp;
                rec[2] = value.ncp;
            }
        }

    }
    const data = google.visualization.arrayToDataTable([
        ['Month', 'cp', 'ncp'],
        ...arrMap
    ]);

    const options = {
        width: 1500,
        height: 400,

        legend: {
            position: 'top',
            alignment: 'center'
        },
        chart: {
            title: 'Monthly Usage(KWH)',
        },
        chartArea: {
            left: 60,
        },
        backgroundColor: 'none',

        title: 'Coincident and Non Coincident Peaks (KW)',

        bar: {
            groupWidth: '90%'
        },
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, options);
}
const drawTable = async (arr) => {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Account Number');
    for (const month of shortMonths) {
        data.addColumn('number', month);
    }
    const rows = [];
    for (const value of arr) {
        const header = [value.acc];
        for (let i = 0; i < 12; i++) {
            header.push({
                v: 0,
                f: ''
            });
        }
        const cp = ['cp', ...value.cp];
        const ncp = ['ncp', ...value.ncp];
        const factor = ['Coincidence Factor', ...value.factor];

        rows.push(header);
        rows.push(cp);
        rows.push(ncp);
        rows.push(factor);
    }
    data.addRows(rows);
    //for (let i = 1; i < 13; i++) {
    //    data.addColumn('number', String(i));
    //}


    //for (let i = 0; i < rows[0].length; i++) {
    //    data.setProperties(0, i, { style: 'background-color:black; color:white; text-align:center;' });
    //    data.setProperties(1, i, { style: 'background-color:black; color:white; text-align:center;' });

    //}

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '250px'
    });
}
const changeDrops = drop => {
    changeDropdowns(drop);
    draw();
}
const fillDrops = async () => {

    const url = '/api/graphs/PeakDrops';
    const {
        months,
        scenarios,
        numbers
    } = await getRequestData(url);

    const [monthsDrop, scenarioDrop, numbersDrop] = [...document.querySelectorAll('.dropdownFilter')];

    months.slice(1).map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => monthsDrop.innerHTML += el);
    numbers.map((el, ind) => getSelectOption(el.accNumber, ind + 1)).forEach(el => numbersDrop.innerHTML += el);
    scenarios.map((el, ind) => getSelectOption(el.name, ind + 1)).forEach(el => scenarioDrop.innerHTML += el);

    $(monthsDrop).multiselect({
        selectAll: true
    });
    $(scenarioDrop).multiselect({
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
    const scenario = `Scenario=${getSelectedFields(arr[1])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[2])}`;
    return `?${month}&${scenario}&${accNumbers}`;
}
async function draw() {
    const url = `/api/graphs/Peak${getFiltering()}`;
    const {
        graphs,
        tables
    } = await getRequestData(url);
    drawGrap(graphs);
    drawTable(tables)
}
fillDrops();