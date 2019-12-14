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

        public virtual string EntityId()
        {
            return GetEntityId("0");
        }

        protected virtual string GetEntityId(string EntityId)
        {
            return EntityId;
        }
    }

    public class Month : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[MonthsGetInfo]";

        public string MonthsLongName { get; set; }
        public string MonthsShortName { get; set; }

        public string MonthsNamesID { get; set; }

        public override string EntityId()
        {
            return base.GetEntityId(MonthsNamesID);
        }

    }

    public class CongestionZone : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string CongestionZones { get; set; }
        public string CongestionZonesID { get; set; }

        public override string EntityId()
        {
            return base.GetEntityId(CongestionZonesID);
        }
    }

    public class WholesaleBlock : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[WholeSaleBlocksAllGetInfo]";

        public string WholeSaleBlocks { get; set; }

        public string WholeSaleBlocksId { get; set; }

        public override string EntityId()
        {
            return base.GetEntityId(WholeSaleBlocksId);
        }

    }

    public class WeatherScenar : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[WeatherScenarioAllGetInfo]";

        public string WeatherScenario { get; set; }
        public string WeatherScenarioID { get; set; }

        public override string EntityId()
        {
            return base.GetEntityId(WeatherScenarioID);
        }
    }

    public class AccountNumber : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[UtilityAccountNumbersAllGetInfo]";

        public string UtilityAccountNumber { get; set; }
        public string UtilityAccountNumberId { get; set; }

        public override string EntityId()
        {
            return base.GetEntityId(UtilityAccountNumberId);
        }

    }

}
