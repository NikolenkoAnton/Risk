namespace RiskDesk.GraphsBLL.XmlDTO
{
    public class ErcotXMLDTO
    {
        public string WholeBlockString { get; set; }
        public string CongestionZoneString { get; set; }
        public string UtilityAccountNumberString { get; set; }
        public string MonthsString { get; set; }
        public string HoursString { get; set; }
    }

    public class MonthXML
    {

        public string WholeBlockString { get; set; }

        public string CongestionZoneString { get; set; }

        public string UtilityAccountNumberString { get; set; }


        public string MonthsString { get; set; }


    }

    public class HourlyScalarXML
    {

        public string WholeBlockString { get; set; }

        public string CongestionZoneString { get; set; }

        public string UtilityAccountNumberString { get; set; }


        public string MonthsString { get; set; }

    }


    public class RiskXML
    {
        public string CongestionZoneString { get; set; }

        public string UtilityAccountNumberString { get; set; }


        public string MonthsString { get; set; }

    }


}
