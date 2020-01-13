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
const getRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}

const drawGrap = async (arr) => {

    const arrMap = shortMonths.map(el => [el, 0, 0, 0]);

    for (const rec of arrMap) {
        for (const value of arr) {

            if (value.month - 1 == arrMap.indexOf(rec)) {
                rec[1] = value.frst / 100;
                rec[2] = value.scnd / 100;
                rec[3] = value.thrd / 100;
            }
        }

    }
    const data = google.visualization.arrayToDataTable([
        ['Month', '2x16', '5x16', '7x8'],
        ...arrMap
    ]);

    const options = {
        width: 1500,
        height: 400,
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
        backgroundColor: 'none',

        title: 'Average of mape',
        colors: ['01B8AA', '374649', 'FD625E'],
        vAxis: {
            format: 'percent'
        },
        bar: {
            groupWidth: '90%'
        },
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, options);
}
const changeDrops = drop => {
    changeDropdowns(drop);
    draw();
}

const handleRows = rows => {
    const records = [];

    for (let i = 0; i < rows.length / 4; i++) {
        const rec = rows.slice(4 * i, 4 * i + 4);
        records.push({
            h: rec[0],
            val1: rec[1],
            val2: rec[2],
            val3: rec[3],
        });
    }
    const headers = [];
    const mapRecords = [];
    for (const rec of records) {
        const {
            h,
            val1,
            val2,
            val3
        } = rec;

        for (let i = 1; i < 13; i++) {
            const value = (val1[i] + val2[i] + val3[i]) / 3;
            h[i] = Math.round(value * 100) / 100;
        }
        h.push(Math.round((h.slice(1).reduce((gen, el) => gen + el, 0) / 12) * 100) / 100);
        headers.push(h);
        val1.push(Math.round((val1.slice(1).reduce((gen, el) => gen + el, 0) / 12) * 100) / 100);
        val2.push(Math.round((val2.slice(1).reduce((gen, el) => gen + el, 0) / 12) * 100) / 100);
        val3.push(Math.round((val3.slice(1).reduce((gen, el) => gen + el, 0) / 12) * 100) / 100);

        mapRecords.push(h);
        mapRecords.push(val1);
        mapRecords.push(val2);
        mapRecords.push(val3);
    }
    const total = ['Total'];
    for (let i = 1; i < 14; i++) {
        let value = 0;
        for (const head of headers) {
            value += head[i];
        }
        const a = Math.round(value / headers.length * 100) / 100;
        total.push(a);
    }
    mapRecords.push(total);
    return mapRecords.map(el =>
        el.map((ell, i) => i === 0 ? ell : {
            v: ell,
            f: ell + '%'
        }));
    //=> i === 0 ? el : { v: ell, f: ell + '%' }))



}
const addFontStyleToTableCell = data => {
    data.setProperties(0, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(1, 13, {
        style: 'font-weight:bold;'
    });
    data.setProperties(2, 13, {
        style: 'font-weight:bold;'
    });
    for (let i = 0; i < 14; i++) {
        data.setProperties(3, i, {
            style: 'font-weight:bold;'
        });
    }
}
const drawTable = async (arr) => {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Account Number');
    for (const month of shortMonths) {
        data.addColumn('number', month);
    }
    data.addColumn('number', 'Total');
    const rows = [];
    for (const value of arr) {
        const header = [value.acc];
        for (let i = 0; i < 12; i++) {
            header.push(0);
        }
        //.map(el => ({ v: el, f: el + '%' }));
        const a = value.frst;
        const b = value.scnd;
        const c = value.thrd;
        const cp = ['2x16', ...a];
        const ncp = ['5x16', ...b];
        const factor = ['7x8', ...c];

        rows.push(header);
        rows.push(cp);
        rows.push(ncp);
        rows.push(factor);
    }
    const mapRows = handleRows(rows);
    data.addRows(mapRows);
    for (let j = 0; j < (mapRows.length - 1) / 4; j++) {
        for (let i = 0; i < 14; i++) {
            data.setProperties(j * 4, i, {
                style: 'font-weight:bold;'
            });
        }
    }
    for (let i = 0; i < 14; i++) {
        data.setProperties(mapRows.length - 1, i, {
            style: 'font-weight:bold;'
        });
    }
    for (let i = 0; i < mapRows.length; i++) {
        data.setProperties(i, 13, {
            style: 'font-weight:bold;'
        });
    }
    //for (let i = 1; i < 13; i++) {
    //    data.addColumn('number', String(i));
    //}


    //for (let i = 0; i < rows[0].length; i++) {
    //    data.setProperties(0, i, { style: 'background-color:black; color:white; text-align:center;' });
    //    data.setProperties(1, i, { style: 'background-color:black; color:white; text-align:center;' });

    //}

    const table = new google.visualization.Table(document.getElementById('table1'));

    table.draw(data, {
        allowHtml: true,
        showRowNumber: false,
        width: '100%',
        height: '250px'
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
    const blocks = `WholeSales=${getSelectedFields(arr[1])}`;
    const accNumbers = `AccNumbers=${getSelectedFields(arr[2])}`;
    return `?${month}&${blocks}&${accNumbers}`;
}

async function draw() {
    const url = `/api/graphs/Mape${getFiltering()}`;
    const {
        graphs,
        tables
    } = await getRequestData(url);
    drawGrap(graphs);
    drawTable(tables);
    alertify.success('Finished processing');

}