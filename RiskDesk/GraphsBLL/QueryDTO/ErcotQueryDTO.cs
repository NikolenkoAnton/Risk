using System;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL.XmlDTO;

namespace RiskDesk.GraphsBLL.QueryDTO
{
    public class ErcotQueryDTO : BaseQueryDTO<ErcotXMLDTO>
    {
        public ErcotQueryDTO(string hours, string month, string zones, string wholeSales, string accNumbers)
        {
            this.Hours = hours;
            this.Month = month;
            this.Zones = zones;
            this.WholeSales = wholeSales;
            this.AccNumbers = accNumbers;

        }
        public string Hours { get; set; } = "0";
        public string Month { get; set; } = "0";
        public string Zones { get; set; } = "0";
        public string WholeSales { get; set; } = "0";
        public string AccNumbers { get; set; } = "0";

        public string[] GetMonths()
        {
            var arr = Month.Split("");
            string[] numbers = new string[arr.Length];
            for (int i = 0; i < arr.Length; i++)
            {
                var chr = arr[i];
                if (Int32.TryParse(chr, out int num))
                {
                    numbers[numbers.Length] = chr;
                    continue;
                }
                switch (chr)
                {
                    case "O":
                        numbers[numbers.Length] = "10";
                        break;
                    case "N":
                        numbers[numbers.Length] = "11";
                        break;
                    case "D":
                        numbers[numbers.Length] = "12";
                        break;

                    default:
                        break;
                }
            }
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