using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RiskDesk.Models.Graphs.DropdownsEntityResponse;

namespace RiskDeskDev.Models.Graphs
{
    public class MonthDTO : ResponseDropdownItemEntity
    {
        public string Name { get; set; }

        public string ShortName { get; set; }
    }
}
