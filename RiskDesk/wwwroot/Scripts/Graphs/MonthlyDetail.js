google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.load('current', {
    'packages': ['bar']
});


const mapDataForGraph = data => {

}

const mapDataForTable = data => {

}

async function changeMontlyDetail() {

}

function drawMonthlyDetailChart(data) {

    var options = {
        width: $(window).width() - 150,
        height: 600,
        legend: {
            position: 'top',
            maxLines: 3
        },
        chart: {
            title: 'Monthly Usage(KWH)',
        },
        title: 'Monthly Usage(KWH)',
        hAxis: {
            format: '#'
        },
        // backgroundColor: {
        //     stroke: 'black',
        //     strokeWidth: 5
        // },
        backgroundColor: 'none',
        bar: {
            groupWidth: '90%'
        },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawMonthlyDetailTable(data) {
    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: $(window).width() - 150 + 'px',
        height: '100%'
    });
}

async function draw() {

    const filters = getMonthlyPositionDetailFilters();
    const data = await postData('/api/Graphs/MonthlyDetail', filters);
    const graphData = await mapDataForGraph(data);
    const tableData = await mapDataForTable(table);
    drawMonthlyDetailChart(graphData);
    drawMonthlyDetailTable(tableData);

    alertify.success('Finished processing');
}