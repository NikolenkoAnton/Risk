using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev
{
    public interface IDB
    {
        IEnumerable<HourlyDTO> getHourlyGraph(string StartDate, string EndDate, string Month, string Scenario, string WholeSales, string AccNumbers);

    }
}
