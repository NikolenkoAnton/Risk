using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RiskDesk.Models.Graphs.DropdownsEntityResponse;

namespace RiskDeskDev.Models.Graphs
{
    public class AccNumberDTO : ResponseDropdownItemEntity
    {
        public string AccNumber { get; set; }
        public string AccNumberId { get; set; }


    }
}
