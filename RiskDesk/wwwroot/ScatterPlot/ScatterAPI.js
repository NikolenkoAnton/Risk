﻿//async function getCongestionZones() {
//    const url = `/api/graphs/CongestionZones`;
//    return getRequestData(url);
//}

//async function getAccNumbers (){
//    const url = `/api/graphs/AccNumbers`;
//    return getRequestData(url);
//}

//async function getWholeSales (){
//    const url = `/api/graphs/WholeSales`;
//    return getRequestData(url);

//}

//async function getWeatherScenario (){
//    //const url = `/api/graphs/WholeSales`;
//    return getRequestData(url);
//}

const getGraphData = () => {
    const url = `/api/graphs/ScatterPlot`;
    return getRequestData(url);
}
// }

// async function getScatterPlotGraphData(filteringString) {
//     const url = `/api/graphs/ScatterPlot${filteringString}`;
//     return getRequestData(url);
// }