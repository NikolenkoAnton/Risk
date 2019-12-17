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
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDesk.Models.Graphs.DropdownsEntityResponse;

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

        private readonly IGraphService _graphService;
        private readonly IMonthlyService _monthlyService;
        //private readonly DealService service;

        public GraphsApiController(IDB d, IMapePeakService peakServ,
            IHourlyScalarService hourlyServ, IRiskService riskServ,
            IDealService dealServ, IScatterPlotService scatterService,
            IErcotService ercotService, IDropdownService dropService,
            IMonthlyService monthlyService, IGraphService graphService)
        {
            this.d = d;
            this.hourlyServ = hourlyServ;
            this.riskServ = riskServ;
            this.peakServ = peakServ;
            this.dealServ = dealServ;
            this.scatterService = scatterService;
            _ercotService = ercotService;
            _dropService = dropService;
            _monthlyService = monthlyService;
            _graphService = graphService;
            //var list = riskServ.GetRisk(new RiskGraphFilters());

            var monthly = _monthlyService.MonthlyData(new MonthlyGraphFilters());
            var deals = _graphService.GetDealEntry(new DealGraphFilters());
            var slcalars = _graphService.GetHourlyScalar(new HourlyScalarGraphFilters());
            var risks = _graphService.GetRisk(new RiskGraphFilters());
            var scatters = _graphService.GetScatterPlot(new ScatterPlotGraphFilters());
           // var ercots = _graphService.GetErcot(new ErcotGraphFilters());
            var peaks = _graphService.GetPeak(new PeakGraphFilters());
            var scenarios = _graphService.GetWeatherScenario(new WeatherScenarioGraphFilters());

        }



        [HttpGet]
        [Route("Deal")]
        public async Task<Deal> Deal([FromQuery]string Zone, [FromQuery]string Counter, [FromQuery] string WholeSales, [FromQuery] string StartDate, [FromQuery] string EndDate, [FromQuery] string StartDeal, [FromQuery] string EndDeal)
        {
            return await Task.Run(() => dealServ.Deal(Zone, Counter, WholeSales, StartDate, EndDate, StartDeal, EndDeal));
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
        [Route("Risk")]
        public List<RiskDataDTO> Risk(string Month, string Zone, string AccNumbers)
        {
            return riskServ.RiskData(Month, Zone, AccNumbers);
        }

        [HttpPost]
        [Route("HourlyScalar")]
        public List<HourlyScalarDBModel> GetHourlyScalar(HourlyScalarGraphFilters filters)
        {
            var list = hourlyServ.HourlyData(filters);

            return list;
        }

        [HttpPost]
        [Route("Deal")]
        public List<DealEntryDBModel> GetRisk(DealGraphFilters filters)
        {
            var list = dealServ.GetDealEntry(filters);
            return list;
        }

        [HttpPost]
        [Route("Risk")]
        public List<RiskDBModel> GetRisk(RiskGraphFilters filters)
        {
            var list = riskServ.GetRisk(filters);
            return list;
        }

        [HttpPost]
        [Route("MonthlyGraphs")]
        public MonthlyGraphResponse GetMontlyGraphs([FromBody] MonthlyGraphFilters filters)
        {

            var response = new MonthlyGraphResponse();
            response.SelectedBlocks = GetWholeSales().Select(x => x.Block).ToArray();
            response.SelectedMonths = getMonth().Select(x => x.ShortName).ToArray();
            response.Data = _monthlyService.MonthlyData(filters);

            return response;

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
            return data1;
        }

        #region  Dropdowns
        [HttpGet]
        [Route("CongestionZones")]
        public List<CongestionZoneDTO> GetCongestionZones()
        {
            var zones = _dropService.GetData<CongestionZone>(new CongestionZone()).Select(z => new CongestionZoneDTO { Zone = z.CongestionZones, Id = z.EntityId() }).ToList();
            return zones;
        }
        [HttpGet]
        [Route("AccNumbers")]
        public List<AccNumberDTO> GetAccNumbers()
        {
            var numbers = _dropService.GetData<AccountNumber>(new AccountNumber()).Select(acc => new AccNumberDTO { AccNumber = acc.UtilityAccountNumber, AccNumberId = acc.UtilityAccountNumberId.ToString(), Id = acc.EntityId() }).ToList();
            return numbers;
        }
        [HttpGet]
        [Route("WholeSales")]
        public List<WholeSalesDTO> GetWholeSales()
        {
            var blocks = _dropService.GetData<WholesaleBlock>(new WholesaleBlock())
            .OrderBy(wh => wh.WholeSaleBlocksId)
            .Select(wh => new WholeSalesDTO { Block = wh.WholeSaleBlocks, Id = wh.EntityId() }).ToList();
            return blocks;
            //return d.GetAllWholeSalesBlock();
        }
        [HttpGet]
        [Route("Counterparties")]
        public List<CounterpartyDTO> GetCounterparties()
        {
            var counterparties = _dropService.GetData<Counterparty>(new Counterparty()).Select(party =>
                                                           new CounterpartyDTO
                                                           {
                                                               Counterparty = party.CounterParty,
                                                               Id = party.EntityId()
                                                           }).ToList();


            return counterparties;
        }
        [HttpGet]
        [Route("Month")]
        public List<MonthDTO> getMonth()//List<WholeSalesDTO> GetWholeSales()
        {
            var months = _dropService.GetData<Month>(new Month())
                                                .Where(month => month.MonthsLongName != "All" && month.MonthsNamesID != "0")
                                                .Select(z =>
                                                            new MonthDTO
                                                            {
                                                                Name = z.MonthsLongName,
                                                                ShortName = z.MonthsShortName,
                                                                Id = z.EntityId()
                                                            })
                                                .ToList();

            return months;
        }
        [HttpGet]
        [Route("Scenario")]
        public List<ScenarioDTO> getScenario()
        {
            var scenarios = _dropService.GetData<WeatherScenar>(new WeatherScenar()).Select(z => new ScenarioDTO { Name = z.WeatherScenario, Id = z.EntityId() }).ToList();

            return scenarios;
        }
        #endregion
    }
}
