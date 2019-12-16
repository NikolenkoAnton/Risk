using Microsoft.AspNetCore.Mvc;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;
using Microsoft.Extensions.Configuration;
using System.Data;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL;
using System.Linq;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDesk.GraphsBLL.XmlDTO;
using Dapper;

namespace RiskDeskDev.GraphsBLL.Services
{
    public class RiskService : IRiskService
    {

        private readonly string _connectionString;
        private readonly IDropdownService _dropService;
        private readonly IDB db;
        private readonly IXMLService _xmlService;
        public RiskService(IDB db, IConfiguration configuration, IDropdownService dropService, IXMLService xmlService)
        {

            _dropService = dropService;
            _xmlService = xmlService;
            _connectionString = configuration.GetConnectionString("Develop");
            this.db = db;
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

        public List<RiskDataDTO> RiskData(string Month, string Zone, string AccNumbers)
        {

            DataTable table = new DataTable();
            List<RiskDataDTO> records = new List<RiskDataDTO>();
            List<object[]> SelectionItems = new List<object[]>();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[RiskFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProc(cmd, Month, Zone, AccNumbers);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(table);
                    }
                }
            }

            foreach (DataRow rec in table.Rows)
            {
                records.Add(new RiskDataDTO
                {
                    month = rec[2].ToString(),
                    shortMonth = rec[1].ToString(),
                    adder = Math.Round(Convert.ToDouble(rec[3]), 2),
                    norm = Math.Round(Convert.ToDouble(rec[4]), 2)
                });
            }
            return records;
        }

        public RiskDropDTO RiskDropsData()
        {
            return new RiskDropDTO
            {
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
                numbers = _dropService.GetData<AccountNumber>(new AccountNumber()).Select(acc => new AccNumberDTO { AccNumber = acc.UtilityAccountNumber, AccNumberId = acc.UtilityAccountNumberId.ToString() }).ToList(),//db.GetAllAccNumber(),
                zones = _dropService.GetData<CongestionZone>(new CongestionZone()).Select(z => new CongestionZoneDTO { Zone = z.CongestionZones, Id = z.EntityId() }).ToList()
            };
        }

        private void AddProc(SqlCommand cmd, string Month, string Zone, string AccNumbers)
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
        }

    }

    public class RiskDataDTO
    {
        public string shortMonth;
        public string month;

        public double adder;

        public double norm;
    }
    public class RiskDropDTO
    {
        public IEnumerable<MonthDTO> months { get; set; }

        public IEnumerable<CongestionZoneDTO> zones { get; set; }
        public IEnumerable<AccNumberDTO> numbers { get; set; }

    }
}
