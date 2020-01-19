using System;
namespace RiskDesk.GraphsBLL.XmlDTO
{
    public class MonthlyDetailPositionXML
    {
        public string BookOfBusinessString { get; set; }
        public string LineOfBusinessString { get; set; }
        public string CongestionZoneString { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }

    public class PeakXML
    {
        public string WeatherScenarioString { get; set; }
        public string UtilityAccountNumberString { get; set; }
        public string MonthsString { get; set; }

    }

    public class WeatherScenarioXML
    {
        public string MonthsString { get; set; }

        public string WholeBlockString { get; set; }

        public string UtilityAccountNumberString { get; set; }
        public string WeatherScenarioString { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }


    }
    public class ScatterXML
    {
        public string WholeBlockString { get; set; }
        public string CongestionZoneString { get; set; }
        public string UtilityAccountNumberString { get; set; }
        public string MonthsString { get; set; }
        public string HoursString { get; set; }
    }

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

    public class DealXML
    {
        public string WholeBlockString { get; set; }
        public string CongestionZoneString { get; set; }
        public string CounterPartyString { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DealStartDate { get; set; }
        public DateTime? DealEndDate { get; set; }

    }


}
