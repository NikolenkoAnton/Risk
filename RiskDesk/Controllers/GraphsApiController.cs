﻿using System;
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
        private readonly IMapePeakService peakServ;
        private readonly IDealService dealServ;
        private readonly IDropdownService _dropService;

        private readonly IGraphService _graphService;
        private readonly IMonthlyService _monthlyService;
        //private readonly DealService service;

        public GraphsApiController(IDB d, IMapePeakService peakServ,
            IHourlyScalarService hourlyServ, IDealService dealServ,
            IDropdownService dropService, IMonthlyService monthlyService,
            IGraphService graphService)
        {
            this.d = d;
            this.hourlyServ = hourlyServ;
            this.peakServ = peakServ;
            this.dealServ = dealServ;
            _dropService = dropService;
            _monthlyService = monthlyService;
            _graphService = graphService;


        }



        [HttpPost]
        [Route("MonthlyDetail")]
        public dynamic MonthlyDetail(MonthlyDetailPositionGraphFilters filters)
        {

            var list1 = new List<dynamic>();
            var list2 = new List<dynamic>();
            var list = _graphService.GetMonthlyDetail(filters).GroupBy(el => el.DeliveryDateString);

            foreach (var el in list)
            {
                var rec = new
                {
                    date = el.Key,
                    netUsage = el.Sum(x => x.NetUsage),
                    grossUsage = el.Sum(x => x.GrossUsage),
                    costTotal = el.Sum(x => x.CostTotal),
                    c_Energy = el.Sum(x => x.C_Energy),
                    c_Losses = el.Sum(x => x.C_Losses),
                    c_Basis = el.Sum(x => x.C_Basis),
                    c_VolRisk = el.Sum(x => x.C_VolRisk),
                    c_ANC = el.Sum(x => x.C_ANC),
                    c_ADMIN_MISC = el.Sum(x => x.C_ADMIN_MISC),
                    c_CRR = el.Sum(x => x.C_CRR),
                    revenue = el.Sum(x => x.Revenue),
                    netRevenue = el.Sum(x => x.NetRevenue),
                };
                var rec1 = new
                {
                    date = el.Key,
                    Books = el.Select(x => new { usage = x.NetRevenue, book = x.BookOfBusiness }).ToArray(),
                };

                list1.Add(rec);
                list2.Add(rec1);
            }


            return new
            {
                graph = list2,
                table = new {
                dates = list1.Select(x => x.date),
                netUsage = list1.Select(x => x.netUsage),
                grossUsage = list1.Select(x => x.grossUsage),
costTotal = list1.Select( x => x.costTotal),
c_Energy = list1.Select( x => x.c_Energy),
c_Losses = list1.Select( x => x.c_Losses ),
c_Basis = list1.Select( x => x.c_Basis ),
c_VolRisk = list1.Select( x => x.c_VolRisk ),
c_ANC = list1.Select( x => x.c_ANC ),
c_ADMIN_MISC = list1.Select( x => x.c_ADMIN_MISC),
c_CRR = list1.Select( x => x.c_CRR),
revenue = list1.Select( x => x.revenue),
netRevenue = list1.Select( x => x.netRevenue),
            }};

        }


        [HttpPost]
        [Route("MonthlyPosition")]
        public dynamic MonthlyPosition(MonthlyDetailPositionGraphFilters filters)
        {
            var list = _graphService.GetMonthlyPosition(filters)
                            .GroupBy(el => el.DeliveryDateString)
                            ;
            List<dynamic> l = new List<dynamic>();

            foreach (var grp in list)
            {
                l.Add(
                    new
                    {
                        Book = grp.Key,
                        Rows = grp.ToList(),
                    }
                );
            }
            return l;

            // var keys = list.Select(gr => gr.Key);
            // return new
            // {

            // };
        }
        [HttpGet]
        [Route("Deal")]
        public async Task<Deal> Deal([FromQuery]string Zone, [FromQuery]string Counter, [FromQuery] string WholeSales, [FromQuery] string StartDate, [FromQuery] string EndDate, [FromQuery] string StartDeal, [FromQuery] string EndDeal)
        {
            return await Task.Run(() => dealServ.Deal(Zone, Counter, WholeSales, StartDate, EndDate, StartDeal, EndDeal));
        }



        [HttpGet]
        [Route("Peak")]
        public async Task<Peak> Peak(string Month, string Scenario, string AccNumbers)
        {
            return await peakServ.DataPeak(Month, Scenario, AccNumbers);
        }

        [HttpPost]
        [Route("Peak")]
        public PeakDBModel GetPeak(PeakGraphFilters filters)
        {
            var list = _graphService.GetPeak(filters);
            return list;
        }

        [HttpPost]
        [Route("Ercot")]
        public List<ErcotDBModel> GetErcot(ErcotGraphFilters filters)
        {
            var list = _graphService.GetErcot(filters);
            return list;
        }

        [HttpPost]
        [Route("ScatterPlot")]
        public List<ScatterPlotDBModel> GetScatterPlot(ScatterPlotGraphFilters filters)
        {
            var list = _graphService.GetScatterPlot(filters);
            return list;
        }

        [HttpPost]
        [Route("HourlyScalar")]
        public List<HourlyScalarDBModel> GetHourlyScalar(HourlyScalarGraphFilters filters)
        {
            var list = hourlyServ.HourlyData(filters);

            return list;
        }

        [HttpPost]
        [Route("WeatherScenario")]
        public List<WeatherScenarioDBModel> GetWeatherScenario(WeatherScenarioGraphFilters filters)
        {
            var list = _graphService.GetWeatherScenario(filters);
            return list;
        }

        [HttpPost]
        [Route("Deal")]
        public DealEntryDBModel GetDeal(DealGraphFilters filters)
        {
            var list = _graphService.GetDealEntry(filters);
            return list;
        }

        [HttpPost]
        [Route("Risk")]
        public List<RiskDBModel> GetRisk(RiskGraphFilters filters)
        {
            var list = _graphService.GetRisk(filters);
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


        #region  Dropdowns
        [HttpGet]
        [Route("Lines")]
        public List<LinesDTO> GetLinesOfBussines()
        {
            var lines = _dropService.GetData<Lines>(new Lines())
                                .Select(b => new LinesDTO
                                {
                                    Line = b.LineOfBusiness,
                                    Id = b.EntityId()
                                })
                                .ToList();
            return lines;
        }

        [HttpGet]
        [Route("Books")]
        public List<BooksDTO> GetBooksOfBussines()
        {
            var books = _dropService.GetData<Books>(new Books())
                                .Select(b => new BooksDTO
                                {
                                    Book = b.BookOfBusiness,
                                    Id = b.EntityId()
                                })
                                .ToList();
            return books;
        }
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
