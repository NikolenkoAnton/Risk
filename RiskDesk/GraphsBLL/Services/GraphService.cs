using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.XmlDTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;

namespace RiskDesk.GraphsBLL.Services
{
    public class GraphService : IGraphService
    {
        private readonly string _connectionString;

        private readonly IXMLService _xmlService;

        public GraphService(IConfiguration config, IXMLService xmlService)
        {
            _connectionString = config.GetConnectionString("Develop");
            _xmlService = xmlService;
        }
        public DealEntryDBModel GetDealEntry(DealGraphFilters filters)
        {
            using (IDbConnection conn = new SqlConnection(_connectionString))
            {

                var data1 = conn.QueryMultiple("[WebSite].[DealEntryFilteredGetInfo]",

               commandType: CommandType.StoredProcedure);

                var deal = data1.Read<DealDBModel>().ToList();
                var dealBlock = data1.Read<DealBlock>().ToList();
                var dealCounterVolume = data1.Read<CounterpartyVolumeDeal>().ToList();
                var dealCounterGrossMargin = data1.Read<CounterpartyGrossMarginDeal>().ToList();

                var data = new DealEntryDBModel
                {
                    Deals = deal,
                    Blocks = dealBlock,
                    CounterVolumes = dealCounterVolume,
                    CounterGrossMargins = dealCounterGrossMargin
                };

                return data;
            }
        }
        //UA  WH  WS  MN  CZ HR
        //"[WebSite].[ErcotLoadAnimateFilteredGetInfo]
        public List<ErcotDBModel> GetErcot(ErcotGraphFilters filters)
        {
            var model = new ErcotXMLDTO
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
                HoursString = _xmlService.GetFilterXMLRows("HR", filters.HoursID),
            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<ErcotDBModel>("[WebSite].[ErcotLoadAnimateFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }

        public List<HourlyScalarDBModel> GetHourlyScalar(HourlyScalarGraphFilters filters)
        {
            var model = new HourlyScalarXML
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<HourlyScalarDBModel>("[WebSite].[HourlyScalarFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }

        //
        public List<PeakDBModel> GetPeak(PeakGraphFilters filters)
        {
            var model = new PeakXML
            {
                WeatherScenarioString = _xmlService.GetFilterXMLRows("WS", filters.ScenariosID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<PeakDBModel>("[WebSite].[CoincidencePeakGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }

        public List<RiskDBModel> GetRisk(RiskGraphFilters filters)
        {
            var model = new RiskXML
            {
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),

            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<RiskDBModel>("[WebSite].[RiskFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }

        }
        //[WebSite].[ScatterPlotFilteredGetInfo]
        public List<ScatterPlotDBModel> GetScatterPlot(ScatterPlotGraphFilters filters)
        {
            var model = new ScatterXML
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                HoursString = _xmlService.GetFilterXMLRows("HR", filters.HoursID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<ScatterPlotDBModel>("[WebSite].[ScatterPlotFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }

        //[WebSite].[WeatherHourlyFilteredGetInfo]
        public List<WeatherScenarioDBModel> GetWeatherScenario(WeatherScenarioGraphFilters filters)
        {
            var model = new WeatherScenarioXML
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<WeatherScenarioDBModel>("[WebSite].[WeatherHourlyFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }
    }
}