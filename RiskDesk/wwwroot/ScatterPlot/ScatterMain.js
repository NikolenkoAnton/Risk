google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(changeScatterPlotDropdowns);

function drawStuff(dataRows) {
    // var button = document.getElementById('change-chart');
    var chartDiv = document.getElementById('graph1');
    // var data = new google.visualization.DataTable();
    // data.addColumn('number', 'Temperature (F)');
    // // data.addColumn('number', 'Load (KW)');
    // data.addColumn('number', '2x16');
    // data.addColumn('number', '5x16');
    // data.addColumn('number', '7x8');
    //'#118DFF'  '#E8D166'  '#573B92'
    //data.addColumn('string', '{ role: "style" }');
    //

    // data.addColumn('number', '7X24');
    // data.addColumn('number', '7X8');

    var data = google.visualization.arrayToDataTable([
        ['Temperature (F)', ...shortBlocks],
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

        },
        vAxis: {
            title: 'Load KW',

        },
        // series: {
        //     0: {
        //         axis: 'load (KW)'
        //     },
        //     1: {
        //         axis: 'temperature (F)'
        //     }
        // },
        // axes: {
        //     y: {
        //         'load (KW)': {
        //             label: 'Load (KW)',
        //         },
        //     },
        //     x: {
        //         'temperature (F)': {
        //             label: 'Temperature (F)',
        //         }
        //     }
        // },
        backgroundColor: 'none',
        legend: {
            position: 'left',
            textStyle: {
                fontSize: 16
            }
        },
        colors: ['#118DFF', '#E8D166', '#573B92', '#000'],
    };



    function drawMaterialChart() {
        var materialChart = new google.charts.Scatter(chartDiv);
        materialChart.draw(data, google.charts.Scatter.convertOptions(materialOptions));
        // button.innerText = 'Change to Classic';
        // button.onclick = drawClassicChart;
    }


    drawMaterialChart();
};

//string Hours, string Month, string Scenario, string WholeSales, string AccNumbers)


const procesGraphsDataBeforeDrawc = (data) => {
    const tempsArr = new Set(data.map(el => el.tempF));
    const mapData = data.map(el => ({
        block: el.wholeSaleBlocks,
        temp: el.tempF,
        KW: Math.round(el.loadKW),
    }));

    const graphRows = [];

    for (const t of tempsArr) {
        const row = [t, ...'0'.repeat(shortBlocks.length).split('').map(el => +el)];
        for (const blocks of mapData) {

            if (blocks.temp === t) {
                const blockIndex = shortBlocks.indexOf(blocks.block) + 1;
                row[blockIndex] = blocks.KW;
            }

        }
        graphRows.push(row);

    }
    return graphRows;

}

async function changeScatterPlotDropdowns() {
    const data = await genericGetGraphData('/api/graphs/ScatterPlot');
    const graphRows = await procesGraphsDataBeforeDrawc(data);
    debugger;
    drawStuff(graphRows);
}
//WholeSale Block
//Weather Scenario
//ID
//Months
//Hours

//wholeSaleBlocks
//tempF
//loadKW