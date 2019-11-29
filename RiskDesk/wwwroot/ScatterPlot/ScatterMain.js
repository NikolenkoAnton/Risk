google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(drawStuff);

function drawStuff() {
    // var button = document.getElementById('change-chart');
    var chartDiv = document.getElementById('graph1');

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Temperature (F)');
    data.addColumn('number', '2X16');
    data.addColumn('number', '5X16');
    data.addColumn('number', '7X24');
    data.addColumn('number', '7X8');

    data.addRows([
        [0, 0, 67, 2, 65],
        [1, 1, 88, 2, 65],
        [2, 2, 77, 2, 65],
        [3, 3, 93, 2, 65],
        [4, 4, 85, 2, 65],
        [5, 5, 91, 2, 65],
        [6, 6, 71, 2, 65],
        [7, 7, 78, 2, 65],
        [8, 8, 93, 2, 65],
        [9, 9, 80, 2, 65],
        [10, 10, 82, 7, 89],
        [11, 0, 75, 67, 12],
        [12, 5, 80, 67, 12],
        [13, 3, 90, 67, 12],
        [14, 1, 72, 67, 12],
        [15, 5, 75, 67, 12],
        [16, 6, 68, 67, 12],
        [17, 7, 98, 67, 12],
        [18, 3, 82, 67, 12],
        [19, 9, 94, 67, 12],
        [20, 2, 79, 67, 12],
        [21, 2, 95, 67, 12],
        [22, 2, 86, 67, 12],
        [23, 3, 67, 67, 12],
        [24, 4, 60, 67, 12],
        [25, 2, 80, 67, 12],
        [26, 6, 92, 67, 12],
        [27, 2, 81, 67, 12],
        [28, 8, 79, 67, 12],
        [29, 9, 83, 67, 12]
    ]);

    var materialOptions = {
        // chart: {
        //     title: 'Students\' Final Grades',
        //     subtitle: 'based on hours studied'
        // },
        width: $(window).width() * 0.92,
        height: 600,
        series: {
            0: {
                axis: 'hours studied',
            },
            1: {
                axis: 'final grade'
            }
        },
        axes: {
            y: {
                'hours studied': {
                    label: 'Hours Studied',
                },
                'final grade': {
                    label: 'Final Exam Grade'
                }
            }
        },
        backgroundColor: 'none',

    };

    var classicOptions = {
        width: 800,
        series: {
            0: {
                targetAxisIndex: 0
            },
            1: {
                targetAxisIndex: 1
            }
        },
        title: 'Students\' Final Grades - based on hours studied',

        vAxes: {
            // Adds titles to each axis.
            0: {
                title: 'Hours Studied'
            },
            1: {
                title: 'Final Exam Grade'
            }
        }
    };

    function drawMaterialChart() {
        var materialChart = new google.charts.Scatter(chartDiv);
        materialChart.draw(data, google.charts.Scatter.convertOptions(materialOptions));
        // button.innerText = 'Change to Classic';
        // button.onclick = drawClassicChart;
    }

    function drawClassicChart() {
        var classicChart = new google.visualization.ScatterChart(chartDiv);
        classicChart.draw(data, classicOptions);
        // button.innerText = 'Change to Material';
        // button.onclick = drawMaterialChart;
    }

    drawMaterialChart();
};
//async function fillDropdownsAggregates() {
//    const accNumbers = await getAccNumbers();

//    const congestionZones = await getCongestionZones();

//    const wholeSales = await getWholeSales();

//    const accNumberDropdown = document.querySelector('#FilterAccNumber');

//    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');

//    const congestionZonesDropdown = document.querySelector('#FilterCongestionZone');

//    for (const number of accNumbers) {
//        const index = accNumbers.indexOf(number) + 1;
//        accNumberDropdown.innerHTML += getSelectOption(number.accNumber, index);
//    }

//    for (const block of wholeSales) {
//        const index = wholeSales.indexOf(block) + 1;
//        wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);
//    }

//    for (const zone of congestionZones) {
//        const index = congestionZones.indexOf(zone) + 1;
//        congestionZonesDropdown.innerHTML += getSelectOption(zone.zone, index);
//    }

//    //setStartedDropdownValue([accNumberDropdown, wholeSalesDropdown, congestionZonesDropdown]);

//    $(wholeSalesDropdown).multiselect({
//        selectAll: true
//    });
//    $(congestionZonesDropdown).multiselect({
//        selectAll: true
//    });

//    $(accNumberDropdown).multiselect({
//        selectAll: true
//    });
//}

//const getSelectedMonths = (dropdown) => {
//    let indexes = '';
//    const options = [...dropdown.selectedOptions];
//    for (const opt of options) {
//        if (opt.value == '0') return '0';


//        if (opt.value.length > 1) {
//            if (opt.value == '10') indexes += 'O';

//            if (opt.value == '11') indexes += 'N';

//            if (opt.value == '11') indexes += 'D';
//        } else indexes += opt.value;
//    }
//    return indexes.length ? indexes : '0';
//}


//string Hours, string Month, string Scenario, string WholeSales, string AccNumbers)
const getFilteringScatterPlot = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')]; // month scenario wholeSales AccNumber Hours

    const hours = `Hours=${getSelectedHours(arr[4])}`;
    const month = `Month=${getSelectedMonths(arr[0])}`;
    const scenario = `Scenario=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${hours}&${month}&${scenario}&${wholesale}&${accNumbers}`;
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
async function fillScenario() {
    const scenarios = await getScenario();
    const scenatioDropdown = document.querySelector('#FilterScenario');

    for (const scenario of scenarios) {

        const index = scenarios.indexOf(scenario) + 1;

        scenatioDropdown.innerHTML += getSelectOption(scenario.name, index);

    }
    $(scenatioDropdown).multiselect({

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
    fillScenario()
    fillWholeSales()
    fillAccNumbers()
}

async function changeScatterPlotDropdowns() {
    const data = getGraphData();
}
//WholeSale Block
//Weather Scenario
//ID
//Months
//Hours