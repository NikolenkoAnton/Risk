google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(changeDrops);
const blocksNames = ['2x16', '5x16', '7x8'];

function fillDropdowns() {

    fillHours()
    fillMonth()
    fillCongestionZone()
    fillWholeSales();
    fillAccNumbers();
}

async function changeDrops() {
    const data = await getGraphData();
    // const graphRows = await procesGraphsDataBeforeDrawc(data);
    drawStuff(graphRows);
}

function drawStuff(dataRows) {
    var chartDiv = document.getElementById('graph1');

    var data = google.visualization.arrayToDataTable([
        ['Temperature (F)', '2x16', '5x16', '7x8'],
        ...dataRows

    ]);
    //“118DFF”, 5x16 to be “E8D166” and the 7x8 to be “573B92”
    var materialOptions = {
        chart: {
            title: 'Load \' Temperature Scatter Plot',
        },
        width: $(window).width(),
        height: 650,
        hAxis: {
            title: 'Temperature (F)',
            minValue: 0,
            maxValue: 15
        },
        vAxis: {
            title: 'Load KW',
            minValue: 0,
            maxValue: 15
        },

        backgroundColor: 'none',
        legend: {
            position: 'left',
            textStyle: {
                color: 'blue',
                // color: ['118DFF', 'E8D166'],
                fontSize: 16
            }
        },
        colors: ['#118DFF', '#E8D166', '#573B92'],
    };
    var materialChart = new google.charts.Scatter(chartDiv);
    materialChart.draw(data, google.charts.Scatter.convertOptions(materialOptions));

};