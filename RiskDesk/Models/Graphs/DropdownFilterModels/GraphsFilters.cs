namespace RiskDesk.Models.Graphs.DropdownFilterModels
{

    public interface MonthFilter
    {
        string[] MonthsID { get; set; }
    }
    public interface WeatherScenarioFilter
    {
        string[] ScenariosID { get; set; }
    }

    public interface HoursFilter
    {
        string[] HoursID { get; set; }
    }

    public interface CongestionZoneFilter
    {
        string[] ZonesID { get; set; }
    }
    public interface WholeSaleBlockFilter
    {
        string[] BlocksID { get; set; }
    }
    public interface AccNumberFilter
    {
        string[] AccNumbrsID { get; set; }
    }

}
