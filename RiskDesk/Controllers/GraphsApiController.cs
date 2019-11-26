using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.GraphsBLL.DTO;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.GraphsBLL.Services;
using RiskDeskDev.Models.Graphs;

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
        //private readonly DealService service;
        public GraphsApiController(IDB d, IMapePeakService peakServ,IHourlyScalarService hourlyServ, IRiskService riskServ,IDealService dealServ)
        {
            this.d = d;
            this.hourlyServ = hourlyServ;
            this.riskServ = riskServ;
            this.peakServ = peakServ;
            //service = new DealService(configuration);
            this.dealServ = dealServ;
           // d = new DB();
        }


        [HttpGet]
        [Route("Deal")]
        public async Task<Deal> Deal([FromQuery]string Zone, [FromQuery]string Counter, [FromQuery] string WholeSales, [FromQuery] string StartDate, [FromQuery] string EndDate,[FromQuery] string StartDeal, [FromQuery] string EndDeal)
        {
          return await Task.Run(()=>dealServ.Deal(Zone,Counter,WholeSales, StartDate, EndDate, StartDeal, EndDeal));
        }
        //return new { dealMax, dealMin, max, min, graph1, graph2, graph3, graph4 };

        [HttpGet]
        [Route("DealDrops")]
        public  async Task<DealDrops> DealDrops()
        {
            return await Task.Run(()=>dealServ.DealDrops());
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
            return await peakServ.DataPeak(Month,  Scenario,  AccNumbers);
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
            return riskServ.RiskData( Month,  Zone,  AccNumbers);
        }

        [HttpGet]
        [Route("HourlyScalar")]
        public IEnumerable<HourlyScalarDTO> HourlyScalarData(string Month, string Zone, string WholeSales, string AccNumbers)
        {
            return hourlyServ.HourlyScalarData( Month,  Zone,  WholeSales,  AccNumbers);
        }
        [HttpGet]
        [Route("CongestionZones")]
        public List<CongestionZoneDTO> GetCongestionZones()
        {
            return  d.GetAllCongestionZone();
        }

        [HttpGet]
        [Route("AccNumbers")]
        public List<AccNumberDTO> GetAccNumbers()
        {
            return   d.GetAllAccNumber();
        }

        [HttpGet]
        [Route("WholeSales")]
        public   List<WholeSalesDTO> GetWholeSales()
        {
            return  d.GetAllWholeSalesBlock();
        }

        [HttpGet]
        [Route("HourlyAggregates")]
        public HourlyGraphsDataDTO getHourlyAggregatesGraphs(string StartDate, string EndDate, string Month, string Scenario, string WholeSales, string AccNumbers)//List<WholeSalesDTO> GetWholeSales()
        {
            IEnumerable<HourlyDTO> list =  d.getHourlyGraph(StartDate, EndDate, Month, Scenario, WholeSales, AccNumbers);
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
            return  d.getAllMonth();
        }

        [HttpGet]
        [Route("Scenario")]
        public List<ScenarioDTO> getScenario()//List<WholeSalesDTO> GetWholeSales()
        {
            return  d.getAllScenario();
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
        public List<MontlyGraphDTO> GetWeatherMontlyGraphs(string Month,string Scenario,string WholeSales, string AccNumbers)
        {
          
            List<MontlyGraphDTO>list = d.GetWeatherMontlyGraphs(Month,Scenario, WholeSales, AccNumbers);
            return list;

        }

        [HttpGet]
        [Route("CongestionZonesGraphs")]
        public List<CongestZoneGraphDTO>  GetCongestionZonesGraphs(string Zone,string WholeSales,string AccNumbers)
        {
            List<CongestZoneGraphDTO> list = d.GetCongestZoneGraphs(Zone,WholeSales,AccNumbers);
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
    }
}