﻿using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDeskDev.GraphsBLL.DTO;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.Services
{
    public class MapePeakService : IMapePeakService
    {
        private readonly string ConnectionString;// = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";

        private readonly IDropdownService _dropService;

        public MapePeakService(IConfiguration configuration, IDropdownService dropdownService)
        {
            _dropService = dropdownService;
            ConnectionString = configuration.GetConnectionString("Develop");
        }

        public DropsPeak DropsPeak()//month, scenario, accnumbers
        {

            return new DropsPeak
            {
                numbers = _dropService.GetData<AccountNumber>(new AccountNumber()).Select(acc => new AccNumberDTO { AccNumber = acc.UtilityAccountNumber, AccNumberId = acc.UtilityAccountNumberId.ToString() }).ToList(),//db.GetAllAccNumber(),
                months = _dropService.GetData<Month>(new Month())
                                                .Where(month => month.MonthsLongName != "All" && month.MonthsNamesID != "0")
                                                .Select(z =>
                                                            new MonthDTO
                                                            {
                                                                Name = z.MonthsLongName,
                                                                ShortName = z.MonthsShortName,
                                                                Id = z.EntityId()
                                                            })
                                                .ToList(),
                scenarios = _dropService.GetData<WeatherScenar>(new WeatherScenar()).Select(z => new ScenarioDTO { Name = z.WeatherScenario, Id = z.EntityId() }).ToList()
            };
        }

        public async Task<Peak> DataPeak(string Month, string Scenario, string AccNumbers)
        {
            List<PeakGraph> graphs = new List<PeakGraph>();
            List<PeakTable> tables = new List<PeakTable>();

            string[] arr = new string[] { Month, Scenario, AccNumbers };

            DataSet set = await Task.Run(() => DataBaseConnection("CoincidencePeakGetInfo", arr));

            DataRowCollection graphCol = set.Tables["SelectionItems"].Rows;

            DataRowCollection tableCol = set.Tables["SelectionItems1"].Rows;


            Task graphTask = new Task(() =>
            {
                foreach (DataRow row in graphCol)
                {
                    PeakGraph graph = new PeakGraph
                    {
                        month = row[1].ToString(),
                        cp = Math.Round(Convert.ToDouble(row[4]), 2),
                        ncp = Math.Round(Convert.ToDouble(row[5]), 2),
                    };
                    graphs.Add(graph);

                }
            });

            Task tableTask = new Task(() =>
            {

                var query = from rec in tableCol.Cast<DataRow>()
                            group rec by rec[0];
                foreach (var g in query)
                {
                    PeakTable graph = new PeakTable { acc = g.Key.ToString() };

                    foreach (var t in g)
                        graph.SetLoad(Convert.ToInt32(t[1]) - 1, t[5], t[6], t[7]);

                    tables.Add(graph);
                }

            });

            Task[] tasks = new Task[2]
            {
                graphTask,
                tableTask
            };
            tasks[0].Start();
            tasks[1].Start();
            Task.WaitAll(tasks);

            return new Peak
            {
                graphs = graphs,
                tables = tables
            };
        }
        private DataSet DataBaseConnection(string procedureName, params string[] parametrs)
        {
            DataSet set = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = $"[WebSite].[{procedureName}]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;

                    if (procedureName.Contains("Peak")) AddProcedureParametrsPeak(cmd, parametrs[0], parametrs[1], parametrs[2]);
                    else AddProcedureParametrsMape(cmd, parametrs[0], parametrs[1], parametrs[2]);

                    //AddProceduresParametrsMontlyGraphs(cmd, month, scenario, "0", numbers);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set, "SelectionItems");
                    }
                    return set;
                }
            }
        }
        private void AddProcedureParametrsPeak(SqlCommand cmd, string Month, string Scenario, string AccNumbers)
        {
            if (Month != "0")
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
            if (Scenario != "0")
            {
                string param = "";
                for (int i = 0; i < Scenario.Length; i++)
                {
                    param += $"<Row><WS>{Scenario[i]}</WS></Row>";
                }
                cmd.Parameters.AddWithValue("@WeatherScenarioString", param);

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
        }

        private void AddProcedureParametrsMape(SqlCommand cmd, string Month, string WholeSales, string AccNumbers)
        {


            if (Month != "0")
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

            if (WholeSales != "0")
            {
                string param = "";
                for (int i = 0; i < WholeSales.Length; i++)
                {
                    param += $"<Row><WH>{WholeSales[i]}</WH></Row>";
                }
                cmd.Parameters.AddWithValue("@WholeBlockString", param);

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
        }

    }
}
