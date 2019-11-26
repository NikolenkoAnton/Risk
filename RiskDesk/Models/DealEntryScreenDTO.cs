using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskDeskDev.Models
{
    public class KeyValue
    {
        public string key { get; set; }

        public string value { get; set; }
    }
    public class SaveRequest
    {
        public string[] Keys { get; set; }
        public string[] Values { get; set; }

    }
    public class SaveDTO1
    {
        public List<KeyValue> values { get; set; }
        //public Dictionary<string,string> dict { get; set; }
    }
}
