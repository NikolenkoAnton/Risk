    const getRequestData = async (url) => {

        const response = await fetch(url);
        return response.json();
    }
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.load('current', {
        packages: ['table']
    });
    google.charts.load('current', {
        'packages': ['bar']
    });
    google.charts.setOnLoadCallback(drawHourly);
    const getDataHourlyGraphs = async () => {
        const filtStr = getFilteringStringMontly();
        const dateValue = getHourlyDateValue();
        const url = `/api/graphs/HourlyAggregates?${dateValue}&` + filtStr.slice(1, filtStr.length);
        return getRequestData(url);
    }

    const getHourlyDateValue = () => {
        const start = document.querySelector('#start'); //.split('-').join('');
        const end = document.querySelector('#end'); //.split('-').join('');
        console.log(start, end);
        if (start && end) {
            const startParam = start.value.split('-').reverse().join('W');
            const endParam = end.value.split('-').reverse().join('W');
            return `StartDate=${startParam}&EndDate=${endParam}`;
        }
        return `StartDate=0&EndDate=0`;

    }

    const mapDateForGraphs = date => String(date).split('T')[0];

    function drawChartWeatherHourly(arr) {
        const mapArr = arr.map(el => [mapDateForGraphs(el.date), el.avg, el.mild, el.xtreme]);
        var data = google.visualization.arrayToDataTable([
            ['Weather Scenario', 'avg', 'mild', 'xtreme'],
            ...mapArr
        ]);

        var options = {
            width: $(window).width(),
            height: 500,
            backgroundColor: 'none',
            curveType: 'function',
            legend: {
                position: 'top'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('graph1'));

        chart.draw(data, options);
    }

    const changeHourlyDropdowns = dropdown => {
        changeDropdowns(dropdown);
        drawHourly();
    }
    const changeDateInput = input => {
        drawHourly();
    }

    const removeOldDateInput = (inpCnt1, inpCnt2) => {
        if (inpCnt1.children.length > 1) inpCnt1.children[1].remove();
        if (inpCnt2.children.length > 1) inpCnt2.children[1].remove();
    }

    const drawDateInputs = (min, max) => {
        const inpConts = [...document.querySelectorAll('.inputDateCell')];

        let minDate = String(min).slice(0, 10).split('-').reverse();
        let maxDate = String(max).slice(0, 10).split('-').reverse();
        minDate = minDate[1] + '/' + minDate[0] + '/' + minDate[2];
        maxDate = maxDate[1] + '/' + maxDate[0] + '/' + maxDate[2];

        console.log(minDate);
        console.log(maxDate);
        //removeOldDateInput(inpConts[0], inpConts[1]);
        inpConts[0].innerHTML += `<input type="text"  id="start" onchange="changeDateInput(this)">`;
        inpConts[1].innerHTML += `<input type="text"  id="end" onchange="changeDateInput(this)">`;
        $("#start").datepicker();
        $("#start").datepicker("setDate", minDate);
        $("#start").datepicker({
            maxDate,
            minDate
        });
        $("#end").datepicker();
        $("#end").datepicker("setDate", maxDate);
        $("#end").datepicker({
            maxDate,
            minDate
        });
        $(function () {


        });

    }

    async function drawHourly() {
        const data = await getDataHourlyGraphs();
        console.log(data);
        if (!document.querySelector('#start')) {
            drawDateInputs(data.minDate, data.maxDate);
        }
        drawChartWeatherHourly(data.data);
    }
    async function fillDropdownsWeatherHourly() {
        const accNumbers = await getAccNumbers();

        const wholeSales = await getWholeSales();

        const monthes = (await getMonth()).slice(1);

        const scenarios = await getScenario();
        //const [accNumbers, wholeSales, monthes, scenarios] = await Promise.all([getAccNumbers(), getWholeSales(), getMonth(), getScenario()]);

        const monthDropdown = document.querySelector('#FilterMonth');


        const scenatioDropdown = document.querySelector('#FilterScenario');


        const accNumberDropdown = document.querySelector('#FilterAccNumber');


        const wholeSalesDropdown = document.querySelector('#FilterWholeSales');

        for (const month of monthes) {
            const index = monthes.indexOf(month);
            monthDropdown.innerHTML += getSelectOption(month.name, index);
        }

        for (const scenario of scenarios) {
            const index = scenarios.indexOf(scenario) + 1;
            scenatioDropdown.innerHTML += getSelectOption(scenario.name, index);
        }

        for (const number of accNumbers) {
            accNumberDropdown.innerHTML += getSelectOption(number.accNumber, number.accNumberId);
        }

        for (const block of wholeSales) {
            const index = wholeSales.indexOf(block) + 1;
            wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);
        }
        //setStartedDropdownValue([monthDropdown, scenatioDropdown, accNumberDropdown, wholeSalesDropdown]);
        $(monthDropdown).multiselect({
            selectAll: true
        });
        $(scenatioDropdown).multiselect({
            selectAll: true
        });
        $(accNumberDropdown).multiselect({
            selectAll: true
        });
        $(wholeSalesDropdown).multiselect({
            selectAll: true
        });
    }
