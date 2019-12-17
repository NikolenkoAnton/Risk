using System;

namespace RiskDesk.GraphsBLL.DTO
{
    public class WeatherScenarioDBModel
    {
        public Int64 MonthsNamesID { get; set; }
        public string MonthsShortName { get; set; }
        public string MonthsLongName { get; set; }
        public Int64 WeatherScenarioID { get; set; }

        public string WeatherScenario { get; set; }

        public DateTime xdate { get; set; }
        public double TotalLoad { get; set; }

    }
}