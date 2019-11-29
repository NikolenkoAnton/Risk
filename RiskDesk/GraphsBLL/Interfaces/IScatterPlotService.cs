using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RiskDesk.GraphsBLL.DTO;

namespace RiskDeskDev.Web.GraphsBLL.Interfaces
{
    public interface IScatterPlotService
    {
        List<ScatterPlotDTO> ScatterPlotData(string Hours, string Month, string Scenario, string WholeSales, string AccNumbers);
    }
}
