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

const drawChart = async (data) => {

    const rows = data.map(el => [el.monthsShortName, el.retailAdder, el.volriskstdevNorm]);

    var data = google.visualization.arrayToDataTable([
        ['Months', 'retailadder', 'volriskmultiplierNorm'],
        ...rows

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
        const ind = el.xMonth;

        rows[0][ind] = Math.round(el.retailAdder * 1000) / 1000
        rows[1][ind] = Math.round(el.volriskstdevNorm * 1000) / 1000;
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


async function draw() {

    const url1 = `/api/graphs/Risk`;
    const data1 = await genericGetGraphData(url1);
    drawChart(data1);
    drawTable(data1)
}