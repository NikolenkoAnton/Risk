using System.Collections.Generic;
using RiskDesk.GraphsBLL.DTO;

namespace RiskDesk.Dao
{
    public interface IGraphsRepository<T>
    {
        List<T> GetGraphData<M>(M xmlModel, string procedureName);
    }

    public interface IErcotRepository : IGraphsRepository<ErcotDTO>
    {

    }
}