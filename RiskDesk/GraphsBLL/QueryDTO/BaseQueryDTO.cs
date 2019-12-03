using System;

namespace RiskDesk.GraphsBLL.QueryDTO
{
    public class BaseQueryDTO<T>
    {
        protected string GetXMLZones(string Zone)
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
        protected string GetXMLHours(string hours)
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
        protected string GetXMLMonths(string Month)
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
        protected string GetXMLScenario(string Scenario)
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
        protected string GetXMLWholeSales(string WholeSales)
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
        protected string GetXMLAccNumbers(string AccNumbers)
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

        public virtual T GetXmlModel()
        {
            throw new Exception();
        }
    }
}