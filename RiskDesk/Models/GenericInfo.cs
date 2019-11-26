using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace RiskDeskDev.Models
{
    public class GenericInfo
    {
        [DataMember]
        public Int32 ValidateID { get; set; }
        [DataMember]
        public Int32 FileID { get; set; }
        [DataMember]
        public String FileName { get; set; }
        [DataMember]
        public String Field1 { get; set; }
        [DataMember]
        public String Field2 { get; set; }
        [DataMember]
        public String Field3 { get; set; }
        [DataMember]
        public String Field4 { get; set; }
        [DataMember]
        public String Field5 { get; set; }
        [DataMember]
        public String Field6 { get; set; }
        [DataMember]
        public String Field7 { get; set; }
        [DataMember]
        public String Field8 { get; set; }
        [DataMember]
        public String Field9 { get; set; }
        [DataMember]
        public String Field10 { get; set; }
        [DataMember]
        public String Field11 { get; set; }
        [DataMember]
        public String Field12 { get; set; }
        [DataMember]
        public String Field13 { get; set; }
        [DataMember]
        public String Field14 { get; set; }
        [DataMember]
        public String Field15 { get; set; }
        [DataMember]
        public String Field16 { get; set; }
        [DataMember]
        public String Field17 { get; set; }
        [DataMember]
        public String Field18 { get; set; }
        [DataMember]
        public String Field19 { get; set; }
        [DataMember]
        public String Field20 { get; set; }
        [DataMember]
        public String Field21 { get; set; }
        [DataMember]
        public String Field22 { get; set; }
        [DataMember]
        public String Field23 { get; set; }
        [DataMember]
        public String Field24 { get; set; }
        [DataMember]
        public String Field25 { get; set; }
        [DataMember]
        public String Field26 { get; set; }
        [DataMember]
        public String Field27 { get; set; }
        [DataMember]
        public String Field28 { get; set; }
        [DataMember]
        public String Field29 { get; set; }
        [DataMember]
        public String Field30 { get; set; }


    }

    public class InformationTypeInfo
    {
        [DataMember]
        public String InformationType { get; set; }
        [DataMember]
        public String InformationFields { get; set; }

    }

    [DataContract]
    public class AzureParameters
    {
        [DataMember]
        public String AzureStorageName { get; set; }
        [DataMember]
        public String SASKey { get; set; }
        [DataMember]
        public String blobUri { get; set; }
        [DataMember]
        public String AzureContainer { get; set; }
    }
}
