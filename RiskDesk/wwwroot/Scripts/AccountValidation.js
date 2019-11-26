
function UploadFileMain() {
    try {
        //refreshContainer();
        var files = document.getElementById('files').files;
        if (!files.length) {
            alert('Please select a file!');
            return;
        }
        uploadBlobByStream(false);
        // Load Table
        var file = files[0];
        var filename = file.name;
        //LoadAccountData(file.name);


    }
    catch (e) {
        alert(e);
    }
}

function ValidateMain() {
    try {
        //refreshContainer();
        var files = document.getElementById('files').files;
        if (!files.length) {
            alert('Please select a file!');
            return;
        }
        var file = files[0];
        var filename = file.name;
        LoadAccountData(file.name);
    }
    catch (e) {
        alert(e);
    }
}

function LoadAccountData(filename) {
    try {
        filename = filename + '.csv';
        var urlMain = '/Services/WCFWebService.svc/AccountValidationGetInfo';
        var DataUrl = '?FileName=' + filename + '&ContainerName=' + container;
        urlMain = urlMain + DataUrl;

        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        //$('#data-tableUpload').remove();
        //$("#tableContainerUpload").remove("#data-tableUpload");

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
                $('<th></th>').text("ESIID").appendTo(row);
                $('<th></th>').text("Customer Name").appendTo(row);                
                $('<th></th>').text("Service Address 1").appendTo(row);

            }
            else {
                if (i == 1) {
                    var tBody = $('<tbody></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {
                    var row = $('<tr></tr>').attr({ id: "Deal_" + ResultData[i].ESIID, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].ESIID).appendTo(row);
                    $('<td></td>').text(ResultData[i].CustomerName).appendTo(row);
                    $('<td></td>').text(ResultData[i].ServiceAddress1).appendTo(row);
                }
            }
        }
        //mytable.appendTo("#tableContainerUpload");
        //myValidation = $('#data-tableUpload').DataTable(
        //    {
        //        "sScrollY": "300px",
        //        "sScrollX": "100%",
        //        "sScrollXInner": "150%",
        //        "bScrollCollapse": true,
        //        "bPaginate": false,
        //        "bFilter": false
        //    });        
        var iLimit = myValidation.fnGetData().length;
        for (i = 1; i <= iLimit; i++) {
            myValidation.fnDeleteRow(0);
        }
        for (var i in ResultData) {
            var ESIID = ResultData[i].ESIID;
            var CustomerName = ResultData[i].CustomerName;
            var ServiceAddress1 = ResultData[i].ServiceAddress1;
            var ServiceAddress2 = ResultData[i].ServiceAddress2;
            var ServiceAddress3 = ResultData[i].ServiceAddress3;
            var ZipCode = ResultData[i].ZipCode;
            var LoadProfile = ResultData[i].LoadProfile;
            var CongestionZone = ResultData[i].CongestionZone;
            var TDU = ResultData[i].TDU;
            var FileName = ResultData[i].FileName;
            myValidation.fnAddData([
                ESIID,
                CustomerName,
                ServiceAddress1,
                ServiceAddress2,
                ServiceAddress3,
                ZipCode,
                LoadProfile,
                CongestionZone,
                TDU,
                FileName
            ]);
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
// This is what goes below
//function DiplayDealValidation(FileName, ContainerName) {
//    try {
//        // Push File to Validation
//        var urlMain = '/Services/Deals.svc/DealsValidationUpsert';
//        var DataUrl = '?FileName=' + FileName + '&ContainerName=' + ContainerName;
//        urlMain = urlMain + DataUrl;
//        var ResultData = ReturnDataFromService(urlMain);
//        // Display Validation
//        urlMain = '/Services/Deals.svc/DealsValidateGetInfo';
//        ResultData = ReturnDataFromService(urlMain);
//        var iLimit = oTable.fnGetData().length;
//        for (i = 1; i <= iLimit; i++) {
//            myValidation.fnDeleteRow(0);
//        }
//        for (var i in ResultData) {
//            myValidation.fnAddData([
//                ResultData[i].DealID,
//                ResultData[i].CustomerName,
//                ResultData[i].DealName,
//                ResultData[i].DealNumber,
//                ResultData[i].StartDate,
//                ResultData[i].EndDate,
//                ResultData[i].Margin,
//                ResultData[i].BrokerMargin,
//                ResultData[i].NewDeal,
//                ResultData[i].FileName
//            ]);
//        }
//    }
//    catch (e) {
//        HeaderDataErrorReport(e);
//    }
//}
// Initial Set Up of Deal Validation Screen
function InitializeAccountValidation() {
    try {
        var FileName = "ValidationAccountData.csv";
        AzureParms = ObtainAzureParams("ACC");
        var ContainerName = AzureParms.AzureContainer;
        //alert(ContainerName);
        //var urlMain = '/Services/Deals.svc/DealsValidationUpsert';
        //var DataUrl = '?FileName=' + FileName + '&ContainerName=' + ContainerName;
        //urlMain = urlMain + DataUrl;
        //var ResultInt = ReturnDataFromService(urlMain);
        // Display Validation
        urlMain = '/Services/\WCFWebService.svc/AccountValidationGetInfo';

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
                $('<th></th>').text("ESIID").appendTo(row);
                $('<th></th>').text("Customer Name").appendTo(row);                
                $('<th></th>').text("Service Address 1").appendTo(row);
                //$('<th></th>').text("Service Address 2").appendTo(row);
                $('<th></th>').text("Service Address 3").appendTo(row);
                $('<th></th>').text("Zip Code").appendTo(row);
                $('<th></th>').text("Load Profile").appendTo(row);
                $('<th></th>').text("Congestion Zone").appendTo(row);
                $('<th></th>').text("TDU").appendTo(row);
                $('<th></th>').text("Loss Code").appendTo(row);
                $('<th></th>').text("File Name").appendTo(row);

            } else {
                if (i == 1) {
                    var tBody = $('<tbody></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {
                    var row = $('<tr></tr>').attr({ id: "RowNum_" + ResultData[i].RowNum, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].ESIID).appendTo(row);
                    $('<td></td>').text(ResultData[i].ServiceAddress1).appendTo(row);
                    $('<td></td>').text(ResultData[i].ServiceAddress3).appendTo(row);
                    $('<td></td>').text(ResultData[i].ZipCode).appendTo(row);
                    $('<td></td>').text(ResultData[i].LoadProfile).appendTo(row);
                    $('<td></td>').text(ResultData[i].CongestionZone).appendTo(row);
                    $('<td></td>').text(ResultData[i].TDU).appendTo(row);
                    $('<td></td>').text(ResultData[i].LossCode).appendTo(row);                    
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
        ClearAccount();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function ClearAccount() {
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
