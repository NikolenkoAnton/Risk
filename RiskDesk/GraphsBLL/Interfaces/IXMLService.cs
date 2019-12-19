using RiskDesk.GraphsBLL.QueryDTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.Interfaces
{
    public interface IXMLService
    {
        string GetFilterXMLRows(string filterWords, string[] values);
        ErcotXMLDTO ErcotXML(ErcotQueryDTO query);
    }
}
