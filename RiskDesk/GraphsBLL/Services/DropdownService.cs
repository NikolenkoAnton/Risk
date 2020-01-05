using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Linq;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.Models.Graphs.DropdownsEntityResponse;
using RiskDeskDev.Models.Graphs;
namespace RiskDesk.GraphsBLL.Services
{
    public class DropdownService : IDropdownService//<T> where T : BaseEntity
    {
        private readonly string _connectionString;//"Server=tcp:qkssriskserver.database.windows.net,1433;Database=dev2;User ID=KAI_SOFTWARE;Password=rY]A_dMMf8^E\\kEp;Trusted_Connection=False;Encrypt=True;Connection Timeout=45; ";

        public DropdownService(IConfiguration configuration)
        {

            _connectionString = configuration.GetConnectionString("Develop");
        }
        public List<T> GetData<T>(BaseEntity entity)
        {
            var proc = entity.Procedure;
            using (IDbConnection conn = new SqlConnection(_connectionString))
            {

                var data = conn.Query<T>(proc,
                    commandType: CommandType.StoredProcedure).AsList();
                return data;
            }

        }

        public List<WholesaleBlock> GetSelectedBlocks(string[] blocksID)
        {
            var blocks = GetData<WholesaleBlock>(new WholesaleBlock());
            var test = new List<Month>();
            if (blocksID != null || blocksID.Length != 0)
            {
                blocks.Where(m => blocksID.Contains(m.WholeSaleBlocksId));
            }
            return blocks;
        }

        public List<Month> GetSelectedMonths(string[] monthsID)
        {
            var months = GetData<Month>(new Month());
            var test = new List<Month>();
            if (monthsID != null || monthsID.Length != 0)
            {
                months.Where(m => monthsID.Contains(m.MonthsNamesID));
            }
            return months;
        }
        public ResponseDropdownItemEntity SetIDForResponseEntities(ResponseDropdownItemEntity responseEntity, BaseEntity dbEntity)
        {
            responseEntity.Id = dbEntity.EntityId();
            return responseEntity;
        }

    }
}
