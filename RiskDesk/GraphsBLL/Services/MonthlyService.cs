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
    public class MonthlyService : IMonthlyService
    {

        private readonly string _connectionString;
        private readonly IXMLService _xmlService;

        public MonthlyService(IConfiguration configuration, IXMLService xmlService)
        {
        _connectionString = configuration.GetConnectionString("Develop");
            _xmlService = xmlService;
        }


        //UA  WH  WS  MW  CZ 

        public List<MonthlyDBModel> MonthlyData(MonthlyGraphFilters filters)
        {
            var model = new MonthXML
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),

            };

            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<MonthlyDBModel>("[WebSite].[MonthlyFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }

        }


    }
}
