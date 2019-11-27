using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Dapper;
using Deal2;
using Microsoft.Extensions.Configuration;

namespace T
{
    public interface IDealEntryServiceSecond
    {
        IEnumerable<DealListDTO> AllDeal();

        IEnumerable<CustomerInfo> AllCustomer();

        IEnumerable<BrokerInfo> AllBroker();

        DealInfoDTO DealInfo(int id);

        DealInfoDTO DealPartsUpdate(int id, IEnumerable<DealPartDataBase> Parts);

        void DealSave(DealInfoDTO deal);
    }
    public class DealEntryServiceSecond : IDealEntryServiceSecond
    {
        private readonly string ConnectionString; //"Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";

        public DealEntryServiceSecond(IConfiguration configuration)
        {
            ConnectionString = configuration.GetConnectionString("Develop");
        }
        public IEnumerable<BrokerInfo> AllBroker()
        {
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                var brokers = conn.Query<BrokerInfo>("[WebSite].[BrokerNamesAllGetInfo]", commandType: CommandType.StoredProcedure);
                return brokers;
            }
        }

        public IEnumerable<CustomerInfo> AllCustomer()
        {
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                var customers = conn.Query<CustomerInfo>("[WebSite].[CustomerAllGetInfo]", commandType: CommandType.StoredProcedure);
                return customers;
            }
        }

        public IEnumerable<DealListDTO> AllDeal()
        {
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                var deals = conn.Query<DealListDTO>("[WebSite].[WholeSaleDealAllGetInfo]", commandType: CommandType.StoredProcedure);
                return deals;
            }
        }

        public DealInfoDTO DealInfo(int id)
        {
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                var dealInfo = conn.Query<DealInfoDTO>("[WebSite].[WholeSaleDealGetInfo]", new { WholeSaleDealID = id },
                    commandType: CommandType.StoredProcedure).First();

                var parts = conn.Query<DealPartDataBase>("[WebSite].[WholesaleDealPartsGetInfo]", new { DealID = id },
                    commandType: CommandType.StoredProcedure);
                dealInfo.Parts = parts;
                return dealInfo;
            }
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

        public void DealSave(DealInfoDTO deal)
        {
            using (IDbConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Execute("[WebSite].[DealEntryCommitUpsert]",
                    new { WholeSaleDealID = deal.WholeSaleDealID, 
                        WholesaleDealName = deal.WholeSaleDealName,
                        CustomerID = deal.CustomerID,
                        BrokerID = deal.BrokerID,
                        StartDate = deal.StartDate,
                        Notes = deal.Notes}, 
                    commandType: CommandType.StoredProcedure);
            }
        }

        private string ConvertDouble(double num) => num.ToString().Replace(',', '.');

        private string GetXMLParameters(IEnumerable<DealPartDataBase> Parts)
        {
            var rows = "";

            foreach(var p in Parts)
            {
                var row = $"<Row><Term>{ConvertDouble(p.Term)}</Term><BrokerFee>{ConvertDouble(p.BrokerFee)}</BrokerFee><DealMargin>{ConvertDouble(p.DealMargin)}</DealMargin><RiskPremium>{ConvertDouble(p.RiskPremium)}</RiskPremium></Row>";
                            
                rows += row;
            }
            return rows;

        }
       
    }
    
}
