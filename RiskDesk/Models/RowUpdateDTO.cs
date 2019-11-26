using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models
{
    public class RowUpdateDTO
    {
        public int validateId { get; set; }

        public string fileName { get; set; }
        public string fileType { get; set; }

        public string[] fieldArr { get; set; } 
    }
}
