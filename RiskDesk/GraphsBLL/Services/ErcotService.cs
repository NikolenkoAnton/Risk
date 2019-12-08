using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.Dao;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.QueryDTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.Services
{
    public class ErcotService : IErcotService
    {

        private readonly string _connectionString;
        private readonly IXMLService _xmlService;
        private readonly IErcotRepository _ercotRep;

        public ErcotService(IConfiguration configuration, IXMLService xmlService,
        IErcotRepository ercotRepository)
        {
            _connectionString = configuration.GetConnectionString("Develop");
            _xmlService = xmlService;
            _ercotRep = ercotRepository;

        }

        public void Test()
        {
            Console.Write("Test");
        }
        public List<ErcotDTO> Ercot(ErcotQueryDTO queryParam)
        {
            var xmlModel = queryParam.GetXmlModel();
            var months = queryParam.GetMonths();
            var procedureName = "[WebSite].[ErcotLoadAnimateFilteredGetInfo]";
            //var a = GetDataForAllMonths(xmlModel);
            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<ErcotDTO>(procedureName,
                xmlModel,
                    commandType: CommandType.StoredProcedure).AsList();
                data.ForEach(x => RoundTempAndErcotLoad(x));
                return data;
            }
            //return _ercotRep.GetGraphData<ErcotXMLDTO>(xmlModel, procedureName);
        }

        private void RoundTempAndErcotLoad(ErcotDTO ercot)
        {
            ercot.TempF = Math.Round(ercot.TempF, 1);
            ercot.ErcotLoad = Math.Round(ercot.ErcotLoad);
        }
        public List<ErcotMonthDTO> Ercot1(ErcotQueryDTO queryParam)
        {
            List<ErcotMonthDTO> datas = new List<ErcotMonthDTO>();
            var xmlModel = queryParam.GetXmlModel();
            // var months = queryParam.Month;
            var procedureName = "[WebSite].[ErcotLoadAnimateFilteredGetInfo]";
            //var a = GetDataForAllMonths(xmlModel);

            var months = queryParam.GetMonths();
            var order = 1;

            foreach (var m in months)
            {
                var monthData = new ErcotMonthDTO { order = order };

                using (IDbConnection conn = new SqlConnection(_connectionString))
                {
                    var xml = queryParam.GetXmlModel();
                    xml.MonthsString = $"<Row><MN>{m}</MN></Row>";
                    var data = conn.Query<ErcotDTO>(procedureName,
                    xml,
                        commandType: CommandType.StoredProcedure).AsList();
                    data.ForEach(x => RoundTempAndErcotLoad(x));
                    monthData.data = data;
                }
                datas.Add(monthData);
                order++;
            }
            return datas;
        }
        private string[] ParseMonthsNumbers(ErcotQueryDTO queryParam)
        {
            return queryParam.GetMonths();
        }

    }
}
