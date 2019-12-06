var ArrayOfDataMonths = [];

google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(changeDrops);


const blocksNames = ['2x16', '5x16', '7x8'];

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
    const data = await getGraphData();
    const graphRows = await processListOfDatas(data);
    //drawStuffAnimate(graphRows);
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
        colors: ['#118DFF', '#E8D166', '#573B92'],
        animation: {
            duration: 1000,
            easing: 'inAndOut',
            //startup: true
        },
    };

    async function animateDraw() {
        const dropdown = $('#FilterMonth')[0];
        const arrOfMonth = getSelectedMonths(dropdown).split('');
        let a = await recurse(arrOfMonth);
        do {
            a = await recurse(a);
        } while (a);

        async function recurse(arr) {
            const m = arr[0];
            if (!m || !arr) return;
            const params = "?Month=" + m + "&" + getQueryParamButMonth();
            const data = await getGraphData(params);
            const mappedData = (await processListOfDatas(data))[0];
            chart.draw(google.visualization.arrayToDataTable([
                ['Temperature (F)', '2x16', '5x16', '7x8'],
                ...mappedData
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
    const params = "?Month=D";
    const data = await getGraphData(params);
    const mappedData = (await processListOfDatas(data))[0];
    chart.draw(google.visualization.arrayToDataTable([
        ['Temperature (F)', '2x16', '5x16', '7x8'],
        ...mappedData
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
