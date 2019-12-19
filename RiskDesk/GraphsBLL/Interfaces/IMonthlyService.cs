using System.Collections.Generic;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IMonthlyService
    {
        List<MonthlyDBModel> MonthlyData(MonthlyGraphFilters filters);
    }
}
