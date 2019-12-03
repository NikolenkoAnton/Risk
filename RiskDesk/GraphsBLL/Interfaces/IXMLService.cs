using RiskDesk.GraphsBLL.QueryDTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IXMLService
    {
        ErcotXMLDTO ErcotXML(ErcotQueryDTO query);
    }
}