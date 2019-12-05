var ArrayOfDataMonths = [];
google.charts.load('current', {
    'packages': ['corechart', 'scatter']
});
google.charts.setOnLoadCallback(changeDrops);
//animation:{
//     duration: 1000,
//     easing: 'out',
//   },

isMonthsDataLoad = false;

const blocksNames = ['2x16', '5x16', '7x8'];

// var data = google.visualization.arrayToDataTable(
//     ['Temperature (F)', '2x16', '5x16', '7x8']);
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
    isMonthsDataLoad = true;
    const data = await getGraphData();
    isMonthsDataLoad = false;
    const graphRows = await processListOfDatas(data);
    //drawStuffAnimate(graphRows);
    ArrayOfDataMonths = graphRows;
    $("#polzunok").slider("option", {
        min: 1,
        max: getSelectedMonthsValue()
    });

    function draw() {
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
                // textStyle: {
                //     color: 'blue',
                //     fontSize: 16
                // }
            },
            'backgroundColor': 'none',
            colors: ['#118DFF', '#E8D166', '#573B92'],
            animation: {
                duration: 4000,
                easing: 'inAndOut',
                //startup: true
            },

        };

        function handleNewDraw(data, count) {
            const months = getSelectedMonths();
            options['title'] = `Load \\ Temperature Scatter Plot   Current month - ' + ${months[count]}`;
            setTimeout(function () {
                chart.draw(data, options)
            }, 2000);


        }

        function changeCurrMonth(index, dt) {
            chart.draw(dt, options);
            google.visualization.events.addListener(chart, 'animationfinish',
                function () {
                    $("#polzunok").slider("value", index);
                    $('#currMonth').text(index);
                });

        }

        function animateGraph() {
            for (let i = 0; i < ArrayOfDataMonths.length; i++) {
                let dt = google.visualization.arrayToDataTable([
                    ['Temperature (F)', '2x16', '5x16', '7x8'],
                    ...ArrayOfDataMonths[i]
                ]);
                const c = i + 1;
                changeCurrMonth(c, dt);
                // setTimeout(function () {
                //     const c = i + 1;
                //     chart.draw(dt, options);
                //     $("#polzunok").slider("value", c);
                //     $('#currMonth').text(c);

                // }, 2000);

            }
        }
        const img = document.getElementById('play');
        img.onclick = animateGraph;
        let countMonth = graphRows.length;
        let row = graphRows[countMonth - 1];
        const currData = google.visualization.arrayToDataTable([
            ['Temperature (F)', '2x16', '5x16', '7x8'],
            ...row
        ]);
        chart.draw(currData, options);
        $('#currMonth').text(countMonth);
        // for (const row of graphRows) {
        //     let count = 0;
        //     const currData = google.visualization.arrayToDataTable([
        //         ['Temperature (F)', '2x16', '5x16', '7x8'],
        //         ...row
        //     ]);

        //     if (count === 0) {
        //         chart.draw(currData, options);
        //     } else {
        //         handleNewDraw(currData, count)
        //     };
        //     count++;
        //     //setTimeout(materialChart.draw(currData, google.charts.Scatter.convertOptions(materialOptions)));
        // }


    }
    draw();
}


const ChangeMonths = (event) => {

    if (isMonthsDataLoad) return;
    changeDrops();
}