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

namespace RiskDeskDev.GraphsBLL.Services
{
    public class RiskService : IRiskService
    {

        private readonly string ConnectionString = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";
        private readonly IDropdownService _dropService;
        private readonly IDB db;
        public RiskService(IDB db, IConfiguration conf, IDropdownService dropService)
        {

            _dropService = dropService;
            this.db = db;
        }
        public List<RiskDataDTO> RiskData(string Month, string Zone, string AccNumbers)
        {

            DataTable table = new DataTable();
            List<RiskDataDTO> records = new List<RiskDataDTO>();
            List<object[]> SelectionItems = new List<object[]>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
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
