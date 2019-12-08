using System;
using System.Collections.Generic;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.QueryDTO
{
    public class ErcotQueryDTO : BaseQueryDTO<ErcotXMLDTO>
    {
        // public ErcotQueryDTO(string hours, string month, string zones, string wholeSales, string accNumbers)
        // {
        //     this.Hours = hours;
        //     this.Month = month;
        //     this.Zones = zones;
        //     this.WholeSales = wholeSales;
        //     this.AccNumbers = accNumbers;

        // }
        public string Hours { get; set; } = "0";
        public string Month { get; set; } = "0";
        public string Zones { get; set; } = "0";
        public string WholeSales { get; set; } = "0";
        public string AccNumbers { get; set; } = "0";


        public string[] GetMonths()
        {
            var months = new List<string>();
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
                months.Add(value);
            }

            return months.ToArray();
        }
        public override ErcotXMLDTO GetXmlModel()
        {
            return new ErcotXMLDTO
            {
                WholeBlockString = GetXMLWholeSales(WholeSales),
                CongestionZoneString = GetXMLZones(Zones),
                UtilityAccountNumberString = GetXMLAccNumbers(AccNumbers),
                MonthsString = GetXMLMonths(Month),
                HoursString = GetXMLHours(Hours),
            };
        }

    }
}