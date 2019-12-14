using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.XmlDTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDeskDev.Models.Graphs;

namespace RiskDeskDev
{
    public class HourlyScalarService : IHourlyScalarService
    {
        private readonly string ConnectionString;// = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";

        private readonly IXMLService _xmlService;

        public HourlyScalarService(IConfiguration config, IXMLService xmlService)
        {
            ConnectionString = config.GetConnectionString("Develop");
            _xmlService = xmlService;
        }

        public List<HourlyScalarDBModel> HourlyData(HourlyScalarGraphFilters filters)
        {
            var model = new HourlyScalarXML
            {
                WholeBlockString = _xmlService.GetFilterXMLRows("WH", filters.BlocksID),
                CongestionZoneString = _xmlService.GetFilterXMLRows("CZ", filters.ZonesID),
                UtilityAccountNumberString = _xmlService.GetFilterXMLRows("UA", filters.AccNumbersID),
                MonthsString = _xmlService.GetFilterXMLRows("MN", filters.MonthsID),
            };

            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                var data = conn.Query<HourlyScalarDBModel>("[WebSite].[HourlyScalarFilteredGetInfo]",
                model,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }
        }

    }
}
