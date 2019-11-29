using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDeskDev.Web.GraphsBLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Web.GraphsBLL.Services
{
    public class ScatterPlotService : IScatterPlotService
    {
        private readonly string _connectionString;

        public ScatterPlotService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Develop");
        }

        public List<ScatterPlotDTO> ScatterPlotData(string Hours, string Month, string Zone, string WholeSales, string AccNumbers)
        {
            using (IDbConnection conn = new SqlConnection(_connectionString))

            {
                var xmlModel = GetXMLModelForProcedure(Hours, Month, Zone, WholeSales, AccNumbers);
                var data = conn.Query<ScatterPlotDTO>("[WebSite].[ScatterPlotFilteredGetInfo]",
                xmlModel,
                    commandType: CommandType.StoredProcedure).ToList();
                return data;
            }

        }

        /*
        @WholeBlockString VARCHAR(8000) = NULL
        Weather Scenario Selections:  @WeatherScenarioString VARCHAR(8000)= NULL
        Utility Account Numbers:  @UtilityAccountNumberString  VARCHAR(8000) = NULL
        Months:   @MonthsString VARCHAR(8000) = NULL
        Months:   @HoursString VARCHAR(8000) = NULL
        */

        private ScatterPlotXMLModel GetXMLModelForProcedure(string Hours, string Month, string Zone, string WholeSales, string AccNumbers)
        {
            var model = new ScatterPlotXMLModel
            {
                WholeBlockString = GetXMLWholeSales(WholeSales),
                CongestionZoneString = GetXMLZones(Zone),
                UtilityAccountNumberString = GetXMLAccNumbers(AccNumbers),
                MonthsString = GetXMLMonths(Month),
                HoursString = GetXMLHours(Hours),
            };

            return model;

        }
        private string GetXMLZones(string Zone)
        {
            var result = "";

            if (Zone != "0")
            {
                for (int i = 0; i < Zone.Length; i++)
                {
                    result += $"<Row><CZ>{Zone[i]}</CZ></Row>";
                }

            }
            return result == "" ? null : result;
        }
        private string GetXMLHours(string hours)
        {
            var result = "";
            //<Row><HR>1</HR></Row><Row><HR>2</HR></Row>
            var hoursArray = hours.Split("h");
            foreach (var h in hoursArray)
            {
                result += $"<Row><HR>{h}</HR></Row>";
            }
            return (result == "" || hours == "0") ? null : result;

        }
        private string GetXMLMonths(string Month)
        {
            string param = "";

            if (Month != "0")
            {
                for (int i = 0; i < Month.Length; i++)
                {
                    char monthValue = Month[i];

                    string value;

                    switch (monthValue)
                    {
                        case 'O':
                            value = "10";
                            break;
                        case 'N':
                            value = "11";
                            break;
                        case 'D':
                            value = "12";
                            break;

                        default:
                            value = monthValue.ToString();
                            break;
                    }

                    param += $"<Row><MN>{value}</MN></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLScenario(string Scenario)
        {
            string param = "";

            if (Scenario != "0")
            {
                for (int i = 0; i < Scenario.Length; i++)
                {
                    param += $"<Row><WS>{Scenario[i]}</WS></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLWholeSales(string WholeSales)
        {
            string param = "";

            if (WholeSales != "0")
            {
                for (int i = 0; i < WholeSales.Length; i++)
                {
                    param += $"<Row><WH>{WholeSales[i]}</WH></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLAccNumbers(string AccNumbers)
        {
            string param = "";

            if (AccNumbers != "0")
            {
                for (int i = 0; i < AccNumbers.Length; i++)
                {
                    param += $"<Row><UA>{AccNumbers[i]}</UA></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string ConvertAndConcatParamsToXmls(string Hours, string Month, string Scenario, string WholeSales, string AccNumbers)
        {
            var result = GetXMLHours(Hours) + GetXMLMonths(Month) + GetXMLScenario(Scenario) + GetXMLWholeSales(WholeSales) + GetXMLAccNumbers(AccNumbers);
            return result;
        }
        #region ParseToXML



        /* private string GetXMLParameters(IEnumerable<DealPartDataBase> Parts)
        {
            var rows = "";

            foreach(var p in Parts)
            {
                var row = $"<Row><Term>{ConvertDouble(p.Term)}</Term><BrokerFee>{ConvertDouble(p.BrokerFee)}</BrokerFee><DealMargin>{ConvertDouble(p.DealMargin)}</DealMargin><RiskPremium>{ConvertDouble(p.RiskPremium)}</RiskPremium></Row>";
                            
                rows += row;
            }
            return rows;

        }

         public DealInfoDTO DealPartsUpdate(int id, IEnumerable<DealPartDataBase> Parts)
        {
            var rows = GetXMLParameters(Parts);
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Execute("[WebSite].[WholesaleDealPartsUpsert]",new { DealID = id, UpsertString = rows}, commandType: CommandType.StoredProcedure);
            }
            object a = "asdas";
        
            return DealInfo(id);
            
        }
       */
        //Month
        /*if (Month != "0")
            {
                string param = "";
                for (int i = 0; i < Month.Length; i++)
                {
                    char monthValue = Month[i];

                    string value;

                    switch (monthValue)
                    {
                        case 'O':
                            value = "10";
                            break;
                        case 'N':
                            value = "11";
                            break;
                        case 'D':
                            value = "12";
                            break;

                        default:
                            value = monthValue.ToString();
                            break;
                    }

                    param += $"<Row><MN>{value}</MN></Row>";
                }
                cmd.Parameters.AddWithValue("@MonthsString", param);
            }

        Con Zone
            if (Zone != "0")
            {
                string param = "";
                for (int i = 0; i < Zone.Length; i++)
                {
                    param += $"<Row><CZ>{Zone[i]}</CZ></Row>";
                }
                cmd.Parameters.AddWithValue("@CongestionZoneString", param);

            }

            if (AccNumbers != "0")
            {
                string param = "";
                for (int i = 0; i < AccNumbers.Length; i++)
                {
                    param += $"<Row><UA>{AccNumbers[i]}</UA></Row>";
                }
                cmd.Parameters.AddWithValue("@UtilityAccountNumberString", param);

            }
             if (Scenario != "0")
            {
                string param = "";
                for (int i = 0; i < Scenario.Length; i++)
                {
                    param += $"<Row><WS>{Scenario[i]}</WS></Row>";
                }
                cmd.Parameters.AddWithValue("@WeatherScenarioString", param);

            }
            */
        #endregion

        #region GetWeatherScenario
        //public List<ScenarioDTO> getAllScenario()
        //{
        //    DataSet ds = new DataSet();
        //    List<object[]> SelectionItems = new List<object[]>();
        //    List<ScenarioDTO> scenarios = new List<ScenarioDTO>();
        //    using (SqlConnection con = new SqlConnection(ConnectionString))
        //    {

        //        using (SqlCommand cmd = new SqlCommand())
        //        {

        //            string SqlCommandText = "[WebSite].[WeatherScenarioAllGetInfo]";
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.CommandText = SqlCommandText;
        //            cmd.Connection = con;

        //            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //            {
        //                da.Fill(ds, "SelectionItems");
        //            }
        //        }
        //    }

        //    if (ds != null)
        //    {
        //        if (ds.Tables.Count > 0)
        //        {
        //            if (ds.Tables["SelectionItems"].Rows.Count > 0)
        //            {
        //                foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
        //                {
        //                    SelectionItems.Add(dr.ItemArray
        //                 );

        //                }
        //            }
        //        }
        //    }
        //    foreach (var scen in SelectionItems)
        //    {
        //        scenarios.Add(new ScenarioDTO { Name = scen[1].ToString() });
        //    }
        //    return scenarios;
        //}
        #endregion
    }
}
