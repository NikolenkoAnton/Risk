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

        List<MonthlyDTO> GetMontlyGraphs(string Month, string Scenario, string WholeSales, string AccNumbers);

        List<MontlyGraphDTO> GetWeatherMontlyGraphs(string Month, string Scenario, string WholeSales, string AccNumbers);

        List<AccIdGraphDTO> GetAccIdGraphs(string Zone, string WholeSales, string AccNumbers);

        List<CongestZoneGraphDTO> GetCongestZoneGraphs(string Zone, string WholeSales, string AccNumbers);

        List<WholeSalesGraphDTO> GetWholeSalesGraphs(string Zone, string WholeSales, string AccNumbers);

    }
}
