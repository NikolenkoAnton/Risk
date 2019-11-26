google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.load('current', {
    'packages': ['bar']
});
google.charts.setOnLoadCallback(drawMonthlyGraph);
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}
const changeMontlyChartDropdowns = dropdown => {
    changeDropdowns(dropdown);
    drawMonthlyGraph();
}

const drawChartMonthlyChart = async (arr) => {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const mapArr = arr.map((el, i) => [shortMonths[i], el.firstBlock, el.secondBlock, el.thirdBlock]);
    var data = google.visualization.arrayToDataTable([
        ['WholeSale Blocks', '2x16', '5x16', '7x8'],
        ...mapArr
    ]);

    var options = {
        width: $(window).width(),
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


const mapTableData = data => {
    const {
        wholeSales,
        rows
    } = data;

    wholeSales.push('Total');

    const total = rows[0][12] + rows[1][12] + rows[2][12];
    rows[3].push(total);

    return [wholeSales, rows];

}
const addColumns = (data) => {
    //const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    data.addColumn('string', 'Wholesale Block');
    for (const month of shortMonths) {
        data.addColumn('number', month);
    }
    data.addColumn('number', 'Total');
}

const mapRpws = data => {

    const arr = ['2x16', '5x16', '7x8', 'Total'];
    const asd = ['firstBlock', 'secondBlock', 'thirdBlock'];
    const totalValues = [];
    const firstValues = data.map(el => el.firstVal);
    const secondVaues = data.map(el => el.secondVal);
    const thirdValues = data.map(el => el.thirdVal);
    firstValues.push(firstValues.reduce((gen, el) => gen + el, 0));
    secondVaues.push(secondVaues.reduce((gen, el) => gen + el, 0));
    thirdValues.push(thirdValues.reduce((gen, el) => gen + el, 0));
    for (const i in firstValues) {
        let a = firstValues[i] + secondVaues[i] + thirdValues[i];
        totalValues.push(a)
    }

    return [
        [asd[0], ...firstValues],
        [asd[1], ...secondVaues],
        [asd[2], ...thirdValues],
        [asd[3], ...totalValues]
    ]
}
const addStyleToTableCell = data => {
    data.setProperties(0, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(1, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(2, 13, {
        style: 'font-weight:bold;'
    });
    for (let i = 1; i < 14; i++) {
        data.setProperties(3, i, {
            style: 'font-weight:bold;'
        });
    }
}
const drawTableMonthlyChart = (tableData) => {

    const data = new google.visualization.DataTable();
    addColumns(data);
    const arr = ['2x16', '5x16', '7x8', 'Total'];
    const asd = ['firstBlock', 'secondBlock', 'thirdBlock'];
    const totalValues = [];
    const firstValues = tableData.map(el => el.firstBlock);
    const secondVaues = tableData.map(el => el.secondBlock);
    const thirdValues = tableData.map(el => el.thirdBlock);
    firstValues.push(firstValues.reduce((gen, el) => gen + el, 0));
    secondVaues.push(secondVaues.reduce((gen, el) => gen + el, 0));
    thirdValues.push(thirdValues.reduce((gen, el) => gen + el, 0));
    for (const i in firstValues) {
        let a = firstValues[i] + secondVaues[i] + thirdValues[i];
        totalValues.push(a)
    }
    data.addRows([
        [arr[0], ...firstValues],
        [arr[1], ...secondVaues],
        [arr[2], ...thirdValues],
        [arr[3], ...totalValues]
    ]);
    addStyleToTableCell(data);
    // addFontStyleToTableCell(data);

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '100%'
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
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${month}&${zone}&${wholesale}&${accNumbers}`;
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
    fillDropdownsAggregates();
}

const getGraphAndTableData = () => {
    const url = `/api/graphs/MontlyGraphs` + getFiltering();
    return getRequestData(url);
}
async function drawMonthlyGraph() {
    const data = await getGraphAndTableData();
    drawChartMonthlyChart(data);
    drawTableMonthlyChart(data);

}