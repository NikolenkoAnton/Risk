using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.Models.Graphs;

namespace RiskDeskDev
{
    public class HourlyScalarService : IHourlyScalarService
    {
        private readonly string ConnectionString;// = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";
        public HourlyScalarService(IConfiguration config)
        {
            ConnectionString = config.GetConnectionString("Develop");
        }
        public IEnumerable<HourlyScalarDTO> HourlyScalarData(string Month, string Zone, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<HourlyScalarDTO> graphs = new List<HourlyScalarDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[HourlyScalarFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProc(cmd, Month, Zone, WholeSales, AccNumbers);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                    foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                    {
                        SelectionItems.Add(dr.ItemArray
                     );
                    }
                }
            }
            foreach (var rec in SelectionItems)
            {
                HourlyScalarDTO record = new HourlyScalarDTO
                {
                    WholeSaleID = rec[0].ToString(),
                    Hour = rec[2].ToString(),
                    ubar = Math.Round(Convert.ToDouble(rec[4]) * 100) / 100,
                    sigmau = Math.Round(Convert.ToDouble(rec[4]) * 100) / 100
                };
                graphs.Add(record);
            }




            return graphs;
        }

        private void AddProc(SqlCommand cmd, string Month, string Zone, string WholeSales, string AccNumbers)
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
