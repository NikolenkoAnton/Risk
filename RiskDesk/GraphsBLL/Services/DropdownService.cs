using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;
using RiskDesk.GraphsBLL.Interfaces;

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
    }
}
