using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiskDesk.GraphsBLL;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.QueryDTO;
using RiskDeskDev.GraphsBLL.DTO;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.GraphsBLL.Services;
using RiskDeskDev.Models.Graphs;
using RiskDeskDev.Web.GraphsBLL.Interfaces;

namespace RiskDeskDev.Controllers
{
    public class Deal
    {
        public DateTime? dealMax;
        public DateTime? dealMin;
        public DateTime? max;
        public DateTime? min;
        public List<object[]> graph1;
        public List<object[]> graph2;
        public List<object[]> graph3;
        public List<object[]> graph4;

    }
    public class DealDrops
    {
        public List<object> zones;

        public List<object> blocks;

        public List<object> counters;



    }
    [Route("api/graphs")]
    [ApiController]
    public class GraphsApiController : ControllerBase
    {
        //DB d;
        private readonly IDB d;
        private readonly IHourlyScalarService hourlyServ;
        private readonly IRiskService riskServ;
        private readonly IMapePeakService peakServ;
        private readonly IDealService dealServ;
        private readonly IScatterPlotService scatterService;
        private readonly IErcotService _ercotService;
        private readonly IDropdownService _dropService;
        //private readonly DealService service;
        public GraphsApiController(IDB d, IMapePeakService peakServ,
            IHourlyScalarService hourlyServ, IRiskService riskServ,
            IDealService dealServ, IScatterPlotService scatterService,
            IErcotService ercotService, IDropdownService dropService)
        {
            this.d = d;
            this.hourlyServ = hourlyServ;
            this.riskServ = riskServ;
            this.peakServ = peakServ;
            this.dealServ = dealServ;
            this.scatterService = scatterService;
            _ercotService = ercotService;
            _dropService = dropService;
            // d = new DB();
        }


        [HttpGet]
        [Route("Deal")]
        public async Task<Deal> Deal([FromQuery]string Zone, [FromQuery]string Counter, [FromQuery] string WholeSales, [FromQuery] string StartDate, [FromQuery] string EndDate, [FromQuery] string StartDeal, [FromQuery] string EndDeal)
        {
            return await Task.Run(() => dealServ.Deal(Zone, Counter, WholeSales, StartDate, EndDate, StartDeal, EndDeal));
        }
        //return new { dealMax, dealMin, max, min, graph1, graph2, graph3, graph4 };

        [HttpGet]
        [Route("DealDrops")]
        public async Task<DealDrops> DealDrops()
        {
            return await Task.Run(() => dealServ.DealDrops());
        }

        [HttpGet]
        [Route("Mape")]
        public async Task<Mape> Mape(string Month, string WholeSales, string AccNumbers)
        {
            return await peakServ.DataMape(Month, WholeSales, AccNumbers);
        }

        [HttpGet]
        [Route("Peak")]
        public async Task<Peak> Peak(string Month, string Scenario, string AccNumbers)
        {
            return await peakServ.DataPeak(Month, Scenario, AccNumbers);
        }


        [HttpGet]
        [Route("PeakDrops")]
        public async Task<DropsPeak> PeakDrops()
        {
            return await Task.Run(() => peakServ.DropsPeak());
        }

        [HttpGet]
        [Route("MapeDrops")]
        public DropsMape MapeDrops()
        {
            return peakServ.DropsMape();
        }


        [HttpGet]
        [Route("RiskDrops")]
        public RiskDropDTO RiskDrops()
        {
            return riskServ.RiskDropsData();
        }

        [HttpGet]
        [Route("Risk")]
        public List<RiskDataDTO> Risk(string Month, string Zone, string AccNumbers)
        {
            return riskServ.RiskData(Month, Zone, AccNumbers);
        }

        [HttpGet]
        [Route("HourlyScalar")]
        public IEnumerable<HourlyScalarDTO> HourlyScalarData(string Month, string Zone, string WholeSales, string AccNumbers)
        {
            return hourlyServ.HourlyScalarData(Month, Zone, WholeSales, AccNumbers);
        }
        [HttpGet]
        [Route("CongestionZones")]
        public List<CongestionZoneDTO> GetCongestionZones()
        {
            var a1 = _dropService.GetData<CongestionZone>(new CongestionZone()).Select(z => new CongestionZoneDTO { Zone = z.CongestionZones }).ToList();
            var a = d.GetAllCongestionZone();
            return a;
        }

