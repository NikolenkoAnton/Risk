using RiskDeskDev.Models.Graphs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev
{
     public interface IHourlyScalarService
    {
        IEnumerable<HourlyScalarDTO> HourlyScalarData(string Month, string Zone, string WholeSales, string AccNumbers);
    }
}
