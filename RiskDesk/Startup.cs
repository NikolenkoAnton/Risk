using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using RiskDeskDev.GraphsBLL;
using RiskDeskDev.GraphsBLL.Interfaces;
using RiskDeskDev.GraphsBLL.Services;
using System.Net.Http;
using Newtonsoft.Json;
using T;
using RiskDeskDev.Web.GraphsBLL.Interfaces;
using RiskDeskDev.Web.GraphsBLL.Services;
using RiskDesk.GraphsBLL.Interfaces;
using RiskDesk.GraphsBLL.Services;
using RiskDesk.Dao;
using RiskDesk.GraphsBLL.DTO;
using RiskDesk.GraphsBLL;

namespace RiskDeskDev
{
    public partial class Startup
    {

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public void RegisterServices(IServiceCollection services)
        {

            services.AddTransient<IHourlyScalarService, HourlyScalarService>();
            services.AddTransient<IRiskService, RiskService>();
            services.AddTransient<IMapePeakService, MapePeakService>();
            services.AddSingleton<IDealService, DealService>();
            services.AddTransient<IMapePeakService, MapePeakService>();
            services.AddTransient<IDealEntryServiceSecond, DealEntryServiceSecond>();
            services.AddTransient<IScatterPlotService, ScatterPlotService>();
            services.AddTransient<IXMLService, XMLService>();
            services.AddTransient<IErcotService, ErcotService>();
            services.AddTransient<IErcotRepository, ErcotRepository>();
            services.AddTransient<IMonthlyService, MonthlyService>();
            services.AddTransient<IGraphService, GraphService>();


            services.AddTransient<IDropdownService, DropdownService>();

            // services.AddTransient<IGraphsRepository<T>, GraphsRepository<ErcotDTO>>();

        }
        public void ConfigureServices(IServiceCollection services)
        {

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            RegisterServices(services);

            services.AddTransient<IDB, DB>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                ///app.UseHsts();
            }
            //asd();
            //app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            //app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute("default", "{controller=CustFac}/{action=Index}/{id?}");

            });
        }
    }
}
