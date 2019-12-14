using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.QueryDTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.Services
{
    public class XMLService : IXMLService

    {


        public string GetFilterXMLRows(string filterWords, string[] values)
        {
            if (values == null || values.Length == 0) return null;

            var row = "";
            foreach (var val in values)
            {
                row += $"<Row><{filterWords}>{val}</{filterWords}></Row>";
            }
            return row;
        }
        // private ScatterPlotXMLModel GetXMLModelForProcedure(string Hours, string Month, string Zone, string WholeSales, string AccNumbers)
        // {
        //     var model = new ScatterPlotXMLModel
        //     {
        //         WholeBlockString = GetXMLWholeSales(WholeSales),
        //         CongestionZoneString = GetXMLZones(Zone),
        //         UtilityAccountNumberString = GetXMLAccNumbers(AccNumbers),
        //         MonthsString = GetXMLMonths(Month),
        //         HoursString = GetXMLHours(Hours),
        //     };

        //     return model;

        // }

        public ErcotXMLDTO ErcotXML(ErcotQueryDTO query)
        {
            throw new System.NotImplementedException();
        }
        #region PArseParams
        private string GetXMLZones(string Zone)
        {
            var result = "";

            if (Zone != "0")
            {
                for (int i = 0; i < Zone.Length; i++)
                {
                    result += $"<Row><CZ>{Zone[i]}</CZ></Row>";
                }

            }
            return result == "" ? null : result;
        }
        private string GetXMLHours(string hours)
        {
            var result = "";
            //<Row><HR>1</HR></Row><Row><HR>2</HR></Row>
            var hoursArray = hours.Split("h");
            foreach (var h in hoursArray)
            {
                result += $"<Row><HR>{h}</HR></Row>";
            }
            return (result == "" || hours == "0") ? null : result;

        }
        private string GetXMLMonths(string Month)
        {
            string param = "";

            if (Month != "0")
            {
                for (int i = 0; i < Month.Length; i++)
                {
                    char monthValue = Month[i];

                    string value;

                    switch (monthValue)
                    {
                        case 'O':
                            value = "10";
                            break;
                        case 'N':
                            value = "11";
                            break;
                        case 'D':
                            value = "12";
                            break;

                        default:
                            value = monthValue.ToString();
                            break;
                    }

                    param += $"<Row><MN>{value}</MN></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLScenario(string Scenario)
        {
            string param = "";

            if (Scenario != "0")
            {
                for (int i = 0; i < Scenario.Length; i++)
                {
                    param += $"<Row><WS>{Scenario[i]}</WS></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLWholeSales(string WholeSales)
        {
            string param = "";

            if (WholeSales != "0")
            {
                for (int i = 0; i < WholeSales.Length; i++)
                {
                    param += $"<Row><WH>{WholeSales[i]}</WH></Row>";
                }
            }
            return param == "" ? null : param;
        }
        private string GetXMLAccNumbers(string AccNumbers)
        {
            string param = "";

            if (AccNumbers != "0")
            {
                for (int i = 0; i < AccNumbers.Length; i++)
                {
                    param += $"<Row><UA>{AccNumbers[i]}</UA></Row>";
                }
            }
            return param == "" ? null : param;
        }
        #endregion
    }
}
