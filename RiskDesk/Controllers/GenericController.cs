using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RiskDeskDev.Models;

namespace RiskDeskDev.Controllers
{
    public class GenericController : Controller
    {
        public GenericController()
        {
           
        }

        // GET: Generic
        public ActionResult Index()
        {
            return View();
        }


        // POST: Generic/Create
   
        // GET: Generic/Delete/5
     
    }
}