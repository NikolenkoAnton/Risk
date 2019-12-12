using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using RiskDeskDev.Models.Graphs;

namespace RiskDesk.GraphsBLL
{
    public interface IMapper
    {
    }
    public abstract class BaseEntity//<T> where T : class
    {
        public virtual string Procedure { get; set; }

        public virtual object MapToViewModel<T>(T model) { return null; }

    }

    public class Month : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[MonthsGetInfo]";

        public string MonthsLongName { get; set; }

        public override object MapToViewModel<MonthDTO>(MonthDTO m)
        {

            return null;

        }
    }

    public class CongestionZone : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string CongestionZones { get; set; }

        // public override CongestionZoneDTO MapToViewModel<CongestionZoneDTO>()
        // {
        //     return new CongestionZoneDTO { Zone = CongestionZones };
        // }
    }

    public class WholesaleBlock : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[WholeSaleBlocksAllGetInfo]";

        public string WholeSaleBlocks { get; set; }

        public int WholeSaleBlocksId { get; set; }

        // public override WholeSalesDTO MapToViewModel<WholeSalesDTO>()
        // {
        //     return new WholeSalesDTO { Block = WholeSaleBlocks };
        // }
    }

    public class WeatherScenar : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[WeatherScenarioAllGetInfo]";

        public string WeatherScenario { get; set; }
        // public override ScenarioDTO MapToViewModel<ScenarioDTO>()
        // {
        //     return new ScenarioDTO { Name = WeatherScenario };
        // }
    }

    public class AccountNumber : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[UtilityAccountNumbersAllGetInfo]";

        public string UtilityAccountNumber { get; set; }
        public int UtilityAccountNumberId { get; set; }


        // public override AccNumberDTO MapToViewModel<AccNumberDTO>()
        // {
        //     return new AccNumberDTO { AccNumber = UtilityAccountNumber };
        // }
    }

}
