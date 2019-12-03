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
            var procedureName = "[WebSite].[ErcotLoadAnimateFilteredGetInfo]";
            //var a = GetDataForAllMonths(xmlModel);
            return _ercotRep.GetGraphData<ErcotXMLDTO>(xmlModel, procedureName);
        }
        private string[] ParseMonthsNumbers(ErcotQueryDTO queryParam)
        {
            return queryParam.GetMonths();
        }
        private List<ErcotDTO>[] GetDataForAnimation(ErcotXMLDTO xmlModel)
        {
            var procedureName = "[WebSite].[ErcotLoadAnimateFilteredGetInfo]";
            List<ErcotDTO>[] listOfdata = new List<ErcotDTO>[12];
            for (int i = 0; i < 2; i++)
            {

                var model = new ErcotXMLDTO
                {
                    UtilityAccountNumberString = xmlModel.UtilityAccountNumberString,
                    HoursString = xmlModel.HoursString,
                    CongestionZoneString = xmlModel.CongestionZoneString,
                    WholeBlockString = xmlModel.WholeBlockString,
                    MonthsString = $"<Row><MN>{i}</MN></Row>",
                    //TODO
                    //MonthsString = xmlModel.MonthsString + $"<Row><MN>{i}</MN></Row>" 
                };
                var newData = _ercotRep.GetGraphData<ErcotXMLDTO>(xmlModel, procedureName);
                listOfdata[i] = newData;
            };

            //     await Task.Run(() =>
            //    {
            //        var model = new ErcotXMLDTO
            //        {
            //            UtilityAccountNumberString = xmlModel.UtilityAccountNumberString,
            //            HoursString = xmlModel.HoursString,
            //            CongestionZoneString = xmlModel.CongestionZoneString,
            //            WholeBlockString = xmlModel.WholeBlockString,
            //            MonthsString = $"<Row><MN>{i}</MN></Row>",
            //            //TODO
            //            //MonthsString = xmlModel.MonthsString + $"<Row><MN>{i}</MN></Row>" 
            //        };
            //        var newData = _ercotRep.GetGraphData<ErcotXMLDTO>(xmlModel, procedureName);
            //        listOfdata[i] = newData;
            //    });
            // foreach (var t in tasks) t.Start();
            return listOfdata;
        }
    }
}