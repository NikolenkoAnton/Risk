function DealCustomerInfoList_Change() {
    try {
    // Select the customer and display the deals in the deals combo box
    //ReturnDataFromService
        //SpecificCustomerDealsGetInfo?CustomerID=  
    $('#DealInfoList_Deal').empty();
    $('#Name_Deal').val('-Deal Name-');
    $('#Number_Deal').val('-Deal Number-');
    $('#Margin_Deal').val(0.00);
    $('#BrokerMargin_Deal').val(0.00);
    $('#DealStartDateMonth').val(1);
    SetDays('DealStartDateMonth', 'DealStartDateDay');
    $('#DealStartDateDay').val(1);
    $('#DealStartDateYear').val(0);
    $('#DealEndDateMonth').val(1);
    SetDays('DealEndDateMonth', 'DealEndDateDay')
    $('#DealEndDateDay').val(1);
    $('#DealEndDateYear').val(0);    
    $('#DealInfoList_Deal').append('<option value="' + 0 + '">' + '-Deal-' + '</option>')
    var urlMain = '/Services/Deals.svc/SpecificCustomerDealsGetInfo';
    var CustomerID = $('#CustomerInfoList_Deal').val();        
    var DataUrl = '?CustomerID=' + CustomerID;
    urlMain = urlMain + DataUrl;
    var ResultData = ReturnDataFromService(urlMain);    
    var j = 0;   
    for (var i in ResultData) {
        var DealName;
        var DealID;
        DealName = ResultData[i].DealName;
        DealID = ResultData[i].DealID
        $('#DealInfoList_Deal').append('<option value="' + DealID + '">' + DealName + '</option>')
    }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }    
}

