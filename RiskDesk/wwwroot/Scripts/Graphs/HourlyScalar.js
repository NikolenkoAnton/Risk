google.charts.load('current', {
    'packages': ['bar']
});
google.charts.load("current", {
    packages: ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.setOnLoadCallback(drawHourlyScalar);
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
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
const changeMontlyChartDropdowns = dropdown => {
    changeDropdowns(dropdown);
    drawHourlyScalar();
}

const getFiltering = () => {
    const arr = [...document.querySelectorAll('.dropdownFilter')];
    const month = `Month=${getSelectedMonths(arr[0])}`;
    const zone = `Zone=${getSelectedFields(arr[1])}`;
    const wholesale = `WholeSales=${getSelectedFields(arr[2])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[3])}`;
    return `?${month}&${zone}&${wholesale}&${accNumbers}`;
}

const getGraphicData = async () => {

    const filters = genericChangeDropdowbs();
    const url = `/api/graphs/HourlyScalar`;
    const f = Object.keys(filters).includes('undefined') ? {} : filters;
    return postData(url, f);

}

const mapDataToChart = (data) => {
    const rows = [];
    for (let i = 1; i < 25; i++) {
        const row = [String(i), 0, 0, 0];
        rows.push(row);
    }
    for (const rec of data) {

        const hour = +rec.hour;
        const block = +rec.wholeSaleID;
        const ubar = rec.ubar;

        const curRow = rows[hour - 1];
        curRow[block] = ubar;

    }
    return rows;
}
const mapDataToTable = (data) => {

}
const drawChart = data => {
    var data = google.visualization.arrayToDataTable([
        ['WholeSales Blocks', '2x16', '5x16', '7x8'],
        ...mapDataToChart(data)
    ]);

    var options = {
        height: 400,
        width: 2000,

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
        title: 'Monthly Usage(KWH)',
        backgroundColor: 'none',

        bar: {
            groupWidth: '90%'
        },
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, options);
}

const maps = row => {
    for (let i = 1; i < 26; i++) {
        row[i] = 0;
    }
}
const getTotal = arr => {
    let sum = 0;

    for (const a of arr) {
        if (typeof a === 'number') sum += a;
    }
    return sum;

}

const addTotal = (row) => {
    console.log(row);
    row[25] = getTotal(row);
    console.log(row);

}
const addTableRows = (values, data) => {
    console.log("THIS");
    const frstRow = ['2x16'];
    maps(frstRow);

    const ubarRow = ['ubar'];
    maps(ubarRow);
    const sigmauRow = ['sigmau'];

    maps(sigmauRow);

    const ubarRow1 = ['ubar'];
    maps(ubarRow1);
    const sigmauRow1 = ['sigmau'];

    maps(sigmauRow1);

    const ubarRow2 = ['ubar'];
    maps(ubarRow2);
    const sigmauRow2 = ['sigmau'];

    maps(sigmauRow2);

    const sec = ['5x16'];

    maps(sec);
    const third = ['7x8'];
    maps(third);

    addTotal(ubarRow);
    addTotal(sigmauRow);
    addTotal(ubarRow1);
    addTotal(sigmauRow1);
    addTotal(ubarRow2);
    addTotal(sigmauRow2);

    const totalUbar = ['ubar'];
    const totalsigmau = ['sigmau'];

    for (const rec of values) {

        const hour = +rec.hour;
        const block = +rec.wholeSaleID;
        const ubar = rec.ubar;
        const sigmau = rec.sigmau;

        if (block === 1) {
            ubarRow[hour] = ubar;
            sigmauRow[hour] = sigmau;
        }
        if (block === 2) {
            ubarRow1[hour] = ubar;
            sigmauRow1[hour] = sigmau;
        }
        if (block === 3) {
            ubarRow2[hour] = ubar;
            sigmauRow2[hour] = sigmau;
        }
    }
    for (let i = 1; i < 26; i++) {
        const ubar = ubarRow[i] + ubarRow1[i] + ubarRow2[i];
        const sigmau = sigmauRow[i] + sigmauRow1[i] + sigmauRow2[i];
        totalUbar[i] = ubar;
        totalsigmau[i] = sigmau;

    }

    console.log(frstRow);
    addTotal(frstRow);
    console.log(frstRow);

    addTotal(ubarRow);
    addTotal(sigmauRow);
    addTotal(sec);
    addTotal(ubarRow1);
    addTotal(sigmauRow1);
    addTotal(third);
    addTotal(ubarRow2);
    addTotal(sigmauRow2);
    addTotal(totalUbar);
    addTotal(totalsigmau);
    data.addRows([
        frstRow,
        ubarRow,
        sigmauRow,
        sec,
        ubarRow1,
        sigmauRow1,
        third,
        ubarRow2,
        sigmauRow2,
        totalUbar,
        totalsigmau
    ])


}

/*background-color: black;
    color: white;
    text-align: right;*/

const addStyleToTableCell = data => {
    for (let i = 0; i < 26; i++) {
        data.setProperties(0, i, {
            style: 'background-color:black; color:white; text-align:center;'
        });
        data.setProperties(9, i, {
            style: 'background-color:black; color:white; text-align:center;'
        });
        data.setProperties(10, i, {
            style: 'background-color:black; color:white; text-align:center;'
        });

    }
    for (let i = 1; i < 11; i++) {
        data.setProperties(i, 0, {
            style: 'background-color:black; color:white; text-align:center;'
        });
        data.setProperties(i, 25, {
            style: 'background-color:black; color:white; text-align:center;'
        });
        if (i !== 0 && i !== 3 && i !== 6) {
            data.setProperties(i, 0, {
                style: 'background-color:black; color:white; text-align:right;'
            });
        }
    }


}
const drawTable = arr => {

    const data = new google.visualization.DataTable();

    data.addColumn('string', 'WholeSales Block');
    for (let i = 1; i < 25; i++) {
        data.addColumn('number', String(i));
    }
    data.addColumn('number', 'Total');

    addTableRows(arr, data);
    addStyleToTableCell(data);
    data.setProperty(1, 0, "font-weight", "bold");

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '100%'
    });
}





async function drawHourlyScalar() {
    const data = await getGraphicData();
    drawChart(data);
    drawTable(data);

}