using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models
{
    public class TableUpdateDTO
    {
        public string FileName { get; set; }

        public string InformationType { get; set; }

        public int FirstRowOfData { get; set; }

        public string[] FieldArr { get; set; }
    }
}
