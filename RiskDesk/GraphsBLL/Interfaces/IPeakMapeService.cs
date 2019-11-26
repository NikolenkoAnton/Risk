using RiskDeskDev.GraphsBLL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.GraphsBLL.Interfaces
{
    public interface IMapePeakService
    {
        Task<Peak> DataPeak(string Month, string Scenario, string AccNumbers);

        Task<Mape> DataMape(string Month, string WholeSales, string AccNumbers);
        DropsMape DropsMape();

        DropsPeak DropsPeak();
    }
}
