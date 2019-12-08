using System.Collections.Generic;

namespace RiskDesk.GraphsBLL.Services
{
    public interface IGraphService<DalModel, QueryModel>
    {
        List<DalModel> GetGraphData(QueryModel model);

    }
}