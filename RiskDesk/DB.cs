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