        [HttpGet]
        [Route("AccNumbers")]
        public List<AccNumberDTO> GetAccNumbers()
        {
            var a1 = _dropService.GetData<AccountNumber>(new AccountNumber()).Select(acc => new AccNumberDTO { AccNumber = acc.UtilityAccountNumber, AccNumberId = acc.UtilityAccountNumberId.ToString() }).ToList();
            //var a = d.GetAllAccNumber();
            return a1;
        }

        [HttpGet]
        [Route("WholeSales")]
        public List<WholeSalesDTO> GetWholeSales()
        {
            var blocks = _dropService.GetData<WholesaleBlock>(new WholesaleBlock())
            .OrderBy(wh => wh.WholeSaleBlocksId)
            .Select(wh => new WholeSalesDTO { Block = wh.WholeSaleBlocks }).ToList();
            return blocks;
            //return d.GetAllWholeSalesBlock();
        }

        [HttpGet]
        [Route("HourlyAggregates")]
        public HourlyGraphsDataDTO getHourlyAggregatesGraphs(string StartDate, string EndDate, string Month, string Scenario, string WholeSales, string AccNumbers)//List<WholeSalesDTO> GetWholeSales()
        {
            IEnumerable<HourlyDTO> list = d.getHourlyGraph(StartDate, EndDate, Month, Scenario, WholeSales, AccNumbers);
            if (StartDate == "0" && EndDate == "0")
            {
                DateTime max = list.Max(el => el.date);
                DateTime min = list.Min(el => el.date);
                return new HourlyGraphsDataDTO { data = list, maxDate = max, minDate = min };
            }
            return new HourlyGraphsDataDTO { data = list, maxDate = null, minDate = null };
        }

        [HttpGet]
        [Route("Month")]
        public List<MonthDTO> getMonth()//List<WholeSalesDTO> GetWholeSales()
        {
            var a = _dropService.GetData<Month>(new Month());
            var a1 = d.getAllMonth();
            return a1;
        }

        [HttpGet]
        [Route("Scenario")]
        public List<ScenarioDTO> getScenario()//List<WholeSalesDTO> GetWholeSales()
        {
            var a = _dropService.GetData<WeatherScenar>(new WeatherScenar());
            var a1 = d.getAllScenario();
            return a1;
        }

        [HttpGet]
        [Route("MontlyGraphs")]
        public List<MonthlyDTO> GetMontlyGraphs(string Month, string Zone, string WholeSales, string AccNumbers)
        {

            List<MonthlyDTO> list = d.GetMontlyGraphs(Month, Zone, WholeSales, AccNumbers);
            return list;

        }

        [HttpGet]
        [Route("WeatherMontlyGraphs")]
        public List<MontlyGraphDTO> GetWeatherMontlyGraphs(string Month, string Scenario, string WholeSales, string AccNumbers)
        {

            List<MontlyGraphDTO> list = d.GetWeatherMontlyGraphs(Month, Scenario, WholeSales, AccNumbers);
            return list;

        }

        [HttpGet]
        [Route("CongestionZonesGraphs")]
        public List<CongestZoneGraphDTO> GetCongestionZonesGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            List<CongestZoneGraphDTO> list = d.GetCongestZoneGraphs(Zone, WholeSales, AccNumbers);
            return list;
        }

        [HttpGet]
        [Route("AccNumbersGraphs")]
        public List<AccIdGraphDTO> GetAccNumbersGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            List<AccIdGraphDTO> list = d.GetAccIdGraphs(Zone, WholeSales, AccNumbers);
            return list;
        }

        [HttpGet]
        [Route("WholeSalesGraphs")]
        public List<WholeSalesGraphDTO> GetWholeSalesGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            List<WholeSalesGraphDTO> list = d.GetWholeSalesGraphs(Zone, WholeSales, AccNumbers);
            return list;
        }

        [HttpGet]
        [Route("ScatterPlot")]
        public List<ScatterPlotDTO> GetScatterPlot(string Hours, string Month, string Zone, string WholeSales, string AccNumbers)
        {
            var data = scatterService.ScatterPlotData(Hours, Month, Zone, WholeSales, AccNumbers);
            return data;
        }

        [HttpGet]
        [Route("Ercot")]
        public List<ErcotMonthDTO> GetErcotData([FromQuery]ErcotQueryDTO query) //string Hours, string Month, string Zone, string WholeSales, string AccNumbers)
        {
            var data = _ercotService.Ercot(query);
            var data1 = _ercotService.Ercot1(query);
            // return data;
            return data1;
        }

    }
}
