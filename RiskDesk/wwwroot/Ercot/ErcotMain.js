var ArrayOfDataMonths = [];

google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(draw);

const blocksColors = ['#118DFF', '#E8D166', '#573B92', '#233cde'];
var blocksNames;
getWholeSales().then(resp => blocksNames = resp.map(el => el.block));

const addSelectedBlocksToGraph = (temp, blocksCount) => {
    const row = [{
        v: temp,
        f: `Temperature (F) - ${temp.toLocaleString('en-US',{minimumFractionDigits:1})}`
    }];
    for (let i = 0; i < blocksCount; i++) row.push(0);
    return row;
}
const procesGraphsDataBeforeDrawc = (data) => {
    const tempsArr = new Set(data.map(el => el.tempF));
    const mapData = data.map(el => ({
        block: el.wholeSaleBlocks,
        temp: el.tempF,
        KW: Math.round(el.loadKW),
        realTime: el.realTimePrice,
        month: el.xmonth
    }));

    const graphRows = [];
    const selectedWholeSales = getSelectedWholeBlocks();
    const whlblckCount = selectedWholeSales.length;

    //2x16
    for (const t of tempsArr) {
        const row = addSelectedBlocksToGraph(t, whlblckCount);
        for (const blocks of mapData) {

            if (blocks.temp === t) {
                const blockIndex = selectedWholeSales.indexOf(blocks.block) + 1;
                const {
                    KW,
                    temp,
                    block,
                    realTime,
                    month
                } = blocks;
                row[blockIndex] = {
                    v: blocks.KW,
                    f: `\n\nWholeSalesBlock - ${block},
                        \nLoad (KWt) - ${KW.toLocaleString('en-US',{minimumFractionDigits:1, maximumFractionDigits:2})},
                        \nRealTime Price - ${realTime.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 2,
                            minimumFractionDigits:1
                        })},
                        \nMonth - ${month} .`
                };
            }
            // }
            // wholeSaleBlocksID: 1
            // wholeSaleBlocks: "2x16"
            // utilityAccountNumber: "1008901000147590012100"
            // xdate: "0001-01-01T00:00:00"
            // xmonth: 12
            // he: 7
            // tempF: 63
            // realTimePrice: 18.71
            // ercotLoad: 33078.1649269578
            // loadKW: 81
        }
        graphRows.push(row);

    }
    return graphRows;

}

function fillDropdowns() {

    fillHours()
    fillMonth()
    fillCongestionZone()
    fillWholeSales();
    fillAccNumbers();
}

function processListOfDatas(arrObj) {
    //const orders = arrObj.map(el => el.order);
    const arrDatas = arrObj.map(el => procesGraphsDataBeforeDrawc(el.data));
    return arrDatas;
}
async function changeDrops() {
    const filters = await genericChangeDropdowbs();
    if (!filters || !filters.monthID) {
        filters.monthsID = [12];
    }
    const data1 = await postData('/api/graphs/Ercot', filters);
    const graphRows1 = await procesGraphsDataBeforeDrawc(data1);

    const data = await getGraphData();
    const graphRows = await processListOfDatas(data);
    ArrayOfDataMonths = graphRows;
}
var f;

async function draw(rows) {
    var chartDiv = document.getElementById('graph1');

    var chart = new google.visualization.ScatterChart(chartDiv);

    var options = {
        title: `Load \\ Temperature Scatter Plot`,
        width: $(window).width(),
        height: 650,
        hAxis: {
            title: 'Temperature (F)',

        },
        vAxis: {
            title: 'Load KWt',

        },
        legend: {
            position: 'top',
        },
        'backgroundColor': 'none',
        colors: blocksColors,
        animation: {
            duration: 1000,
            easing: 'inAndOut',
            //startup: true
        },
    };

    async function animateDraw() {
        const dropdown = $('#FilterMonth')[0];
        const arrOfMonth = getSelectedMonthsArr(dropdown);
        if (!arrOfMonth.length) {
            const filters = await genericChangeDropdowbs();
            filters.monthsID = [12];
            const data1 = await postData('/api/graphs/Ercot', filters);
            const graphRows = await procesGraphsDataBeforeDrawc(data1);
            const graphHeader = ['Temperature (F)', ...getSelectedWholeBlocks()];
            options['colors'] = blocksColors;
            chart.draw(google.visualization.arrayToDataTable([
                graphHeader,
                ...graphRows
            ]), options);
            return;
        }
        let a = await recurse(arrOfMonth);
        do {
            a = await recurse(a);
        } while (a);

        async function recurse(arr) {
            const m = arr[0];
            if (!m || !arr) return;
            const filters = await genericChangeDropdowbs();
            filters.monthsID = [m];
            const data1 = await postData('/api/graphs/Ercot', filters);
            const graphRows = await procesGraphsDataBeforeDrawc(data1);
            const graphHeader = ['Temperature (F)', ...getSelectedWholeBlocks()];
            options['colors'] = blocksColors;
            chart.draw(google.visualization.arrayToDataTable([
                graphHeader,
                ...graphRows
            ]), options);
            return arr.slice(1);
        }

    }


    // for (let i = 0; i < functionsArray.length - 1; i++) {
    //     const curr = functionsArray[i];
    //     const next = functionsArray[i + 1];
    //     curr();
    //     google.visualization.events.addOneTimeListener(chart, 'animationfinish', randomWalk);

    // }
    //  google.visualization.events.addOneTimeListener(chart, 'animationfinish', randomWalk);

    f = animateDraw;
    const filters = await genericChangeDropdowbs();
    if (!filters || !filters.monthID) {
        filters.monthsID = [12];
    }
    const data1 = await postData('/api/graphs/Ercot', filters);
    const graphRows1 = await procesGraphsDataBeforeDrawc(data1);

    chart.draw(google.visualization.arrayToDataTable([
        ['Temperature (F)', ...blocksNames],
        ...graphRows1
    ]), options);
}








// async function animateDraw() {
//     const data = await getGraphData();
//     const mappedData = await processListOfDatas(data);
//     let functionsArray = [];
//     for (let i = 0; i < mappedData.length; i++) {
//         function funcItem() {
//             let dt = google.visualization.arrayToDataTable([
//                 ['Temperature (F)', '2x16', '5x16', '7x8'],
//                 ...mappedData[i]
//             ]);
//             console.log("cycle")
//             chart.draw(dt, options);
//         }
//         functionsArray.push(funcItem);
//     }

//     function recurse() {
//         if (!functionsArray) return;
//         console.log(functionsArray);
//         const ff = functionsArray[0];
//         ff();
//         functionsArray = functionsArray.slice(1);
//     }
//     let timerId = setInterval(recurse, 1000);

//     // остановить вывод через 5 секунд
//     setTimeout(() => {
//         clearInterval(timerId);
//     }, 1000 * mappedData.length);

// }