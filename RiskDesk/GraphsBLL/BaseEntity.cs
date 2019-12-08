using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace RiskDesk.GraphsBLL
{
    public abstract class BaseEntity
    {
        public virtual string Procedure { get; set; }


    }

    public class Month : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[MonthsGetInfo]";

        public string MonthsLongName { get; set; }
    }

    public class CongestionZone : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string CongestionZones { get; set; }
    }

    public class WholesaleBlock : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string WholeSaleBlocks { get; set; }
    }

    public class WeatherScenar : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string WeatherScenario { get; set; }
    }

    public class AccountNumber : BaseEntity
    {
        public override string Procedure { get; set; } = "[WebSite].[CongestionZonesAllGetInfo]";

        public string UtilityAccountNumber { get; set; }
    }

}
