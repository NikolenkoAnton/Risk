using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDeskDev.Controllers;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.Services
{


    public class DealService : IDealService
    {
        static string DealInfoKeys = "DealID,DealName,DealDate,CounterPartyID,SecondCounterPartyID,SetPointID,CongestionZonesID,WholeSaleBlocksID,VolumeMW,VolumeMWh,Price,Fee,Cost,MTM,GrossMargin,Calculated,CommitmentDate,Notes";

        static string[] DealSaveKeys = new string[] { "CongestionZonesID", "CounterPartyID", "DealDate", "DealID", "DealName", "EndDate", "Fee", "Notes", "Price", "SecondCounterPartyID", "SetPointID", "StartDate", "VolumeMW", "VolumeMWh", "WholeSaleBlocksID" };
        private readonly string ConnectionString;
        public DealService(IConfiguration configuration)
        {
            ConnectionString = configuration.GetConnectionString("Develop");//= "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";//= configuration["ConnectionString"];
        }
        #region graphs
        private void addProceduresParams(SqlCommand cmd, string Zone, string Counter, string WholeSales, string StartDate, string EndDate, string DealStart, string DealEnd)
        {
            if (WholeSales != "0")
            {
                string param = "";
                for (int i = 0; i < WholeSales.Length; i++)
                {
                    param += $"<Row><WH>{WholeSales[i]}</WH></Row>";
                }
                cmd.Parameters.AddWithValue("@WholeBlockString", param);

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
            if (Counter != "0")
            {
                string param = "";
                for (int i = 0; i < Zone.Length; i++)
                {
                    param += $"<Row><CT>{Counter[i]}</CT></Row>";
                }
                cmd.Parameters.AddWithValue("@CounterPartyString", param);

            }
            if (StartDate != "0")
            {
                string date = StartDate.Replace("W", ".");
                DateTime time = Convert.ToDateTime(date);
                cmd.Parameters.AddWithValue("@StartDate", time);
            }
            if (EndDate != "0")
            {
                string date = EndDate.Replace("W", ".");
                DateTime time = Convert.ToDateTime(date);
                cmd.Parameters.AddWithValue("@EndDate", time);
            }
            if (DealStart != "0")
            {
                string date = DealStart.Replace("W", ".");
                DateTime time = Convert.ToDateTime(date);
                cmd.Parameters.AddWithValue("@DealStartDate", time);
            }
            if (DealEnd != "0")
            {
                string date = DealEnd.Replace("W", ".");
                DateTime time = Convert.ToDateTime(date);
                cmd.Parameters.AddWithValue("@DealEndDate", time);
            }
        }
        private DataSet DataBaseConnection1(string Zone, string Counter, string WholeSales, string StartDate, string EndDate, string DealStart, string DealEnd)
        {
            DataSet set = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {



                    string SqlCommandText = "[WebSite].[DealEntryFilteredGetInfo]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    addProceduresParams(cmd, Zone, Counter, WholeSales, StartDate, EndDate, DealStart, DealEnd);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set);
                    }
                    return set;
                }
            }
        }
        private DataSet DataBaseConnection()
        {
            DataSet set = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = @"
                    SELECT [CongestionZonesID] as ZoneID, [CongestionZones] as ZoneName
                    FROM [BaseData].[CongestionZones]
                    GROUP BY [CongestionZonesID], [CongestionZones]
                    ORDER BY [CongestionZonesID]

                     SELECT [WholeSaleBlocksID] as BlockID, [WholeSaleBlocks] as BlockName
                    FROM [BaseData].[WholeSaleBlocks]
                    GROUP BY [WholeSaleBlocksID], [WholeSaleBlocks]
                    ORDER BY [WholeSaleBlocksID]


                         SELECT [CounterPartyID] as CounterID, [CounterParty] as CounterName
                    FROM [BaseData].[CounterParty]
                    GROUP BY [CounterPartyID], [CounterParty]
                    ORDER BY [CounterPartyID]
                    ";

                    cmd.CommandText = SqlCommandText;

                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set);
                    }
                    return set;
                }
            }
        }

        public Deal Deal(string Zone, string Counter, string WholeSales, string StartDate, string EndDate, string DealStart, string DealEnd)
        {
            DataSet set = DataBaseConnection1(Zone, Counter, WholeSales, StartDate, EndDate, DealStart, DealEnd);

            List<object[]> graph1 = new List<object[]>();
            List<object[]> graph2 = new List<object[]>();
            List<object[]> graph3 = new List<object[]>();
            List<object[]> graph4 = new List<object[]>();

            var t0 = set.Tables[0].Rows;
            var t1 = set.Tables[1].Rows;
            var t2 = set.Tables[2].Rows;
            var t3 = set.Tables[3].Rows;

            foreach (DataRow rec in t0)
            {
                graph1.Add(rec.ItemArray);
            }
            foreach (DataRow rec in t1)
            {
                graph2.Add(rec.ItemArray);
            }
            foreach (DataRow rec in t2)
            {
                graph3.Add(rec.ItemArray);
            }
            foreach (DataRow rec in t3)
            {
                graph4.Add(rec.ItemArray);
            }

            if (graph1.Count > 0)
            {
                DateTime dealMax = graph1.Max(el => Convert.ToDateTime(el[5]));
                DateTime dealMin = graph1.Min(el => Convert.ToDateTime(el[5]));
                DateTime max = graph1.Max(el => Convert.ToDateTime(el[7]));
                DateTime min = graph1.Min(el => Convert.ToDateTime(el[6]));

                return new Deal { dealMax = dealMax, dealMin = dealMin, max = max, min = min, graph1 = graph1, graph2 = graph2, graph3 = graph3, graph4 = graph4 };
            }
            return new Deal { dealMax = null, dealMin = null, max = null, min = null, graph1 = graph1, graph2 = graph2, graph3 = graph3, graph4 = graph4 };

        }
        public DealDrops DealDrops()
        {
            DataSet set = DataBaseConnection();
            List<object> zones = new List<object>();
            List<object> blocks = new List<object>();
            List<object> counters = new List<object>();

            DataRowCollection t0 = set.Tables[0].Rows;
            var t1 = set.Tables[1].Rows;
            var t2 = set.Tables[2].Rows;

            foreach (DataRow rec in t0)
            {

                zones.Add(new { name = rec[1].ToString() });
            }

            foreach (DataRow rec in t1)
            {
                blocks.Add(new { name = rec[1].ToString() });
            }

            foreach (DataRow rec in t2)
            {
                counters.Add(new { name = rec[1].ToString() });
            }


            return new DealDrops { zones = zones, blocks = blocks, counters = counters };
        }
        #endregion

        //public async Task<dynamic> Calculate(int id)
        //{
        //    DataSet set = new DataSet();
        //    using (SqlConnection con = new SqlConnection(ConnectionString))
        //    {

        //        SqlCommand cmd = new SqlCommand();


        //        string SqlCommandText = "[WebSite].[DealEntryCalculateUpsert]";

        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.CommandText = SqlCommandText;
        //        cmd.Parameters.AddWithValue("@DealID", id);

        //        cmd.Connection = con;

        //        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
        //        {
        //            da.Fill(set);
        //        }
        //    }

        //}

        public async Task<dynamic> DropDownsInfo()
        {
            DataSet dealsSet = new DataSet();
            DataSet counterSet = new DataSet();
            DataSet pointSet = new DataSet();
            DataSet locationSet = new DataSet();
            DataSet wholesaleSet = new DataSet();


            await Task.Run(() =>
            {
                using (SqlConnection con = new SqlConnection(ConnectionString))
                {

                    SqlCommand cmd = new SqlCommand();


                    string SqlCommandText = "[WebSite].[BaseDataDealsAllGetInfo]";

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(dealsSet);
                    }

                    SqlCommandText = "[WebSite].[CounterPartyGetInfoGetInfo]";
                    cmd.CommandText = SqlCommandText;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(counterSet);
                    }

                    SqlCommandText = "[WebSite].[SetPointGetInfo]";
                    cmd.CommandText = SqlCommandText;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(pointSet);
                    }

                    SqlCommandText = "[WebSite].[CongestionZonesAllGetInfo]";
                    cmd.CommandText = SqlCommandText;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(locationSet);
                    }


                    SqlCommandText = "[WebSite].[WholeSaleBlocksAllGetInfo]";
                    cmd.CommandText = SqlCommandText;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(wholesaleSet);
                    }
                    cmd.Dispose();
                }
            });
            List<dynamic> counters = new List<dynamic>();
            List<dynamic> pointers = new List<dynamic>();
            List<dynamic> deals = new List<dynamic>();
            List<dynamic> locations = new List<dynamic>();
            List<dynamic> wholesales = new List<dynamic>();

            #region

            var a = new Task(() =>
            {

                foreach (DataRow row in Rows(dealsSet))
                {
                    var dealId = row["DealID"].ToString();
                    var dealName = row["DealName"].ToString();
                    var dealDate = row["DealDate"].ToString();
                    deals.Add(new { dealId, dealName, dealDate });

                };
            });

            var b = new Task(() =>
            {

                foreach (DataRow row in Rows(counterSet))
                {
                    var id = row[0].ToString();
                    var name = row[1].ToString();
                    counters.Add(new { id, name });

                }
            });

            var c = new Task(() =>
            {

                foreach (DataRow row in Rows(pointSet))
                {
                    var id = row[0].ToString();
                    var name = row[1].ToString();
                    pointers.Add(new { id, name });
                }
            });

            var d = new Task(() =>
            {

                foreach (DataRow row in Rows(locationSet))
                {
                    var id = row[0].ToString();
                    var name = row[1].ToString();
                    locations.Add(new { id, name });
                }
            });

            var e = new Task(() =>
            {

                foreach (DataRow row in Rows(wholesaleSet))
                {
                    var id = row[0].ToString();
                    var name = row[1].ToString();
                    wholesales.Add(new { id, name });
                }
            });

            Task[] tasks = new Task[] { a, b, c, d, e };
            foreach (var t in tasks) t.Start();

            Task.WaitAll(tasks);
            #endregion

            return
                new
                {
                    counters,
                    pointers,
                    deals,
                    locations,
                    wholesales,
                };

        }
        private IEnumerable<DataRow> Rows(DataSet set) => set.Tables[0].Rows.Cast<DataRow>();

        public async Task<dynamic> GetDealInfo(int id)
        {
            DataSet set = new DataSet();
            List<string> keys = DealInfoKeys.Split(",").ToList();

            List<dynamic> dealInfo = new List<dynamic>();
            Dictionary<string, object> dealInfo1 = new Dictionary<string, object>();

            await Task.Run(() =>
            {
                using (SqlConnection con = new SqlConnection(ConnectionString))
                {

                    SqlCommand cmd = new SqlCommand();


                    string SqlCommandText = "[WebSite].[DealsSpecificGetInfo]";

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@DealID", id);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set);
                    }

                    cmd.Dispose();
                }
            });
            await Task.Run(() =>
            {
                foreach (DataRow row in Rows(set))
                {
                    var columns = row.Table.Columns.Cast<DataColumn>().ToList();
                    Dictionary<string, string> dict = new Dictionary<string, string>();
                    foreach (var col in columns)
                    {
                        var str = col.ColumnName;
                        dict.Add(str, row[str].ToString());
                    }
                    var list = dict.AsEnumerable();
                    dealInfo.Add(list);
                    //dealInfo.Add({ row.ItemArray);
                }

            });
            return dealInfo.ToList().FirstOrDefault();


        }

        public async Task<dynamic> Calculate(int id)
        {
            var set = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[DealEntryCalculateUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("DealID", id);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set, "SelectionItems");
                    }


                }
            }


            return await GetDealInfo(id);
        }
        public void Save(SaveDTO1 obj)
        {
            var set = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[DealEntrySaveUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    AddProc(cmd, obj);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set, "SelectionItems");
                    }

                }
            }
        }
        private void AddProc(SqlCommand cmd, SaveDTO1 obj)
        {
            int counter = 0;
            int c1 = 0;
            int c2 = 0;
            int c3 = 0;
            int c4 = 0;
            foreach (var k in DealSaveKeys)
            {
                foreach (var pair in obj.values)
                {
                    if (k.ToLower() == pair.key.ToLower())
                    {
                        counter++;

                        if (k == "WholeSaleBlocksID")
                        {
                            var a = k == SaveInt[5];
                            var b = SaveInt.Contains(k);
                        }
                        //cmd.Parameters.AddWithValue(k, pair.Value);
                        if (SaveInt.Contains(k) || k == "WholeSaleBlocksID")
                        {

                            cmd.Parameters.AddWithValue(k, Int32.Parse(pair.value));
                            c1++;

                        }
                        if (SaveFloat.Contains(k))
                        {
                            var str = pair.value;
                            if (pair.value.ToString().Contains('$'))
                            {
                                str = pair.value.Split(" ")[0];
                            }
                            cmd.Parameters.AddWithValue(k, Double.Parse(str, CultureInfo.InvariantCulture));
                            c2++;
                        }


                        if (SaveDate.Contains(k))
                        {
                            c3++;
                            cmd.Parameters.AddWithValue(k, DateTime.Parse(pair.value));
                        }

                        if (SaveString.Contains(k))
                        {
                            c4++;
                            cmd.Parameters.AddWithValue(k, pair.value);
                        }


                    }
                }
            }
        }

        public dynamic Commit(int id)
        {
            var set = new DataSet();
            var set1 = new DataSet();

            using (SqlConnection con = new SqlConnection(ConnectionString))
            {

                using (SqlCommand cmd = new SqlCommand())
                {

                    string SqlCommandText = "[WebSite].[DealEntryCommitUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("DealID", id);
                    cmd.Connection = con;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set, "SelectionItems");
                    }
                    SqlCommandText = "[WebSite].[DealsSpecificGetInfo]";

                    cmd.CommandText = SqlCommandText;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(set1, "SelectionItems");
                    }


                }
            }

            var info = set1.Tables[0].Rows[0]["CommitmentDate"].ToString();
            return info;

        }

        public List<DealEntryDBModel> GetDealEntry(DealGraphFilters filters)
        {
            throw new NotImplementedException();
        }

        static string[] SaveInt = new string[] { "DealID", "CounterPartyID", "SecondCounterPartyID", "SetPointID", "CongestionZonesID", " WholeSaleBlocksID" };
        static string[] SaveFloat = new string[] { "VolumeMW", "VolumeMWh", "Price", "Fee" };
        static string[] SaveDate = new string[] { "DealDate", "StartDate", "EndDate" };
        static string[] SaveString = new string[] { "DealName", "Notes" };
        //        static string[] DealSaveKeys = new string []{ "CongestionZonesID", "CounterPartyID", "DealDate", "DealID", "DealName", "EndDate", "Fee", "Notes", "Price", "SecondCounterPartyID", "SetPointID", "StartDate", "VolumeMW", "VolumeMWh", "WholeSaleBlocksID" };
    }

    // using (IDbConnection conn = new SqlConnection(_connectionString))
    //             {

    //                 var data1 = conn.QueryMultiple("[WebSite].[DealEntryFilteredGetInfo]",

    //                commandType: CommandType.StoredProcedure);

    //                 var deal = data1.Read<DealDBModel>().ToList();
    //                 var dealBlock = data1.Read<DealBlock>().ToList();
    //                 var dealCounterVolume = data1.Read<CounterpartyVolumeDeal>().ToList();
    //                 var dealCounterGrossMargin = data1.Read<CounterpartyGrossMarginDeal>().ToList();

    //                 var data = new DealEntryDBModel
    //                 {
    //                     Deals = deal,
    //                     Blocks = dealBlock,
    //                     CounterVolumes = dealCounterVolume,
    //                     CounterGrossMargins = dealCounterGrossMargin
    //                 };

    //             }
}
