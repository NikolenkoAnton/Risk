using Deal2;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;

namespace T
{
    [Route("api/test")]
    [ApiController]
    public class DealScreen2Controller : ControllerBase
    {
        private IDealEntryServiceSecond dealService;

        public DealScreen2Controller(IDealEntryServiceSecond dealService)
        {
            this.dealService = dealService;
        }


        [HttpGet("Deal/{id}")]
        public ActionResult<DealInfoDTO> DealInfo(int id)
        {
            return dealService.DealInfo(id);
        }

        [HttpGet("Customer")]
        public IEnumerable<CustomerInfo> AllCustomer()
        {
            return dealService.AllCustomer();
        }
        [HttpGet("Broker")]
        public IEnumerable<BrokerInfo> AllBroker()
        {
            return dealService.AllBroker();
        }

        [HttpGet("Deal")]
        public IEnumerable<DealListDTO> AllDeal()
        {
            return dealService.AllDeal();
        }

        [HttpPost("single")]
        public DealInfoDTO UpdateSingle(DealPartDataBaseLower Parts)
        {
            //return dealService.DealPartsUpdate(1, Parts.Parts);
            return null;
        }
        [HttpPost("Deal/Update")]
        public ActionResult Update(DealInfoDTO Deal)
        {
            Deal.StartDate = Deal.StartDate.AddDays(1);
            dealService.DealSave(Deal);
            return Ok();
        }
        [HttpPost("Deal/Create")]
        public ActionResult Create(DealInfoDTO Deal)
        {
            Deal.StartDate = Deal.StartDate.AddDays(1);
            Deal.WholeSaleDealID = "0";
            dealService.DealSave(Deal);
            var a = AllDeal();
            int id = 0;


            foreach (var deal in a)
            {
                if (deal.WholeSaleDealName == Deal.WholeSaleDealName)
                {
                    id = Int32.Parse(deal.WholeSaleDealID);
                }
            }
            return Ok(id);

        }
        [HttpPost("Deal/PartsUpdate/{id}")]
        public DealInfoDTO DealPartsUpdate(int id, [FromBody]IEnumerable<DealPartDataBase> Parts)
        {
            return dealService.DealPartsUpdate(id, Parts);
        }
    }
}
