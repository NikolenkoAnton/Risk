using Deal2;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace T
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private IDealEntryServiceSecond t;

        public TestController(IDealEntryServiceSecond t)
        {
            this.t = t;
        }

       
        [HttpGet("Deal/{id}")]
        public ActionResult<DealInfoDTO> DealInfo(int id)
        {
            return t.DealInfo(id);
        }

        [HttpGet("Customer")]
        public IEnumerable<CustomerInfo> AllCustomer()
        {
            return t.AllCustomer();
        }
        [HttpGet("Broker")]
        public IEnumerable<BrokerInfo> AllBroker()
        {
            return t.AllBroker();
        }

        [HttpGet("Deal")]
        public IEnumerable<DealListDTO> AllDeal()
        {
            return t.AllDeal();
        }

        //[HttpPut("Deal/Save")]
        //public ActionResult SaveDeal(DealInfoDTO deal)
        //{

        //}DealPartDataBaseLower

        [HttpPost("single")]
        public DealInfoDTO UpdateSingle(DealPartDataBaseLower Parts)
        {
            //return t.DealPartsUpdate(1, Parts.Parts);
            return null;
        }
        [HttpPost("Deal/Update")]
        public ActionResult Update(DealInfoDTO Deal)
        {
            Deal.StartDate = Deal.StartDate.AddDays(1);
            t.DealSave(Deal);
            return Ok();
        }
        [HttpPost("Deal/Create")]
        public ActionResult Create(DealInfoDTO Deal)
        {
            Deal.StartDate = Deal.StartDate.AddDays(1);
            Deal.WholeSaleDealID = "0";
            t.DealSave(Deal);
            var a = AllDeal();
            int id = 0;
            
            
             foreach(var deal in a)
            {
                if(deal.WholeSaleDealName == Deal.WholeSaleDealName)
                {
                    id = Int32.Parse(deal.WholeSaleDealID);
                }
            }
            return Ok(id);

        }
        [HttpPost("Deal/PartsUpdate/{id}")]
        public DealInfoDTO DealPartsUpdate(int id,[FromBody]IEnumerable<DealPartDataBase> Parts)
        {
            return t.DealPartsUpdate(id, Parts);
        }
    }
}
