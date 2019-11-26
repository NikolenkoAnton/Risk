using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RiskDeskDev.Models;
using Microsoft.Extensions;
using Microsoft.Extensions.Configuration;
namespace RiskDeskDev.Controllers
{
    [Route("api/generic")]
    [ApiController]
    public class GenericApiController : ControllerBase
    {

        DB d;
        public GenericApiController(IConfiguration config)
        {
            d = new DB(config);
        }
        [HttpGet]
        [Route("InfoByRows")]
        public List<GenericInfo> Info(String FileName, String FileTypeName,int page)
        {

            return d.GenericFileGetInfoByRows(FileName, FileTypeName, page);
        }

        [HttpPost]
        [Route("CustomerFacilitiesUpdate")]
        public List<FacilityInfo> CustomerFacilitiesUpdate(FacilitiesUpdateDTO facility)
        {
            return d.UpdateFacilities(facility);
        }


        [HttpGet]
        [Route("GetCustomers")]
        public List<CustomerInfo> GetCustomersInfo()
        {
            return d.GetCustomersInfo();
        }


        [HttpGet]
        [Route("GetFacilities")]
        public List<FacilityInfo> GetCFacilitiesInfo()
        {
            return d.GetFacilitiesInfo();
        }

        [HttpGet]
        [Route("Validation")]
        public List<InformationTypeInfo> GetFileFields(String InformationType)
        {
            return d.GenericValidationFieldsGetInfo(InformationType);
        }

        [HttpGet]
        [Route("Info")]
        public List<GenericInfo> Info(String FileName, String FileTypeName, String ContainerName, int RowNumber)
        {

            return d.GenericFileGetInfo(FileName, FileTypeName, ContainerName, RowNumber);
        }
        [HttpGet]
        [Route("AzureObtainParametrs")]
        public AzureParameters ObtainAzureParameters(string FileType)
        {
            AzureParameters AzureParms = new AzureParameters();
            AzureParms.AzureStorageName = "riskdeskstorage";
            AzureParms.AzureContainer = "currentclient";
            FileType = FileType.ToUpper();
            FileType = FileType.Trim();
            if (FileType == "DEAL")
            {
                AzureParms.AzureContainer = "riskdeal";
            }
            else if (FileType == "CUST")
            {
                AzureParms.AzureContainer = "riskcust";
            }
            else if (FileType == "FACL")
            {
                AzureParms.AzureContainer = "riskfacility";
            }
            else if (FileType == "ACC")
            {
                AzureParms.AzureContainer = "riskaccounts";
            }
            else if (FileType == "ICECURVE")
            {
                AzureParms.AzureContainer = "icecurves";
            }
            AzureParms.AzureContainer = "riskaccounts";
            // Good through the End of The Year
            AzureParms.SASKey = "?sv=2017-11-09&ss=b&srt=sco&sp=rwdlac&se=2018-12-31T06:00:00Z&st=2018-09-11T21:51:59Z&spr=https,http&sig=DAOv%2B4th07M6Te7PSZlebvoz9%2FYuNSCZOPFsOyb%2BqLM%3D";
            AzureParms.SASKey = "?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2020-01-01T07:50:25Z&st=2019-03-29T22:50:25Z&spr=https&sig=S5WciMmg99VPA42YsszU%2FxiG9GV0x3kZOCdAi0Gi2n0%3D";
            // 2019 to 2020
            AzureParms.SASKey = "?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2020-04-07T22:55:30Z&st=2019-04-07T14:55:30Z&spr=https&sig=yiMaA2sUwPRFYFnjv8aMuy4p2Qyrd9rvwfrI2rl5iDY%3D";

            AzureParms.blobUri = "https://riskdeskstorage.blob.core.windows.net";

            return AzureParms;
        }

        [HttpGet]
        [Route("FileUpsert")]
        public int FileUpsert(int FileID, String FileName, String FileStatus, String FileType, String UserName)
        {
            return d.FileUpsert(FileID, FileName, FileStatus, FileType, UserName);
        }

        [HttpGet]
        [Route("GenericFileUpsert")]
        public int GenericFileUpsert(String FileName, String FileTypeName, String ContainerName, String RandomNumber)
        {

            int SelectionItemsinfo = new int();
            DataSet ds = new DataSet();
            string ConnectionString = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=3000; ";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    string SqlCommandText = "[WebSite].[GenericValidationUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@ContainerName", ContainerName);
                    cmd.Parameters.AddWithValue("@FileType", FileTypeName);
                    cmd.Parameters.AddWithValue("@RandomNumber", RandomNumber);
                    cmd.Connection = con;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds, "SelectionItems");
                    }
                }
            }
            return SelectionItemsinfo;
        }

        [HttpPost]
        [Route("UpdateByRow")]
        public string UpdateByRow(RowUpdateDTO rowdata)
        {
           return d.GenericUpdateByRow(rowdata);
        }

        [HttpPost]
        [Route("UpsertDataToTable")]
        public string UpsertDataToTable(TableUpdateDTO tabledata)
        {
            return d.GenericUpsertDataToTable(tabledata);
        }
        [HttpGet]
        [Route("GetBadRows")]
        public List<GenericInfo> GetBadRows(string FileName, string InformationType,int FirstLineOfDate, string Field1, String Field2, String Field3, String Field4, String Field5, String Field6, String Field7, String Field8, String Field9, string Field10,string Field11, string Field12)
        {
            return d.GetBadRows(FileName, InformationType, FirstLineOfDate, Field1, Field2, Field3, Field4, Field5, Field6, Field7, Field8, Field9, Field10, Field11, Field12);
        }
    
        [HttpGet]
        [Route("GenericTableUpsert")]
        public String GenericTableUpsert(String FileName, String InformationType, String Field1, String Field2, String Field3, String Field4, String Field5, String Field6, String Field7, String Field8, String Field9, String Field10, Int32? FirstLineOfDate)
        {

            //int SelectionItemsinfo = new int();
            String SelectionItemsinfo = "ERROR";
            DataSet ds = new DataSet();
            if (FirstLineOfDate == null) { FirstLineOfDate = 0; }
            string ConnectionString = "Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=30; ";
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    String SqlCommandText = "[WebSite].[GenericInsertOfTableUpsert]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = SqlCommandText;
                    cmd.Parameters.AddWithValue("@FileName", FileName);
                    cmd.Parameters.AddWithValue("@InformationType", InformationType);
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
                    cmd.Parameters.AddWithValue("@FirstLineOfDate", FirstLineOfDate);
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
                            SelectionItemsinfo = dr["ReturnValue"].ToString();
                        }
                    }
                }
            }
            return SelectionItemsinfo;
        }
    }
}