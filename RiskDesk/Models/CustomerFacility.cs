using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models
{
    public class CustomerInfo
    {
        public int Id { get; set; }

        public string Name { get; set; }

    }

    public class FacilityInfo
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }

        public string AccNumber { get; set; }
    }

    public class FacilitiesUpdateDTO
    {
        public IEnumerable<FacilityUpdateDTO> facilities { get; set; }
    }
    public class FacilityUpdateDTO
    {
        public int CustomerId { get; set; }

        public string AccNumber { get; set; }
    }
}
