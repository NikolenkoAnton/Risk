using System;

namespace RiskDesk.Models.Graphs.DropdownFilterModels
{
    public class WeatherScenarioGraphFilters
    {
        public string[] MonthsID { get; set; }
        public string[] AccNumbersID { get; set; }
        public string[] ScenariosID { get; set; }
        public string[] BlocksID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}