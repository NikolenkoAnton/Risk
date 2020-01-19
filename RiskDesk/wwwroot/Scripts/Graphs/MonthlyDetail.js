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

const getSelectedBooks = async () => {
    const booksDrop = document.getElementById('Books');

    const options = getSelectedIndexesArray(booksDrop);

    if (!options.length) return positionBooks;

    return positionBooks.filter(b => options.includes(b.id));

}

const mapDataForGraph = async data => {

    let selBooks = await getSelectedBooks();
    if (!selBooks) {
        selBooks = await getRequestData('/api/graphs/Books');
    }
    const selBooksNames = selBooks.map(b => b.book);
    const rows = [];

    const headersRow = ['Date', ...selBooksNames];
    rows.push(headersRow);

    for (const rec of data) {
        const {
            date,
            books
        } = rec;
        const row = [date];
        row.length = selBooksNames.length + 1;
        for (const b of books) {
            const {
                usage,
                book
            } = b;
            if (selBooksNames.includes(book)) {
                const ind = selBooksNames.indexOf(book) + 1;
                row[ind] = usage;
            }
            for (let i = 1; i < selBooksNames.length + 1; i++) {
                if (!row[i]) row[i] = 0;

            }

        }
        rows.push(row);
    }
    return rows;
}

const mapDataForTable = data => {
    const {
        dates
    } = data;
    const keys = Object.keys(data).slice(1);

    const rows = [];
    rows.push(['Delivery Date', ...dates]);
    for (const key of keys) {
        const row = [key, ...data[key]];
        rows.push(row);
    }
    return rows;
}

async function changeMontlyDetail() {

}

function drawMonthlyDetailChart(rows) {

    var data = google.visualization.arrayToDataTable(rows);
    var options = {
        width: $(window).width() - 150,
        height: 400,
        legend: {
            position: 'top',
            maxLines: 3
        },
        bar: {
            groupWidth: '85%'
        },
        chartArea: {
            width: "100%"
        },
        chart: {
            title: 'Monthly Usage(KWH)',
        },

        backgroundColor: 'none',
        // bar: {
        //     groupWidth: '90%'
        // },

    };

    var chart = new google.visualization.ColumnChart(document.getElementById('graph1'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

function drawMonthlyDetailTable(rows) {
    var data = google.visualization.arrayToDataTable(rows);

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
    const {
        graph,
        table
    } = await postData('/api/Graphs/MonthlyDetail', filters);

    if (!graph.length) {
        alertify.error("No values present in results");
        $('#graph1').html('');
        $('#table1').html('');
        return;
    }
    const rows = [];

    const graphData = await mapDataForGraph(graph);
    const tableData = await mapDataForTable(table);
    drawMonthlyDetailChart(graphData);
    drawMonthlyDetailTable(tableData);

    alertify.success('Finished processing');
}
