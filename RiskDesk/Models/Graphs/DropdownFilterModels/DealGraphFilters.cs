using System;

namespace RiskDesk.Models.Graphs.DropdownFilterModels
{
    public class DealGraphFilters
    {
        public string[] BlocksID { get; set; }

        public string[] ZonesID { get; set; }

        public string[] CounterpartyID { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DealStartDate { get; set; }
        public DateTime? DealEndDate { get; set; }
    }
}