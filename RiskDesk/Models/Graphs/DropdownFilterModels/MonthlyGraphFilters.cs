namespace RiskDesk.Models.Graphs.DropdownFilterModels
{
    public class MonthlyGraphFilters
    {
        //string Month, string Zone, string WholeSales, string AccNumbers)
        public string[] MonthsID { get; set; }
        public string[] ZonesID { get; set; }
        public string[] BlocksID { get; set; }
        public string[] AccNumbersID { get; set; }
    }

}
