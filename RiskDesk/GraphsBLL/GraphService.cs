using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using Microsoft.Extensions.Configuration;
using RiskDesk.GraphsBLL.Services;

namespace RiskDesk.GraphsBLL
{
    public class GraphService<T>
    {
        private readonly string _connectionString;
        private readonly IXMLService _xmlService;

        public GraphService(IConfiguration configuration, IXMLService xmlService)
        {
            _connectionString = configuration.GetConnectionString("Develop");
            _xmlService = xmlService;
        }

        public List<T> GetData()
        {
            return null;
        }
    }
}