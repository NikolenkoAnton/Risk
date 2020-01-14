using System;

namespace RiskDesk.Models.Graphs.DropdownFilterModels
{
    public class MonthlyDetailPositionGraphFilters
    {
        public string[] ZonesID { get; set; }
        public string[] LinesOfBussinesID { get; set; }
        public string[] BooksID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}