using System.Collections.Generic;
using System.Threading.Tasks;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.QueryDTO;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IErcotService
    {
        List<ErcotDTO> Ercot(ErcotQueryDTO queryParam);

    }
}