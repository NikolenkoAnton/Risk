google.charts.load('current', {
    'packages': ['corechart']
});
google.charts.load('current', {
    packages: ['table']
});
google.charts.setOnLoadCallback(draw);

const getSelectedBooks = async () => {
    const booksDrop = document.getElementById('Books');

    const options = getSelectedIndexesArray(booksDrop);

    if (!options.length) return positionBooks;

    return positionBooks.filter(b => options.includes(b.id));

}

const mapDataForTable = async data => {
    const dates = data.map(el => el.book);
    const headers = ['Delivery Date', ...dates];
    const rows = [headers];

    const selB = await getRequestData('/api/graphs/Books');

    for (const book of selB) {
        const row = [book.book];
        row.length = [dates.length + 1];
        row.fill(0, 1);

        for (const rec of data) {
            const ind = dates.indexOf(rec.book) + 1;

            for (const recRow of rec.rows) {
                if (recRow.bookOfBusiness === book.book) {
                    const usage = recRow.grossUsageMW;
                    row[ind] = usage;
                }
            }
        }
        rows.push(row);
    }
    return rows;

}
const checkDate = (row, selBooksNum) => {

    for (let i = 1; i < selBooksNum; i++) {
        const el = row[i];
        if (!el) return false;
    }
    return true;
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

    for (const el of data) {
        const row = [el.book];
        for (const rowsByDate of el.rows) {
            const usage = rowsByDate.grossUsageMW;
            const bName = rowsByDate.bookOfBusiness;
            const index = selBooksNames.indexOf(bName);
            if (index > -1) {
                row[index + 1] = usage;
            }
        }
        if (checkDate(row)) rows.push(row);
    }

    return rows.filter(r => r.length === selBooks.length + 1);

}

function drawMonthlyPositionChart(rows) {

    var data = google.visualization.arrayToDataTable(rows);
    var options = {

        height: 400,
        width: $(window).width() - 150,
        legend: {
            position: 'top',
            maxLines: 3
        },

    };

    var chart = new google.visualization.AreaChart(document.getElementById('graph1'));
    chart.draw(data, options);
}

function drawMonthlyPositionTable(rows) {
    const data = google.visualization.arrayToDataTable(rows);
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
    const data = await postData('/api/Graphs/MonthlyPosition', filters);
    const graphData = await mapDataForGraph(data);
    const tableData = await mapDataForTable(data);
    drawMonthlyPositionChart(graphData);
    drawMonthlyPositionTable(tableData);
    alertify.success('Finished processing');

}