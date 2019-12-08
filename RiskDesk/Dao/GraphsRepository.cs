using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.QueryDTO;
namespace RiskDesk.Dao
{
    public class GraphsRepository<T> : IGraphsRepository<T>
    {
        private readonly string _connectionString;
        private readonly IXMLService _xmlService;

        public GraphsRepository(IConfiguration configuration, IXMLService xmlService)
        {
            _connectionString = configuration.GetConnectionString("Develop");
            _xmlService = xmlService;

        }

        public List<T> GetGraphData<Q>(Q xmlModel, string procedureName)
        {
            using (IDbConnection conn = new SqlConnection(_connectionString))
            {
                var data = conn.Query<T>(procedureName,
                xmlModel,
                    commandType: CommandType.StoredProcedure).AsList();
                return data;
            }
        }
    }
    public class ErcotRepository : GraphsRepository<ErcotDTO>, IErcotRepository
    {
        public ErcotRepository(IConfiguration configuration, IXMLService xmlService) : base(configuration, xmlService)
        {

        }
    }
}