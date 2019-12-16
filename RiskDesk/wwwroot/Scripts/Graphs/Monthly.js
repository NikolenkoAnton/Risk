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
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const changeMontlyChartDropdowns = async dropdown => {
    // const obj = genericChangeDropdowbs(); //changeDropdowns(dropdown);
    const obj = genericChangeDropdowbs(); //changeDropdowns(dropdown);

    const data1 = await postData(`/api/graphs/MonthlyGraphs`, obj);

    drawMonthlyGraph();
}
const processDataRows = async (data, blocks, months) => {
    const rows = [];
    for (const m of months) {
        const row = (new Array(blocks.length + 1)).fill(0, 1);
        row[0] = m;
        for (const b of data) {
            if (b.monthsShortName === m) {
                const index = blocks.indexOf(b.wholeSaleBlocks);
                row[index + 1] = b.ubarmwh;
            }
        }
        rows.push(row);
    }
    return rows;
}

const drawChartMonthlyChart = async (data, blocks, months) => {

    const rows = await processDataRows(data, blocks, months);
    var data = google.visualization.arrayToDataTable([
        ['WholeSale Blocks', ...blocks],
        ...rows
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
            groupWidth: '90%'
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


const addStyleToTableCell = (data, blocks) => {

    for (let i = 0; i < blocks.length; i++) {
        data.setProperties(i, 13, {
            style: 'font-weight:bold;'
        });
    }

    for (let i = 1; i < 14; i++) {
        data.setProperties(blocks.length, i, {
            style: 'font-weight:bold;'
        });
    }
}

//row.slice(1,-1).reduce((acc,el)=>acc+el)
const getTotalRow = (row) => {
    return row.slice(1, -1).reduce((acc, el) => acc + el);
}
const getHorizontalTotalRow = (rows) => {

    const totalRow = (new Array(14)).fill(0, 1);
    totalRow[0] = "Total";
    for (let i = 0; i < 13; i++) {
        let sum = 0;
        for (const r of rows) {
            sum += r[i + 1];
        }
        totalRow[i + 1] = sum;
    }
    return totalRow;


}
// const getTotalColumn
const drawTableMonthlyChart = (tableData, blocks, months) => {

    const data = new google.visualization.DataTable();
    addColumns(data);
    const arr = [...blocks, 'Total'];
    const rows = [];
    for (const b of blocks) {
        const row = (new Array(14)).fill(0, 1);
        row[0] = b;

        for (const m of shortMonths) {
            for (const rec of tableData) {
                if (rec.monthsShortName === m && rec.wholeSaleBlocks === b) {
                    const index = shortMonths.indexOf(m) + 1;
                    row[index] = rec.ubarmwh;
                }
            }
        }
        // row.slice(1).reduce()
        row[row.length - 1] = getTotalRow(row);
        rows.push(row);

    }
    const totalRow = getHorizontalTotalRow(rows);

    rows.push(totalRow);

    data.addRows(rows);
    addStyleToTableCell(data, blocks);
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



const getGraphAndTableData = () => {
    const filters = genericChangeDropdowbs();
    const url = `/api/graphs/MonthlyGraphs`;
    const f = Object.keys(filters).includes('undefined') ? {} : filters;
    return postData(url, f);
}
async function drawMonthlyGraph() {


    const {
        data,
        selectedBlocks,
        selectedMonths
    } = await getGraphAndTableData();

    drawChartMonthlyChart(data, selectedBlocks, selectedMonths);


    drawTableMonthlyChart(data, selectedBlocks, selectedMonths);

}