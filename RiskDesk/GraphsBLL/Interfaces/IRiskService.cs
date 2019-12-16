using RiskDesk.GraphsBLL.DTO;
using RiskDesk.Models.Graphs.DropdownFilterModels;
using RiskDeskDev.GraphsBLL.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.Interfaces
{
    public interface IRiskService
    {
        List<RiskDataDTO> RiskData(string Month, string Zone, string AccNumbers);

        RiskDropDTO RiskDropsData();

        List<RiskDBModel> GetRisk(RiskGraphFilters filters);
    }
}
