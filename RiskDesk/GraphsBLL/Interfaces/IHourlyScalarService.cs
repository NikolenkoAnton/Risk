using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev
{
    public interface IHourlyScalarService
    {
        List<HourlyScalarDBModel> HourlyData(HourlyScalarGraphFilters filters);
    }
}
