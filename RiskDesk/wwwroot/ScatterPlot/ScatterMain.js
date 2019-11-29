google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(changeScatterPlotDropdowns);
const blocksNames = ['2x16', '5x16', '7x8'];

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
                color: 'blue',
                // color: ['118DFF', 'E8D166'],
                fontSize: 16
            }
        },
        colors: ['#118DFF', '#E8D166', '#573B92'],
    };

    // var classicOptions = {
    //     width: 800,
    //     chart: {
    //         title: 'Students\' Final Grades',
    //         subtitle: 'based on hours studied'
    //     },
    //     hAxis: {
    //         title: 'Temperature '
    //     },
    //     vAxis: {
    //         title: 'Grade'
    //     }
    // };

    function drawMaterialChart() {
        var materialChart = new google.charts.Scatter(chartDiv);
        materialChart.draw(data, google.charts.Scatter.convertOptions(materialOptions));
        // button.innerText = 'Change to Classic';
        // button.onclick = drawClassicChart;
    }

    // function drawClassicChart() {
    //     var classicChart = new google.visualization.ScatterChart(chartDiv);
    //     classicChart.draw(data, classicOptions);
    //     // button.innerText = 'Change to Material';
    //     // button.onclick = drawMaterialChart;
    // }

    drawMaterialChart();
};

//string Hours, string Month, string Scenario, string WholeSales, string AccNumbers)
const getFilteringScatterPlot = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')]; // month scenario wholeSales AccNumber Hours

    const hours = `Hours=${getSelectedHours(arr[4])}`;
    const month = `Month=${getSelectedMonths(arr[0])}`;
    // const scenario = `Scenario=${getSelectedFields(arr[1])}`;
    const zones = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${hours}&${month}&${zones}&${wholesale}&${accNumbers}`;
}

async function fillHours() {
    const hoursDropdown = document.querySelector('#FilterHours');
    for (let i = 0; i < 24; i++) {
        const index = i + 1;
        hoursDropdown.innerHTML += getSelectOption(index, index);
    }
    $(hoursDropdown).multiselect({
        selectAll: true
    });
}
async function fillMonth() {
    const monthes = (await getMonth()).slice(1);
    const monthDropdown = document.querySelector('#FilterMonth');
    console.log(monthes);
    for (const month of monthes) {
        const index = monthes.indexOf(month);
        monthDropdown.innerHTML += getSelectOption(month.name, index);

    }
    $(monthDropdown).multiselect({
        selectAll: true
    });

}
async function fillCongestionZone() {
    const congestionZones = await getCongestionZones();
    const congestionZonesDropdown = document.querySelector('#FilterCongestionZone');

    for (const zone of congestionZones) {
        const index = congestionZones.indexOf(zone) + 1;
        congestionZonesDropdown.innerHTML += getSelectOption(zone.zone, index);
    }
    $(congestionZonesDropdown).multiselect({

        selectAll: true

    });

}
async function fillWholeSales() {
    const wholeSales = await getWholeSales();

    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');
    for (const block of wholeSales) {

        const index = wholeSales.indexOf(block) + 1;

        wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);

    }
    $(wholeSalesDropdown).multiselect({

        selectAll: true

    });

}
async function fillAccNumbers() {
    const accNumbers = await getAccNumbers();

    const accNumberDropdown = document.querySelector('#FilterAccNumber');
    for (const number of accNumbers) {

        const index = accNumbers.indexOf(number) + 1;

        accNumberDropdown.innerHTML += getSelectOption(number.accNumber, index);

    }
    $(accNumberDropdown).multiselect({

        selectAll: true

    });
}

function fillScatterPlotDropdowns() {

    fillHours()
    fillMonth()
    fillCongestionZone()
    fillWholeSales()
    fillAccNumbers()
}
const procesGraphsDataBeforeDrawc = (data) => {
    const tempsArr = new Set(data.map(el => el.tempF));
    const mapData = data.map(el => ({
        block: el.wholeSaleBlocks,
        temp: el.tempF,
        KW: Math.round(el.loadKW),
    }));

    const graphRows = [];

    for (const t of tempsArr) {
        const row = [t, 0, 0, 0];
        for (const blocks of mapData) {

            if (blocks.temp === t) {
                const blockIndex = blocksNames.indexOf(blocks.block) + 1;
                row[blockIndex] = blocks.KW;
            }

        }
        graphRows.push(row);

    }
    return graphRows;

}

async function changeScatterPlotDropdowns() {
    const data = await getGraphData();
    const graphRows = await procesGraphsDataBeforeDrawc(data);
    drawStuff(graphRows);
    console.log(data);
}
//WholeSale Block
//Weather Scenario
//ID
//Months
//Hours

//wholeSaleBlocks
//tempF
//loadKW 