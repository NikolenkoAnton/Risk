﻿google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(draw);
var data;
var grp;
var tbls;
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
        width: $(window).width() - 150,
        height: 400,

        legend: {
            position: 'top',
            alignment: 'center'
        },
        chart: {
            title: 'Monthly Usage(KWH)',
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
        width: $(window).width() - 150 + 'px',
        height: '250px'
    });
}
const changeDrops = drop => {
    changeDropdowns(drop);
    draw();
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
const getGraphAndTableData = () => {
    const filters = genericChangeDropdowbs();
    const url = `/api/graphs/Peak`;
    return postData(url, filters);
}
const proccesRowsForTable = (data) => {
    const rows = [];
    const accNumbers = [...new Set(data.peakAccNumbers.map(el => el.utilityAccountNumber))]
    for (const num of accNumbers) {
        const record = {
            acc: num,
            cp: (new Array(12)).fill(0),
            ncp: (new Array(12)).fill(0),
            factor: (new Array(12)).fill(0)
        };
        rows.push(record);
    }
    for (const row of rows) {
        const num = row.acc;
        for (const rec of data.peakAccNumbers) {
            if (num === rec.utilityAccountNumber) {
                const index = rec.monthsNamesID - 1;

                row.cp[index] = Math.round(rec.avgCP * 100) / 100;
                row.ncp[index] = Math.round(rec.avgNCP * 100) / 100;
                row.factor[index] = Math.round(rec.avgCoincidenceFactor * 100) / 100;
            }
        }
    }
    return rows;
}
async function draw() {
    data = await getGraphAndTableData();
    const graphs1 = await data.peakMonths
        .map(el =>
            ({
                month: el.monthsShortName,
                cp: el.avgCP,
                ncp: el.avgNCP,
            }));
    const tables1 = await proccesRowsForTable(data);
    drawGrap(graphs1);
    drawTable(tables1);
    alertify.success('Finished processing');

}