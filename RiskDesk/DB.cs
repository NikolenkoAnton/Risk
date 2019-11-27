using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Web;
//Blob Storage 
using System.Globalization;
using RiskDeskDev.Models;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.Models.Graphs;
using System.Data;
using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore;


namespace RiskDeskDev
{
    public class DB : IDB
    {
        private readonly string ConnectionString;//"Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";

        public DB(IConfiguration configuration)
        {

            ConnectionString = configuration.GetConnectionString("Develop");
        }


        public IEnumerable<HourlyDTO> getHourlyGraph(string StartDate, string EndDate, string Month, string Scenario, string WholeSales, string AccNumbers)
        {
            IEnumerable<HourlyRecordDTO> records = getHourlyGraphRecords(StartDate, EndDate, Month, Scenario, WholeSales, AccNumbers);
            List<HourlyDTO> data = new List<HourlyDTO>();

            var query = from rec in records
                        group rec by rec.Date;

            foreach (var g in query)
            {
                HourlyDTO graph = new HourlyDTO { date = g.Key };

                foreach (var t in g)
                    graph.setLoad(t.ScenarioID, t.TotalLoad);

                data.Add(graph);
            }
            return data;
        }


        private IEnumerable<HourlyRecordDTO> getHourlyGraphRecords(string StartDate, string EndDate, string Month, string Scenario, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<HourlyRecordDTO> records = new List<HourlyRecordDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[WeatherHourlyFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;

                    AddProceduresParametrsMontlyGraphs(cmd, Month, Scenario, WholeSales, AccNumbers);
                    AddProceduresParametrsMontlyHourlyGraphs(cmd, StartDate, EndDate);

                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }

                    foreach (DataRow row in ds.Tables["SelectionItems"].Rows)
                    {
                        HourlyRecordDTO record = new HourlyRecordDTO
                        {
                            MonthID = row[0].ToString(),
                            ScenarioID = row[3].ToString(),
                            Date = Convert.ToDateTime(row[5].ToString().Split(' ')[0]),
                            TotalLoad = Convert.ToDouble(row[6])
                        };
                        records.Add(record);
                    }
                    return records;
                }
            }
        }
        public List<MonthDTO> getAllMonth()
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<MonthDTO> monthes = new List<MonthDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[MonthsGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {

                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }

            foreach (var month in SelectionItems)
            {
                monthes.Add(new MonthDTO { Name = month[2].ToString() });
            }
            return monthes;
        }

        public List<ScenarioDTO> getAllScenario()
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<ScenarioDTO> scenarios = new List<ScenarioDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[WeatherScenarioAllGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            foreach (var scen in SelectionItems)
            {
                scenarios.Add(new ScenarioDTO { Name = scen[1].ToString() });
            }
            return scenarios;
        }

        private void AddProceduresParametrsMontlyHourlyGraphs(SqlCommand cmd, string StartDate, string EndDate)
        {
            var date = new string[1];
            if (StartDate != "0")
            {
                date = StartDate.Split('/');
                DateTime time1 = Convert.ToDateTime($"{date[1]}/{date[0]}/{date[2]}");
                cmd.Parameters.AddWithValue("@StartDate", time1);
            }
            if (EndDate != "0")
            {
                date = EndDate.Split('/');
                DateTime time2 = Convert.ToDateTime($"{date[1]}/{date[0]}/{date[2]}");
                cmd.Parameters.AddWithValue("@EndDate", time2);
            }
        }
        private void AddProceduresParametrsMontlyGraphs(SqlCommand cmd, string Month, string Scenario, string WholeSales, string AccNumbers)
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
        public List<MonthlyDTO> GetMontlyGraphs(string Month, string Zone, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<MonthlyDTO> graphs = new List<MonthlyDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[MonthlyFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProc(cmd, Month, Zone, WholeSales, AccNumbers);
                    cmd.Connection = con;
                    cmd.Connection = con;
                    cmd.Connection = con;







                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            string[] monthArray = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
            foreach (var month in monthArray)
            {
                MonthlyDTO monthly = new MonthlyDTO();
                monthly.MonthName = month;
                foreach (var record in SelectionItems)
                {
                    if (record[4].ToString() == monthly.MonthName)
                    {


                        string scenario = record[0].ToString();
                        double values = Math.Round(Convert.ToDouble(record[5]) * 100) / 100;
                        switch (scenario)
                        {
                            case "1":
                                monthly.firstBlock = values;
                                break;
                            case "2":
                                monthly.secondBlock = values;
                                break;
                            case "3":
                                monthly.thirdBlock = values;
                                break;
                        }
                    }

                }
                graphs.Add(monthly);
            }
            return graphs;
        }
        public List<MontlyGraphDTO> GetWeatherMontlyGraphs(string Month, string Scenario, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<MontlyGraphDTO> graphs = new List<MontlyGraphDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[WeatherMonthlyFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProceduresParametrsMontlyGraphs(cmd, Month, Scenario, WholeSales, AccNumbers);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            string[] monthArray = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
            foreach (var month in monthArray)
            {
                MontlyGraphDTO monthly = new MontlyGraphDTO();
                monthly.MonthName = month;
                foreach (var record in SelectionItems)
                {
                    string recordMonth = record[2].ToString();

                    if (recordMonth == month)
                    {
                        string scenario = record[4].ToString();
                        double values = Math.Round(Convert.ToDouble(record[5]) * 100) / 100;
                        switch (scenario)
                        {
                            case "avg":
                                monthly.avg = values;
                                break;
                            case "mild":
                                monthly.mild = values;
                                break;
                            case "xtreme":
                                monthly.xtreme = values;
                                break;
                        }
                    }
                }
                graphs.Add(monthly);
            }
            return graphs;
        }


        private void AddProceduresParametrsGraphs(SqlCommand cmd, string Zone, string WholeSales, string AccNumbers)
        {
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

        public List<AccIdGraphDTO> GetAccIdGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<AccIdGraphDTO> graphs = new List<AccIdGraphDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[AggregratesFilteredByUtilityAccountNumberGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProceduresParametrsGraphs(cmd, Zone, WholeSales, AccNumbers);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            foreach (var a in SelectionItems)
            {
                string AccNumber = a[1].ToString();
                double Percentage = Math.Round(Convert.ToDouble(a[2]));
                double Retail = Math.Round(Convert.ToDouble(a[7]) * 1000) / 10;
                double Revat = Math.Round(Convert.ToDouble(a[8]) * 1000) / 10;
                graphs.Add(new AccIdGraphDTO
                {
                    AccNumber = AccNumber,
                    Percentage = Percentage,
                    RetailRiskAdder = Retail,
                    RevatRisk = Revat
                });
            }
            return graphs;
        }

        public List<CongestZoneGraphDTO> GetCongestZoneGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<CongestZoneGraphDTO> graphs = new List<CongestZoneGraphDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[AggregratesFilteredByCongestionZoneGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;

                    AddProceduresParametrsGraphs(cmd, Zone, WholeSales, AccNumbers);

                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            foreach (var a in SelectionItems)
            {
                string Zone1 = a[1].ToString();
                double Percentage = Math.Round(Convert.ToDouble(a[2]));
                graphs.Add(new CongestZoneGraphDTO
                {
                    Zone = Zone1,
                    Percentage = Percentage
                });
            }
            return graphs;
        }

        public List<WholeSalesGraphDTO> GetWholeSalesGraphs(string Zone, string WholeSales, string AccNumbers)
        {
            DataSet ds = new DataSet();
            List<object[]> SelectionItems = new List<object[]>();
            List<WholeSalesGraphDTO> graphs = new List<WholeSalesGraphDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[AggregratesFilteredByWholeSaleBlockGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProceduresParametrsGraphs(cmd, Zone, WholeSales, AccNumbers);

                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(dr.ItemArray
                         );

                        }
                    }
                }
            }
            foreach (var a in SelectionItems)
            {
                string Block = a[1].ToString();
                double Percentage = Math.Round(Convert.ToDouble(a[2]));
                graphs.Add(new WholeSalesGraphDTO
                {
                    Block = Block,
                    Percentage = Percentage
                });
            }
            return graphs;
        }
        public List<AccNumberDTO> GetAllAccNumber()
        {
            DataSet ds = new DataSet();
            List<AccNumberDTO> SelectionItems = new List<AccNumberDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[UtilityAccountNumbersAllGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(new AccNumberDTO
                            {
                                AccNumber = dr[1].ToString()
                            }
                          );
                        }
                    }
                }
            }
            return SelectionItems;
        }

        public List<CongestionZoneDTO> GetAllCongestionZone()
        {
            DataSet ds = new DataSet();
            List<CongestionZoneDTO> SelectionItems = new List<CongestionZoneDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[CongestionZonesAllGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(new CongestionZoneDTO
                            {
                                Zone = dr[1].ToString()
                            });
                        }
                    }
                }
            }
            return SelectionItems;

        }
        public List<WholeSalesDTO> GetAllWholeSalesBlock()
        {
            DataSet ds = new DataSet();
            List<WholeSalesDTO> SelectionItems = new List<WholeSalesDTO>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[WholeSaleBlocksAllGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(new WholeSalesDTO
                            {
                                Block = dr[1].ToString()
                            });
                        }
                    }
                }
            }
            return SelectionItems;
        }
        public List<FacilityInfo> UpdateFacilities(FacilitiesUpdateDTO facilities)
        {
            foreach (var facility in facilities.facilities)
            {
                UpdateCustomerFacility(facility.CustomerId, facility.AccNumber);
            }
            return GetFacilitiesInfo();
        }
        public void UpdateCustomerFacility(int customerId, string utilityAccNum)
        {
            DataSet ds = new DataSet();

            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[CustomerIDFacilityUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CustomerID", customerId);
                    cmd.Parameters.AddWithValue("@UtilityAccountNumber", utilityAccNum);

                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
        }
        public List<FacilityInfo> GetFacilitiesInfo()
        {
            DataSet ds = new DataSet();
            List<FacilityInfo> SelectionItems = new List<FacilityInfo>();

            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[AllFacilityGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(new FacilityInfo
                            {
                                CustomerId = Int32.Parse(dr["customerid"].ToString()),
                                CustomerName = dr["CustomerName"].ToString(),
                                AccNumber = dr["UtilityAccountNumber"].ToString()

                            });
                        }
                    }
                }
            }
            return SelectionItems;

        }
        public List<CustomerInfo> GetCustomersInfo()
        {
            DataSet ds = new DataSet();
            List<CustomerInfo> SelectionItems = new List<CustomerInfo>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[AllCustomersGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItems.Add(new CustomerInfo
                            {
                                Id = Int32.Parse(dr["customerid"].ToString()),
                                Name = dr["customername"].ToString()

                            });
                        }
                    }
                }
            }
            return SelectionItems;

        }
        public User CreateUser(User data)
        {

            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[UserNameInsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FirstName", data.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", data.LastName);
                    cmd.Parameters.AddWithValue("@UserName", data.UserName);
                    cmd.Parameters.AddWithValue("@Email", data.Email);
                    cmd.Parameters.AddWithValue("@PSW", data.Password);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }

            return data;
        }

        public User getUser(string userName)
        {

            DataSet ds = new DataSet();
            User u = new User();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[UserNameGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;

                    cmd.Parameters.AddWithValue("@UserName", userName);

                    cmd.Connection = con;
                    con.Open();
                    var a = cmd.ExecuteReader();
                    while (a.Read())
                    {
                        u.UserName = a[0].ToString();
                        u.FirstName = a[1].ToString();
                        u.LastName = a[2].ToString();
                        u.Password = a[4].ToString();
                        u.Email = a[3].ToString();
                    }
                }
            }
            return u;
        }
        public List<GenericInfo> GenericFileGetInfoByRows(String FileName, String FileTypeName, int page)
        {
            int StartRow = 50 * (page - 1) + 1;
            int EndRow = page * 50;

            List<GenericInfo> SelectionItemsinfo = new List<GenericInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidationByRowsGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@FileType", FileTypeName);
                    cmd.Parameters.AddWithValue("@StartRow", StartRow);
                    cmd.Parameters.AddWithValue("@EndRow", EndRow);

                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo.Add(new GenericInfo
                            {
                                ValidateID = Convert.ToInt32(dr["ValidateId"].ToString()),
                                FileID = Convert.ToInt32(dr["FileID"].ToString()),
                                FileName = dr["FileName"].ToString(),
                                Field1 = dr["Field1"].ToString(),
                                Field2 = dr["Field2"].ToString(),
                                Field3 = dr["Field3"].ToString(),
                                Field4 = dr["Field4"].ToString(),
                                Field5 = dr["Field5"].ToString(),
                                Field6 = dr["Field6"].ToString(),
                                Field7 = dr["Field7"].ToString(),
                                Field8 = dr["Field8"].ToString(),
                                Field9 = dr["Field9"].ToString(),
                                Field10 = dr["Field10"].ToString(),
                                Field11 = dr["Field11"].ToString(),
                                Field12 = dr["Field12"].ToString(),
                                Field13 = dr["Field13"].ToString(),
                                Field14 = dr["Field14"].ToString(),
                                Field15 = dr["Field15"].ToString(),
                                Field16 = dr["Field16"].ToString(),
                                Field17 = dr["Field17"].ToString(),
                                Field18 = dr["Field18"].ToString(),
                                Field19 = dr["Field19"].ToString(),
                                Field20 = dr["Field20"].ToString(),
                                Field21 = dr["Field21"].ToString(),
                                Field22 = dr["Field22"].ToString(),
                                Field23 = dr["Field23"].ToString(),
                                Field24 = dr["Field24"].ToString(),
                                Field25 = dr["Field25"].ToString(),
                                Field26 = dr["Field26"].ToString(),
                                Field27 = dr["Field27"].ToString(),
                                Field28 = dr["Field28"].ToString(),
                                Field29 = dr["Field29"].ToString(),
                                Field30 = dr["Field30"].ToString(),
                            });
                        }
                    }
                }
            }
            return SelectionItemsinfo;
        }
        public List<GenericInfo> GenericFileGetInfo(String FileName, String FileTypeName, String ContainerName, int RowNumber)
        {

            List<GenericInfo> SelectionItemsinfo = new List<GenericInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidationGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@FileType", FileTypeName);
                    cmd.Parameters.AddWithValue("@RowCount", RowNumber);
                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo.Add(new GenericInfo
                            {
                                ValidateID = Convert.ToInt32(dr["ValidateId"].ToString()),
                                FileID = Convert.ToInt32(dr["FileID"].ToString()),
                                FileName = dr["FileName"].ToString(),
                                Field1 = dr["Field1"].ToString(),
                                Field2 = dr["Field2"].ToString(),
                                Field3 = dr["Field3"].ToString(),
                                Field4 = dr["Field4"].ToString(),
                                Field5 = dr["Field5"].ToString(),
                                Field6 = dr["Field6"].ToString(),
                                Field7 = dr["Field7"].ToString(),
                                Field8 = dr["Field8"].ToString(),
                                Field9 = dr["Field9"].ToString(),
                                Field10 = dr["Field10"].ToString(),
                                Field11 = dr["Field11"].ToString(),
                                Field12 = dr["Field12"].ToString(),
                                Field13 = dr["Field13"].ToString(),
                                Field14 = dr["Field14"].ToString(),
                                Field15 = dr["Field15"].ToString(),
                                Field16 = dr["Field16"].ToString(),
                                Field17 = dr["Field17"].ToString(),
                                Field18 = dr["Field18"].ToString(),
                                Field19 = dr["Field19"].ToString(),
                                Field20 = dr["Field20"].ToString(),
                                Field21 = dr["Field21"].ToString(),
                                Field22 = dr["Field22"].ToString(),
                                Field23 = dr["Field23"].ToString(),
                                Field24 = dr["Field24"].ToString(),
                                Field25 = dr["Field25"].ToString(),
                                Field26 = dr["Field26"].ToString(),
                                Field27 = dr["Field27"].ToString(),
                                Field28 = dr["Field28"].ToString(),
                                Field29 = dr["Field29"].ToString(),
                                Field30 = dr["Field30"].ToString(),
                            });
                        }
                    }
                }
            }
            return SelectionItemsinfo;
        }

        public string GenericUpsertDataToTable(TableUpdateDTO tabledata)
        {
            List<GenericInfo> SelectionItemsinfo = new List<GenericInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidatedDataUpsert]";

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProceduresParametrsUpsertData(cmd, tabledata);

                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            return "1";
        }
        public string GenericUpdateByRow(RowUpdateDTO rowdata)
        {

            List<GenericInfo> SelectionItemsinfo = new List<GenericInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidationByRowsUpsert]";

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProceduresParametrs(cmd, rowdata);

                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo.Add(new GenericInfo
                            {
                                ValidateID = Convert.ToInt32(dr["ValidateId"].ToString()),
                                FileID = Convert.ToInt32(dr["FileID"].ToString()),
                                FileName = dr["FileName"].ToString(),
                                Field1 = dr["Field1"].ToString(),
                                Field2 = dr["Field2"].ToString(),
                                Field3 = dr["Field3"].ToString(),
                                Field4 = dr["Field4"].ToString(),
                                Field5 = dr["Field5"].ToString(),
                                Field6 = dr["Field6"].ToString(),
                                Field7 = dr["Field7"].ToString(),
                                Field8 = dr["Field8"].ToString(),
                                Field9 = dr["Field9"].ToString(),
                                Field10 = dr["Field10"].ToString(),
                                Field11 = dr["Field11"].ToString(),
                                Field12 = dr["Field12"].ToString(),
                                Field13 = dr["Field13"].ToString(),
                                Field14 = dr["Field14"].ToString(),
                                Field15 = dr["Field15"].ToString(),
                                Field16 = dr["Field16"].ToString(),
                                Field17 = dr["Field17"].ToString(),
                                Field18 = dr["Field18"].ToString(),
                                Field19 = dr["Field19"].ToString(),
                                Field20 = dr["Field20"].ToString(),
                                Field21 = dr["Field21"].ToString(),
                                Field22 = dr["Field22"].ToString(),
                                Field23 = dr["Field23"].ToString(),
                                Field24 = dr["Field24"].ToString(),
                                Field25 = dr["Field25"].ToString(),
                                Field26 = dr["Field26"].ToString(),
                                Field27 = dr["Field27"].ToString(),
                                Field28 = dr["Field28"].ToString(),
                                Field29 = dr["Field29"].ToString(),
                                Field30 = dr["Field30"].ToString(),
                            });
                        }
                    }
                }
            }
            return "1";
        }

        private void AddProceduresParametrs(SqlCommand cmd, RowUpdateDTO rowdata)
        {
            cmd.Parameters.AddWithValue("@FileName", rowdata.fileName);
            cmd.Parameters.AddWithValue("@FileType", rowdata.fileType);
            cmd.Parameters.AddWithValue("@ValidationID", rowdata.validateId);
            for (int i = 0; i < rowdata.fieldArr.Length; i++)
            {
                int num = i + 1;
                string param = "Field" + num;
                string value = rowdata.fieldArr[i];
                cmd.Parameters.AddWithValue(param, value);
            }

        }
        private void AddProceduresParametrsUpsertData(SqlCommand cmd, TableUpdateDTO tabledata)
        {
            cmd.Parameters.AddWithValue("@FileName", tabledata.FileName);
            cmd.Parameters.AddWithValue("@InformationType", tabledata.InformationType);
            cmd.Parameters.AddWithValue("@FirstRowOfData", tabledata.FirstRowOfData);
            for (int i = 0; i < tabledata.FieldArr.Length; i++)
            {
                string value = tabledata.FieldArr[i];
                if (String.Compare(value, "Not Selected") != 0)
                {
                    int num = i + 1;
                    string param = "Field" + num;
                    cmd.Parameters.AddWithValue(param, value);
                }
            }
        }
        public List<GenericInfo> GetBadRows(string FileName, string InformationType, int FirstLineOfData, string Field1, String Field2, String Field3, String Field4, String Field5, String Field6, String Field7, String Field8, String Field9, string Field10, string Field11, string Field12)
        {
            List<GenericInfo> SelectionItemsinfo = new List<GenericInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    String SqlCommandText = "[WebSite].[GenericValidationReturnBadRowsGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@InformationType", InformationType);
                    cmd.Parameters.AddWithValue("@FirstRowOfData", FirstLineOfData);
                    cmd.Parameters.AddWithValue("@Field1", Field1);
                    cmd.Parameters.AddWithValue("@Field2", Field2);
                    cmd.Parameters.AddWithValue("@Field3", Field3);
                    cmd.Parameters.AddWithValue("@Field4", Field4);
                    cmd.Parameters.AddWithValue("@Field5", Field5);
                    cmd.Parameters.AddWithValue("@Field6", Field6);
                    cmd.Parameters.AddWithValue("@Field7", Field7);
                    cmd.Parameters.AddWithValue("@Field8", Field8);
                    cmd.Parameters.AddWithValue("@Field9", Field9);
                    cmd.Parameters.AddWithValue("@Field10", Field10);
                    cmd.Parameters.AddWithValue("@Field11", Field9);
                    cmd.Parameters.AddWithValue("@Field12", Field10);
                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo.Add(new GenericInfo
                            {
                                ValidateID = Convert.ToInt32(dr["ValidateId"].ToString()),
                                FileID = Convert.ToInt32(dr["FileID"].ToString()),
                                FileName = dr["FileName"].ToString(),
                                Field1 = dr["Field1"].ToString(),
                                Field2 = dr["Field2"].ToString(),
                                Field3 = dr["Field3"].ToString(),
                                Field4 = dr["Field4"].ToString(),
                                Field5 = dr["Field5"].ToString(),
                                Field6 = dr["Field6"].ToString(),
                                Field7 = dr["Field7"].ToString(),
                                Field8 = dr["Field8"].ToString(),
                                Field9 = dr["Field9"].ToString(),
                                Field10 = dr["Field10"].ToString(),
                                Field11 = dr["Field11"].ToString(),
                                Field12 = dr["Field12"].ToString(),
                                Field13 = dr["Field13"].ToString(),
                                Field14 = dr["Field14"].ToString(),
                                Field15 = dr["Field15"].ToString(),
                                Field16 = dr["Field16"].ToString(),
                                Field17 = dr["Field17"].ToString(),
                                Field18 = dr["Field18"].ToString(),
                                Field19 = dr["Field19"].ToString(),
                                Field20 = dr["Field20"].ToString(),
                                Field21 = dr["Field21"].ToString(),
                                Field22 = dr["Field22"].ToString(),
                                Field23 = dr["Field23"].ToString(),
                                Field24 = dr["Field24"].ToString(),
                                Field25 = dr["Field25"].ToString(),
                                Field26 = dr["Field26"].ToString(),
                                Field27 = dr["Field27"].ToString(),
                                Field28 = dr["Field28"].ToString(),
                                Field29 = dr["Field29"].ToString(),
                                Field30 = dr["Field30"].ToString(),
                            });
                        }
                    }
                }
            }
            return SelectionItemsinfo;

        }
        public List<InformationTypeInfo> GenericValidationFieldsGetInfo(String InformationType)
        {

            List<InformationTypeInfo> SelectionItemsinfo = new List<InformationTypeInfo>();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidationFieldsGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@InformationType", InformationType);
                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo.Add(new InformationTypeInfo
                            {
                                InformationType = dr["InformationType"].ToString(),
                                InformationFields = dr["InformationFields"].ToString(),
                            });
                        }
                    }
                }
            }
            return SelectionItemsinfo;
        }


        public int FileUpsert(int FileID, String FileName, String FileStatus, String FileType, String UserName)
        {

            int SelectionItemsinfo = new int();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[FileUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileID", FileID);
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@FileStatus", FileStatus);
                    cmd.Parameters.AddWithValue("@FileType", FileType);
                    cmd.Parameters.AddWithValue("@UserName", UserName);
                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            if (ds != null)
            {
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables["SelectionItems"].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables["SelectionItems"].Rows)
                        {
                            SelectionItemsinfo = Convert.ToInt32(dr["ReturnValue"]);
                        }
                    }
                }
            }
            return SelectionItemsinfo;
        }
    }
}