function DealGenericAllInfoList_Initialize() {
    try {
        // Select the customer and display the deals in the deals combo box
        //ReturnDataFromService
        //SpecificCustomerDealsGetInfo?CustomerID=  
        $('#DealInfoList_Deal').empty();
        $('#Name_Deal').val('-Deal Name-');
        $('#Number_Deal').val('-Deal Number-');
        $('#Margin_Deal').val(0.00);
        $('#BrokerMargin_Deal').val(0.00);
        $('#DealStartDateMonth').val(1);
        SetDays('DealStartDateMonth', 'DealStartDateDay');
        $('#DealStartDateDay').val(1);
        $('#DealStartDateYear').val(0);
        $('#DealEndDateMonth').val(1);
        SetDays('DealEndDateMonth', 'DealEndDateDay')
        $('#DealEndDateDay').val(1);
        $('#DealEndDateYear').val(0);
        $('#DealInfoList_Deal').append('<option value="' + 0 + '">' + '-Deal-' + '</option>')
        var urlMain = '/Services/Deals.svc/DealsGenericAllGetInfo';
        //var CustomerID = $('#CustomerInfoList_Deal').val();
        //var DataUrl = '?CustomerID=' + CustomerID;
        //urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            var DealName;
            var DealID;
            DealName = ResultData[i].DealName;
            DealID = ResultData[i].DealID
            $('#DealInfoList_Deal').append('<option value="' + DealID + '">' + DealName + '</option>')
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}

function DealUpsert(NewOld) {
    var msg = "Please confirm that you want to save this record";
    if (NewOld == 'New') {
        msg = "Please confirm that you want to add a new record";
    }
    alertify.confirm(msg, function (e) {
        if (e) {
            if (NewOld == 'New') {
                msg = 'You have added a new record';
            } else {
                msg = 'You have saved this record';
            }
            alertify.success(msg);
            DealDataUpsert(NewOld);
        } else {                       
            alertify.error("Nothing completed");
        }
    });
}
function DealDataUpsert(NewOld) {
    try {
        // Select the customer and display the deals in the deals combo box
        //ReturnDataFromService
        //SpecificCustomerDealsGetInfo?CustomerID=
        var DealID = $('#DealInfoList_Deal').val();
        if (NewOld == 'New') {
            DealID = 0;
        }
        // Start Date
        var TempMonth = $('#DealStartDateMonth').val()
        var TempDay = $('#DealStartDateDay option:selected').text()
        var TempYear = $('#DealStartDateYear option:selected').text()
        var StartDate = TempMonth.toString() + '/' + TempDay.toString() + '/' + TempYear.toString();
        // End Date
        var TempMonth = $('#DealEndDateMonth').val()
        var TempDay = $('#DealEndDateDay option:selected').text()
        var TempYear = $('#DealEndDateYear option:selected').text()
        var EndDate = TempMonth.toString() + '/' + TempDay.toString() + '/' + TempYear.toString();

        var CustomerID = $('#CustomerInfoList_Deal').val();

        var DealNumber = $('#Number_Deal').val();
        var DealName = $('#Name_Deal').val();
        var Margin = $('#Margin_Deal').val();
        var BrokerMargin = $('#BrokerMargin_Deal').val();
        var CurrentDealActive = 1;
        if ($('#Active_Deal').is(':checked') != true) {CurrentDealActive  = 0; }         
        var urlMain = '/Services/Deals.svc/DealUpsert';
        //var DataUrl = '?CustomerID=' + CustomerID;
        var DataUrl = '?CustomerID=' + CustomerID + '&DealID=' + DealID + '&DealNumber=' + DealNumber + '&DealName=' + DealName + '&StartDate=' + StartDate + '&EndDate=' + EndDate + '&Margin=' + Margin + '&BrokerMargin=' + BrokerMargin + '&Active=' + CurrentDealActive;
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        DealIndividualClearAndRefillTable();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function SpecificDealGetInfo() {
    try {
        // Select the customer and display the deals in the deals combo box
        //ReturnDataFromService
        //SpecificCustomerDealsGetInfo?CustomerID=        
        var DealID = $('#DealInfoList_Deal').val();        
        // Start Date
        var urlMain = '/Services/Deals.svc/SpecificDealsGetInfo';
        //var DataUrl = '?CustomerID=' + CustomerID;
        var DataUrl = '?DealID=' + DealID;
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        if (ResultData.length == 1) {
            for (var i in ResultData) {
                var DealName = ResultData[i].DealName;
                var DealID = ResultData[i].DealID;
                var CustomerID = ResultData[i].CustomerID;
                var CustomerName = ResultData[i].CustomerName;
                var CustActive = ResultData[i].CustActive;
                var DealActive = ResultData[i].DealActive;
                var DealNumber = ResultData[i].DealNumber;
                var StartDate = new Date(ResultData[i].StartDate);
                var EndDate = new Date(ResultData[i].EndDate);
                var Margin = ResultData[i].Margin;
                var BrokerMargin = ResultData[i].BrokerMargin;
                $('#Name_Deal').val(DealName);
                $('#Number_Deal').val(DealNumber);
                $('#Margin_Deal').val(Margin);
                $('#BrokerMargin_Deal').val(BrokerMargin);
                $('#DealStartDateMonth').val(StartDate.getMonth()+1);
                SetDays('DealStartDateMonth', 'DealStartDateDay');
                $('#DealStartDateDay option:selected').text(StartDate.getDate());
                $('#DealStartDateYear').val(StartDate.getFullYear());
                $('#DealEndDateMonth').val(EndDate.getMonth()+1);
                SetDays('DealEndDateMonth', 'DealEndDateDay')
                $('#DealEndDateDay option:selected').text(EndDate.getDate());                
                $('#DealEndDateYear').val(EndDate.getFullYear());
            }
        }
        else {
            $('#Name_Deal').val('-Deal Name-');
            $('#Number_Deal').val('-Deal Number-');
            $('#Margin_Deal').val(0.00);
            $('#BrokerMargin_Deal').val(0.00);
            $('#DealStartDateMonth').val(1);
            SetDays('DealStartDateMonth', 'DealStartDateDay');
            $('#DealStartDateDay').val(1);
            $('#DealStartDateYear').val(1);
            $('#DealEndDateMonth').val(1);
            SetDays('DealEndDateMonth', 'DealEndDateDay')
            $('#DealEndDateDay').val(1);
            $('#DealEndDateYear').val(1);
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function CreateDealTable() {
    try {
        var urlMain = '/Services/Deals.svc/DealsAllGetInfo';        
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        $('#data-table').remove();
        $("#tableContainer").remove("#data-table");
        var mytable = $('<table></table>').attr({ id: "data-table", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
        var rows = 5;
        if (j <= rows) { rows = j - 1; }
        if (rows <= 1) { rows = 1;}
        var cols = 2;
        var tr = [];
        for (var i = 0; i <= rows; i++) {
            if (i == 0) {
                var tHead = $('<thead></thead>').attr({}).appendTo(mytable);
                var row = $('<tr></tr>').appendTo(tHead);
                $('<th></th>').text("Deal Id").appendTo(row);
                $('<th></th>').text("Customer Name").appendTo(row);
                $('<th></th>').text("Deal Name").appendTo(row);
                $('<th></th>').attr({ class: "hidden-phone" }).text("Deal Number").appendTo(row);
                $('<th></th>').text("Start Date").appendTo(row);
                $('<th></th>').text("End Date").appendTo(row);
                $('<th></th>').text("Margin").appendTo(row);
                $('<th></th>').text("Broker Margin").appendTo(row);

            } else {
                if (i == 1) {
                    var tBody = $('<tbody id="DealBody"></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {
                    var row = $('<tr></tr>').attr({ id: "cust_" + ResultData[i].DealID, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].DealID).appendTo(row);
                    $('<td></td>').text(ResultData[i].CustomerName).appendTo(row);
                    $('<td></td>').text(ResultData[i].DealName).appendTo(row);
                    $('<td></td>').text(ResultData[i].DealNumber).appendTo(row);
                    $('<td></td>').text(ResultData[i].StartDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].EndDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].Margin).appendTo(row);
                    $('<td></td>').text(ResultData[i].BrokerMargin).appendTo(row);
                }
            }
        }
        mytable.appendTo("#tableContainer");
        oTable = $('#data-table').dataTable(
            {
                "sScrollY": "300px",
                "sScrollX": "100%",
                "sScrollXInner": "150%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bFilter": false
            });
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function CreateGenericDealTable() {
    try {
        var urlMain = '/Services/Deals.svc/DealsGenericAllGetInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        $('#data-table').remove();
        $("#tableContainer").remove("#data-table");
        var mytable = $('<table></table>').attr({ id: "data-table", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
        var rows = 5;
        if (j <= rows) { rows = j - 1; }
        if (rows <= 1) { rows = 1; }
        var cols = 2;
        var tr = [];
        for (var i = 0; i <= rows; i++) {
            if (i == 0) {
                var tHead = $('<thead></thead>').attr({}).appendTo(mytable);
                var row = $('<tr></tr>').appendTo(tHead);
                $('<th></th>').text("Deal Id").appendTo(row);                
                $('<th></th>').text("Deal Name").appendTo(row);
                $('<th></th>').attr({ class: "hidden-phone" }).text("Deal Number").appendTo(row);
                $('<th></th>').text("Start Date").appendTo(row);
                $('<th></th>').text("End Date").appendTo(row);                
                $('<th></th>').text("Margin").appendTo(row);
                $('<th></th>').text("Broker Margin").appendTo(row); 
                $('<th></th>').text("Weight Provided").appendTo(row);
                $('<th></th>').text("TDU Name").appendTo(row); 
                $('<th></th>').text("Load Profile").appendTo(row);
                $('<th></th>').text("CongestionZone").appendTo(row);
                $('<th></th>').text("Loss Code").appendTo(row);                

            } else {
                if (i == 1) {
                    var tBody = $('<tbody></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {
                    var row = $('<tr></tr>').attr({ id: "cust_" + ResultData[i].DealID, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].DealID).appendTo(row);                    
                    $('<td></td>').text(ResultData[i].DealName).appendTo(row);
                    $('<td></td>').text(ResultData[i].DealNumber).appendTo(row);
                    $('<td></td>').text(ResultData[i].StartDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].EndDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].Margin).appendTo(row);
                    $('<td></td>').text(ResultData[i].BrokerMargin).appendTo(row);
                    $('<td></td>').text(ResultData[i].WeightProvided).appendTo(row);
                    $('<td></td>').text(ResultData[i].TDUName).appendTo(row);
                    $('<td></td>').text(ResultData[i].LoadProfileName).appendTo(row);
                    $('<td></td>').text(ResultData[i].CongestionZoneName).appendTo(row);
                    $('<td></td>').text(ResultData[i].LossCodeName).appendTo(row);                    
                }
            }
        }
        mytable.appendTo("#tableContainer");
        oTable = $('#data-table').dataTable(
            {
                "sScrollY": "300px",
                "sScrollX": "100%",
                "sScrollXInner": "150%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bFilter": false
            });
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function InitializeDealValidation() {
    try {
        var FileName = "2018_9_6_2_59_ExcelDealTabDelimineted.txt";        
        AzureParms = ObtainAzureParams("DEALINDIV");
        var ContainerName = AzureParms.AzureContainer;
        //alert(ContainerName);
        //var urlMain = '/Services/Deals.svc/DealsValidationUpsert';
        //var DataUrl = '?FileName=' + FileName + '&ContainerName=' + ContainerName;
        //urlMain = urlMain + DataUrl;
        //var ResultInt = ReturnDataFromService(urlMain);
        // Display Validation
        urlMain = '/Services/Deals.svc/DealsValidateGetInfo';

        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        $('#data-tableUpload').remove();
        $("#tableContainerUpload").remove("#data-tableUpload");
        var mytable = $('<table></table>').attr({ id: "data-tableUpload", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
        var rows = 5;
        if (j < rows) { rows = j - 2; }
        if (rows <= 0) { rows = 1; }
        var cols = 2;
        var tr = [];
        for (var i = 0; i <= rows; i++) {
            if (i == 0) {
                var tHead = $('<thead></thead>').attr({}).appendTo(mytable);
                var row = $('<tr></tr>').appendTo(tHead);
                $('<th></th>').text("Deal ID").appendTo(row);
                $('<th></th>').text("Customer Name").appendTo(row);
                $('<th></th>').attr({ class: "hidden-phone" }).text("Deal Number").appendTo(row);
                $('<th></th>').text("Deal Name").appendTo(row);
                $('<th></th>').text("Start Date").appendTo(row);
                $('<th></th>').text("End Date").appendTo(row);
                $('<th></th>').text("Margin").appendTo(row);
                $('<th></th>').text("Broker Margin").appendTo(row);
                $('<th></th>').text("Deal Active").appendTo(row);
                $('<th></th>').text("New Deal").appendTo(row);

            } else {
                if (i == 1) {
                    var tBody = $('<tbody></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {                    
                    var row = $('<tr></tr>').attr({ id: "Deal_" + ResultData[i].DealID, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].DealID).appendTo(row);
                    $('<td></td>').text(ResultData[i].CustomerName).appendTo(row);
                    $('<td></td>').text(ResultData[i].DealName).appendTo(row);
                    $('<td></td>').text(ResultData[i].DealNumber).appendTo(row);
                    $('<td></td>').text(ResultData[i].StartDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].EndDate).appendTo(row);
                    $('<td></td>').text(ResultData[i].Margin).appendTo(row);
                    $('<td></td>').text(ResultData[i].BrokerMargin).appendTo(row);
                    $('<td></td>').text(ResultData[i].NewDeal).appendTo(row);
                    $('<td></td>').text(ResultData[i].FileName).appendTo(row);
                }
            }
        }
        mytable.appendTo("#tableContainerUpload");
        myValidation = $('#data-tableUpload').DataTable(
            {
                "sScrollY": "300px",
                "sScrollX": "100%",
                "sScrollXInner": "150%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bFilter": false
            });
        DealIndividualClearValidation();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function DealIndividualClearValidation() {
    try {
    var iLimit = myValidation.fnGetData().length;
    for (i = 1; i <= iLimit; i++) {
        myValidation.fnDeleteRow(0);
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function DiplayDealValidation(FileName, ContainerName) {
    try {
        // Push File to Validation
        var urlMain = '/Services/Deals.svc/DealsValidationUpsert';
        var DataUrl = '?FileName=' + FileName + '&ContainerName=' + ContainerName;
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        // Display Validation
        urlMain = '/Services/Deals.svc/DealsValidateGetInfo';        
        ResultData = ReturnDataFromService(urlMain);
        var iLimit = oTable.fnGetData().length;
        for (i = 1; i <= iLimit; i++) {
            myValidation.fnDeleteRow(0);
        }
        for (var i in ResultData) {
            myValidation.fnAddData([
            ResultData[i].DealID,
            ResultData[i].CustomerName,
            ResultData[i].DealName,
            ResultData[i].DealNumber,
            ResultData[i].StartDate,
            ResultData[i].EndDate,
            ResultData[i].Margin,
            ResultData[i].BrokerMargin,
            ResultData[i].NewDeal,
            ResultData[i].FileName
            ]);
        }           
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function TDUInfoList_Deals_Change(ControlToSet, ControlToControl) {
    try {
        //var ControlToSet = 'TDUInfoList_Facility'
        TDUID = $('#' + ControlToSet).val();
        //ControlToSet = 'LossCodeInfoList_Facility'
        $('#' + ControlToControl).empty();
        var urlMain = '/Services/WCFWebService.svc/TDULossCodeAllGetInfo';
        var DataUrl = '?TDUID=' + TDUID;
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        //$('#' + ControlToSet).empty();
        for (var i in ResultData) {
            var TDUID = ResultData[i].TDUID;
            var LossCodeID = ResultData[i].LossCodeID
            var LossCodeName = ResultData[i].LossCodeName
            var LossCode = ResultData[i].LossCode
            var CodeValue = LossCodeID;
            $('#' + ControlToControl).append('<option value="' + CodeValue + '">' + LossCodeName + '</option>')
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function DealGenericSelect_Deal() {
    try {
        var DealID = $('#DealInfoList_Deal').val();
        var urlMain = '/Services/Deals.svc/DealGenericAllGetInfo';
        var DataUrl = '?DealID=' + DealID;
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        //$('#' + ControlToSet).empty();
        for (var i in ResultData) {
            var DealName = ResultData[i].DealName;
            var DealNumber = ResultData[i].DealNumber;
            var CongestionZoneID = ResultData[i].CongestionZoneID;
            var LoadProfileID = ResultData[i].LoadProfileID;
            var LoadProfileName = ResultData[i].LoadProfileName;
            var TDUID = ResultData[i].TDUID;            
            var LossCodeID = ResultData[i].LossCodeID
            var LossCodeName = ResultData[i].LossCodeName;
            var StartDate = new Date(ResultData[i].StartDate);
            var EndDate = new Date(ResultData[i].EndDate);
            var Margin = ResultData[i].Margin;
            var BrokerMargin = ResultData[i].BrokerMargin;
            var WeightProvided = ResultData[i].WeightProvided;
            $('#TDU_Deal').val(TDUID);
            TDUInfoList_Deals_Change('TDU_Deal', 'LossCode_Deal');
            $('#Name_Deal').val(DealName);
            $('#Number_Deal').val(DealNumber);
            $('#Margin_Deal').val(Margin);
            $('#BrokerMargin_Deal').val(BrokerMargin);
            $('#DealStartDateMonth').val(StartDate.getMonth() + 1);
            SetDays('DealStartDateMonth', 'DealStartDateDay');
            $('#DealStartDateDay option:selected').text(StartDate.getDate());
            $('#DealStartDateYear').val(StartDate.getFullYear());
            $('#DealEndDateMonth').val(EndDate.getMonth() + 1);
            SetDays('DealEndDateMonth', 'DealEndDateDay')
            $('#DealEndDateDay option:selected').text(EndDate.getDate());
            $('#DealEndDateYear').val(EndDate.getFullYear());
            $('#WeightProvided_Deal').val(WeightProvided);
            $('#LoadProfileAutoCompleteList_Facility').val(LoadProfileName );
            $('#CongestionZoneList_Deal').val(CongestionZoneID);                
            $('#LossCode_Deal').val(LossCodeID);                                    
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function DealGenericUpsert(NewOld) {
    var msg = "Please confirm that you want to save this record";
    if (NewOld == 'New') {
        msg = "Please confirm that you want to add a new record";
    }
    alertify.confirm(msg, function (e) {
        if (e) {
            if (NewOld == 'New') {
                msg = 'You have added a new record';
            } else {
                msg = 'You have saved this record';
            }
            alertify.success(msg);
            DealGenericUpsert_Deal(NewOld);
            // Reset the Generic Data Table
            DealGenericClearAndRefillTable();
        } else {
            alertify.error("Nothing completed");
        }
    });
}
function DealGenericUpsert_Deal(NewOld) {
    try {
        var DealID = $('#DealInfoList_Deal').val();        
        if (NewOld == 'New') { DealID = 0; }  
        var DealName = $('#Name_Deal').val();
        
        var DealNumber = $('#Number_Deal').val();
        var CongestionZoneID = $('#CongestionZoneList_Deal').val();      
        //alert(CongestionZoneID);
        var LoadProfileName = $('#LoadProfileAutoCompleteList_Facility').val();
        var TDUID = $('#TDU_Deal').val();
        var LossCode = $('#LossCode_Deal').val()
        var Margin = $('#Margin_Deal').val();
        var BrokerMargin = $('#BrokerMargin_Deal').val();
        var WeightProvided = $('#WeightProvided_Deal').val()
        var CurrentDealActive = 1;
        if ($('#Active_Deal').is(':checked') != true) { CurrentDealActive = 0; }         
        // Start Date
        var TempMonth = $('#DealStartDateMonth').val()
        var TempDay = $('#DealStartDateDay option:selected').text()
        var TempYear = $('#DealStartDateYear option:selected').text()
        var StartDate = TempMonth.toString() + '/' + TempDay.toString() + '/' + TempYear.toString();
        // End Date
        var TempMonth = $('#DealEndDateMonth').val()
        var TempDay = $('#DealEndDateDay option:selected').text()
        var TempYear = $('#DealEndDateYear option:selected').text()
        var EndDate = TempMonth.toString() + '/' + TempDay.toString() + '/' + TempYear.toString();
        // Send the Data
        var urlMain = '/Services/Deals.svc/DealGenericUpsert';        
        var DataUrl = '?DealID=' + DealID + '&DealNumber=' + DealNumber + '&DealName=' + DealName + '&StartDate=' + StartDate + '&EndDate=' + EndDate + '&Margin=' + Margin + '&BrokerMargin=' + BrokerMargin + '&Active=' + CurrentDealActive + '&WeightProvided=' + WeightProvided + '&CongestionZoneID=' + CongestionZoneID + '&LoadProfileName=' + LoadProfileName + '&TDUID=' + TDUID + '&LossCode=' + LossCode;
        //alert(DataUrl);
        //?DealID={DealID}&DealNumber={DealNumber}&DealName={DealName}&StartDate={StartDate}&EndDate={EndDate}&Margin={Margin}&BrokerMargin={BrokerMargin}&Active={Active}&WeightProvided={WeightProvided}&CongestionZoneID={CongestionZoneID}&LoadProfileName={LoadProfileName}&TDUID={TDUID}&LossCode={LossCode}
        urlMain = urlMain + DataUrl;
        //alert(DataUrl);
        //alert(urlMain);
        var ResultData = ReturnDataFromService(urlMain);
        DealGenericAllInfoList_Initialize();

    }
    catch (e) {
        HeaderDataErrorReport(e);
    } 
}
function DealIndividualClearAndRefillTable() {
    try {
        var urlMain = '/Services/Deals.svc/DealsAllGetInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        var iLimit = oTable.fnGetData().length;
        for (i = 1; i <= iLimit; i++) {
            oTable.fnDeleteRow(0);
        }
        for (var i in ResultData) {
            oTable.fnAddData([
                ResultData[i].DealID,
                ResultData[i].CustomerName,
                ResultData[i].DealName,
                ResultData[i].DealNumber,
                ResultData[i].StartDate,
                ResultData[i].EndDate,
                ResultData[i].Margin,
                ResultData[i].BrokerMargin
            ]);
        }        
    }
    catch (e) {
        HeaderDataErrorReport(e);
    } 
}
function DealGenericClearAndRefillTable() {
    try {
        var urlMain = '/Services/Deals.svc/DealsGenericAllGetInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        var iLimit = oTable.fnGetData().length;
        for (i = 1; i <= iLimit; i++) {
            oTable.fnDeleteRow(0);
        }
        for (var i in ResultData) {
            oTable.fnAddData([
            ResultData[i].DealID,
            ResultData[i].DealName,
            ResultData[i].DealNumber,
            ResultData[i].StartDate,
            ResultData[i].EndDate,
            ResultData[i].Margin,
            ResultData[i].BrokerMargin,
            ResultData[i].WeightProvided,
            ResultData[i].TDUName,
            ResultData[i].LoadProfileName,
            ResultData[i].CongestionZoneName,
            ResultData[i].LossCodeName
            ]);
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}