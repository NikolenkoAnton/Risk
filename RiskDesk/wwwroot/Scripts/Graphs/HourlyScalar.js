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

let wholesalesBlocks;
getWholeSales().then(resp => wholesalesBlocks = resp.map(el => el.block));
const changeMontlyChartDropdowns = dropdown => {
    changeDropdowns(dropdown);
    drawHourlyScalar();
}



const getGraphicData = async () => {

    const filters = genericChangeDropdowbs();
    const url = `/api/graphs/HourlyScalar`;
    const f = Object.keys(filters).includes('undefined') ? {} : filters;
    return postData(url, f);

}

const mapDataToChart = (data) => {

    //wholeSaleBlocksID
    //he 
    //ubar
    const rows = [];
    for (let i = 1; i < 25; i++) {
        const row = [String(i), 0, 0, 0, 0];
        rows.push(row);
    }
    for (const rec of data) {

        const hour = rec.he;
        const block = rec.wholeSaleBlocksID;
        const ubar = Math.round(rec.ubar * 100) / 100;

        const curRow = rows[hour - 1];
        curRow[block] = ubar;

    }
    return rows;
}
const mapDataToTable = (data) => {

}
const drawChart = async data => {
    const blocks = (await getWholeSales()).map(el => el.block);
    const blocks1 = await blocks.map(el => el.block);
    const rows = await mapDataToChart(data);
    var data = google.visualization.arrayToDataTable([
        ['WholeSale Blocks', ...blocks],
        ...rows
    ]);

    var options = {
        height: 400,
        width: $(window).width() - 150,

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
    row[25] = getTotal(row);

}
const addTableRows = (values, data) => {

    const rows = [];
    shortBlocks;
    for (const b of wholesalesBlocks) {
        const row = [b];
        const ubarRow = ['ubar'];
        const sgmRow = ['sigmau'];
        maps(ubarRow);
        maps(sgmRow);
        rows.push(row);
        rows.push(ubarRow);
        rows.push(sgmRow);
    }
    //ind 0 - rows 0,1,2
    //ind 1 - rows 3,4,5
    //ind 2 - rows 6,7,8
    for (const rec of values) {
        const ind = rec.wholeSaleBlocksID - 1;
        const ubar = Math.round(rec.ubar * 100) / 100;
        const sigmau = Math.round(rec.sigmau * 100) / 100;
        const h = rec.he;
        const rowInd = ind * 3;
        const ubInd = ind * 3 + 1;
        const sgmInd = ind * 3 + 2;
        rows[ubInd][h] = ubar;
        rows[sgmInd][h] = sigmau;
    }
    const totalUb = ['Total'];
    // const totalSg = ['sigmau'];
    maps(totalUb);

    for (let i = 1; i < 26; i++) {
        let sum = 0;
        for (let row of rows) {
            let num = row[i];

            if (num && !Number.isNaN(Number(num))) {
                sum += num;
            }
        }
        totalUb[i] = sum;
    }
    // maps(totalSg);
    rows.push(totalUb);




    // rows.push(totalSg);
    console.log(rows);


    // for (let i = 1; i < 26; i++) {
    //     const totalUbarRow = rows[rows.length - 2];
    //     const totalSigmauRow = rows[rows.length - 1];
    //     let ubarSum = 0;
    //     let sigmauSum = 0;
    //     for (let j = 0; j < wholesalesBlocks.length; j++) {
    //         const ubRow = rows[j * 3 + 1];
    //         const sgRow = rows[j * 3 + 2];
    //         ubarSum += ubRow[j + 1];
    //         sigmauSum += sgRow[j + 1];
    //     }
    //     totalUbarRow[i] = ubarSum;
    //     totalSigmauRow[i] = sigmauSum;

    // }
    for (const r of rows) {
        if (!wholesalesBlocks.includes(r[0]))
            addTotal(r);
        else {
            r[25] = null;
        }
    }
    console.log(rows);



    //ubar 1 4 7 10
    //sg 2 5 8 11

    // for (let i = 1; i < 26; i++) {
    //     const ubar = ubarRow[i] + ubarRow1[i] + ubarRow2[i];
    //     const sigmau = sigmauRow[i] + sigmauRow1[i] + sigmauRow2[i];
    //     totalUbar[i] = ubar;
    //     totalsigmau[i] = sigmau;

    // }




    data.addRows([
        ...rows
    ]);
    addStyleToTableCell(rows, data);
    // data.addRows([
    //     frstRow,
    //     ubarRow,
    //     sigmauRow,
    //     sec,
    //     ubarRow1,
    //     sigmauRow1,
    //     third,
    //     ubarRow2,
    //     sigmauRow2,
    //     totalUbar,
    //     totalsigmau
    // ])


}

/*background-color: black;
    color: white;
    text-align: right;*/

const addStyleToTableCell = (rows, data) => {
    for (let i = 0; i < rows.length; i++) {
        data.setProperties(i, 0, {
            style: 'background-color:black; color:white; text-align:center;'
        });
        // data.setProperties(9, i, {
        //     style: 'background-color:black; color:white; text-align:center;'
        // });
        // data.setProperties(10, i, {
        //     style: 'background-color:black; color:white; text-align:center;'
        // });

    }
    // for (let i = 1; i < 11; i++) {
    //     data.setProperties(i, 0, {
    //         style: 'background-color:black; color:white; text-align:center;'
    //     });
    //     data.setProperties(i, 25, {
    //         style: 'background-color:black; color:white; text-align:center;'
    //     });
    //     if (i !== 0 && i !== 3 && i !== 6) {
    //         data.setProperties(i, 0, {
    //             style: 'background-color:black; color:white; text-align:right;'
    //         });
    //     }
    // }


}
const drawTable = arr => {

    const data = new google.visualization.DataTable();

    data.addColumn('string', 'WholeSales Block');
    for (let i = 1; i < 25; i++) {
        data.addColumn('number', String(i));
    }
    data.addColumn('number', 'Total');

    addTableRows(arr, data);
    // addStyleToTableCell(data);
    // data.setProperty(1, 0, "font-weight", "bold");

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: $(window).width() - 150 + 'px',
        height: '100%'
    });
}





async function drawHourlyScalar() {
    const data = await getGraphicData();
    drawChart(data);
    drawTable(data);
    alertify.success('Finished processing');

}