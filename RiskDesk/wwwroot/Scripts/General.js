// JavaScript source code
function HeaderDataErrorReport(e) {
    // Used to display save message
    alert(e);
}

function FunctionFailed(msg) {
    // Used for none specific error messages to be shown
    alert(msg);
}

function ReturnUserName() {
    // Once Security Is Added This Will Change
    return 'N/A';
}

function UploadFile() {
    // grab your file object from a file input
    try {
        fileData = document.getElementById("fileUpload").files[0];
        var data = new FormData($("#fileinfo"));
        //var data = new FormData();    
        $.ajax({
            url: '/Services/WCFWebService.svc/UploadFile?fileName=' + fileData.name,
            type: 'POST',
            data: fileData,
            cache: false,
            dataType: 'json',
            //async: false,
            processData: false, // Don't process the files
            contentType: "application/octet-stream", // Set content type to false as jQuery 
            // will tell the server its a query string request
            success: function (data) {
                alert('successful..');
            },
            error: function (data) {
                alert('Some error Occurred!');
            }
        });
        alert("complete");
    } catch (e) {
        HeaderDataErrorReport(e);
    }

}

function DownloadFile() {

    window.location("http://localhost:15849/FileUploadServ.svc/File/Custom/xls");
}
// DELETE
function PostFileToService() {
    var fd = new FormData($("#fileinfo"));
    //fd.append("CustomField", "This is some extra data");
    $.ajax({
        url: 'upload.php',
        type: 'POST',
        data: fd,
        success: function (data) {
            $('#output').html(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
}
// DELETE
function CityList_Reset(ControlToSet) {
    // Retrieves the list of cities and places them into the proper place
    try {
        // Empty the list box        
        $('#' + ControlToSet).empty();
        // Set up the list call
        var urlMain = '/Services/WCFWebService.svc/CitiesForStateGetInfo';
        var DataUrl = '?StateAbb=' + '"' + "TX" + '"';
        urlMain = urlMain + DataUrl;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: false,
            success: function (Result) {
                var iRow = -1;
                var SelectedItem = 'N/A';
                for (var i in Result) {
                    var CityName;
                    var CityID;
                    CityName = Result[i].CityName;
                    CityID = Result[i].CityID
                    $('#' + ControlToSet).append('<option value="' + CityID + '">' + CityName + '</option>')
                }
            },
            error: function (Result) {
                alert("Error");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function StateList_Reset(ControlToSet) {
    // Retrieves the list of cities and places them into the proper place
    try {
        // Empty the list box        
        $('#' + ControlToSet).empty();
        // Set up the list call
        var urlMain = '/Services/WCFWebService.svc/StatesGetInfo';
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: false,
            success: function (Result) {
                var iRow = -1;
                var SelectedItem = 'N/A';
                for (var i in Result) {
                    var StateName;
                    var StateAbb;
                    StateName = Result[i].StateName;
                    StateAbb = Result[i].StateAbb

                    $('#' + ControlToSet).append('<option value="' + StateAbb + '">' + StateName + '</option>')
                }
            },
            error: function (Result) {
                alert("Error");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CustomerList_Reset(ControlToSet) {
    // Retrieves the list of cities and places them into the proper place
    try {
        // Empty the list box        
        $('#' + ControlToSet).empty();
        $('#' + ControlToSet).append('<option value="' + 0 + '">' + '-Customer-' + '</option>')
        // Set up the list call
        var urlMain = '/Services/WCFWebService.svc/CustomersAllGetInfo';
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: false,
            success: function (Result) {
                var iRow = -1;
                var SelectedItem = 'N/A';
                for (var i in Result) {
                    var CustomerName;
                    var CustomerID;
                    CustomerName = Result[i].CustomerName;
                    CustomerID = Result[i].CustomerID
                    $('#' + ControlToSet).append('<option value="' + CustomerID + '">' + CustomerName + '</option>')
                }
            },
            error: function (Result) {
                alert("Error");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CityAuto_Reset(ControlToSet) {
    // Retrieves the list of cities and places them into the proper place
    try {
        // Empty the list box        
        //$('#' + ControlToSet).empty();
        // Set up the list call
        var Test = [];
        Cities = [];
        var urlMain = '/Services/WCFWebService.svc/CitiesForStateGetInfo';
        var DataUrl = '?StateAbb=' + '"' + "TX" + '"';
        urlMain = urlMain + DataUrl;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: false,
            success: function (Result) {
                var iRow = -1;
                var SelectedItem = 'N/A';
                for (var i in Result) {
                    var CityName;
                    var CityID;
                    CityName = Result[i].CityName;
                    CityID = Result[i].CityID
                    //$('#' + ControlToSet).append('<option value="' + CityID + '">' + CityName + '</option>')
                    Cities.push(CityName);
                }
            },
            error: function (Result) {
                alert("Error");
            }
        });
        autocomplete(document.getElementById(ControlToSet), Cities);
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function TDUInfoListReset(ControlToSet) {
    try {
        var urlMain = '/Services/WCFWebService.svc/TDUAllGetInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        $('#' + ControlToSet).empty();
        for (var i in ResultData) {
            var TDUID = ResultData[i].TDUID;
            var TDUName = ResultData[i].TDUName
            $('#' + ControlToSet).append('<option value="' + TDUID + '">' + TDUName + '</option>')
        }
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CongestionZoneInfoListReset(ControlToSet) {
    try {
        var urlMain = '/Services/WCFWebService.svc/CongestionZoneAllGetInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        $('#' + ControlToSet).empty();
        for (var i in ResultData) {
            var CongestionZoneID = ResultData[i].CongestionZoneID;
            var CongestionZoneName = ResultData[i].CongestionZoneName
            $('#' + ControlToSet).append('<option value="' + CongestionZoneID + '">' + CongestionZoneName + '</option>')
        }
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function ReturnDataFromService(urlMain) {
    try {
        var ReturnData;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: false,
            success: function (Result) {
                ReturnData = Result;
            },
            error: function (Result) {
                alert("Error");
            }
        });
        return ReturnData;
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function ReturnDataFromServiceAsync(urlMain) {
    try {
        var ReturnData;
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            // Change Here To Change The Web Service Needed
            //url: "/AzureHooknLineAjax.svc/HelloWorld",
            url: urlMain,
            // Change Here To Change The Parameters Needed
            // data: "{}",
            dataType: "json",
            async: true,
            success: function (Result) {
                ReturnData = Result;
            },
            error: function (Result) {
                alert("Error");
            }
        });
        return ReturnData;
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function SetMonths(ControlToSet) {
    //DealDateOfBirthMonth
    try {
        $('#' + ControlToSet).empty();
        $('#' + ControlToSet).append('<option value="' + 0 + '">' + '-Month-' + '</option > ')
        $('#' + ControlToSet).append('<option value="' + 1 + '">' + 'January' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 2 + '">' + 'February' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 3 + '">' + 'March' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 4 + '">' + 'April' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 5 + '">' + 'May' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 6 + '">' + 'June' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 7 + '">' + 'July' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 8 + '">' + 'August' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 9 + '">' + 'September' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 10 + '">' + 'October' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 11 + '">' + 'November' + '</option>')
        $('#' + ControlToSet).append('<option value="' + 12 + '">' + 'December' + '</option>')

    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function SetDays(ControlFrom, ControlToSet) {
    try {
        var MonthNumber = $('#' + ControlFrom).val();
        var daysInMonth = 31;
        if (MonthNumber == 4 || MonthNumber == 6 || MonthNumber == 9 || MonthNumber == 11) {
            daysInMonth = 30;
        } else if (MonthNumber == 2) {
            daysInMonth = 29;
        }
        $('#' + ControlToSet).empty();
        $('#' + ControlToSet).append('<option value="' + 0 + '">' + '-Day-' + '</option>')
        for (i = 1; i <= daysInMonth; i++) {

            $('#' + ControlToSet).append('<option value="' + i + '">' + i + '</option>')
        }
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function SetYearsAvailable(ControlToSet) {
    try {
        $('#' + ControlToSet).empty();
        $('#' + ControlToSet).append('<option value="' + 0 + '">' + '- Year -' + '</option>')
        for (i = 2010; i <= 2050; i++) {
            $('#' + ControlToSet).append('<option value="' + i + '">' + i + '</option>')
        }

    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function SetYear(ControlToSet, Yr) {
    try {
        var NewYr = Yr - 2010 + 1;
        $('#' + ControlToSet).val(NewYr);
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function ObtainDateSuffix() {
    try {
        var urlMain = "/Services/WCFWebService.svc/ObtainDateSuffix";
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        return ResultData;
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function ImportFile(FileType) {
    try {
        var msg = "Please confirm that you save all of these ";
        if (FileType == "CUST") {
            msg = msg + "customers";
        } else if (FileType == "DEAL") {
            msg = msg + "deals";
        } else if (FileType == "ICECURVE") {
            msg = msg + "files";
        }

        alertify.confirm(msg, function (e) {
            if (e) {
                if (FileType == "CUST") {
                    // Update the customers
                    var UserName = ReturnUserName();
                    msg = "All customers updated!!!"
                    var urlMain = "/Services/WCFWebService.svc/CustomerValidatedFileUpsert";
                    var ResultData = ReturnDataFromService(urlMain);
                    var j = 0;
                    var FileID = LogFileUploadStatus(0, FileNameUpload, 'IMTBL', FileType, UserName);
                    var iLimit = myValidation.fnGetData().length;
                    for (i = 1; i <= iLimit; i++) {
                        myValidation.fnDeleteRow(0);
                    }
                } else if (FileType == "DEALINDIV") {
                    var UserName = ReturnUserName();
                    msg = "All deals updated!!!"
                    var urlMain = "/Services/Deals.svc/DealsValidatedFileUpsert";
                    var ResultData = ReturnDataFromService(urlMain);
                    var j = 0;
                    var FileID = LogFileUploadStatus(0, FileNameUpload, 'IMTBL', FileType, UserName);
                    // Update the Deal Table 
                    DealIndividualClearAndRefillTable();
                    DealIndividualClearValidation();
                    CustomerList_Reset('CustomerInfoList_Deal');
                } else if (FileType == "FACL") {
                    var UserName = ReturnUserName();
                    msg = "All facilities updated!!!"
                    var urlMain = "/Services/WCFWebService.svc/FacilityValidatedFileUpsert";
                    var ResultData = ReturnDataFromService(urlMain);
                    var j = 0;
                    var FileID = LogFileUploadStatus(0, FileNameUpload, 'IMTBL', FileType, UserName);
                } else if (FileType == "ICECURVE") {
                    var UserName = ReturnUserName();
                    var files = document.getElementById('files').files;
                    var FileName = files[0].name;
                    msg = "File Uploaded!!!"
                    iFileCount = files.length;
                    for (iFile = 0; iFile < iFileCount; iFile++) {
                        var files = document.getElementById('files').files;
                        FileName = files[iFile].name;
                        //alert(FileName);
                        var urlMain = "/Services/CurveUploader.svc/TranslateSinglePDF?FileName=" + FileName;
                        var ResultData = ReturnDataFromService(urlMain);
                    }
                    var j = 0;
                    ReloadICECurves();
                    //var FileID = LogFileUploadStatus(0, FileNameUpload, 'IMTBL', FileType, UserName);
                }
                alertify.success(msg);

            } else {
                alertify.error("Nothing completed");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

const getGraphLi = name => `<li><a href='${GetGraphsHref(name)}'>${name}</a></li>`;

const GetGraphsHref = name => name === 'Weather Monthly Graph Chart' ? `${window.location.origin}/graphs/montly` :
    `${window.location.origin}/graphs/${name}`;

const getDataEntryHref = name => name === 'Generic Uploader' ? `${window.location.origin}/custfac` : `${window.location.origin}/custfac/facilityupdate`;
const getDataEntryLi = name => `<li><a href='${getDataEntryHref(name)}'>${name}</a></li>`;


const AddDataEntryHeader = container => {
    container.append(getDataEntryLi('Generic Uploader'));
    container.append(getDataEntryLi('Customer to Facility'));

    container.append(`<li><a href='${window.location.origin}/dealscreen'>WholeSale Deal Entry Screen</a></li>`);
    container.append(`<li><a href='${window.location.origin}/dealscreen/screen2'>Retail Deal Entry</a></li>`);
    container.append(`<li><a href=#>Pricing Summary</a></li>`);
    container.append(`<li><a href=#>Monthly Cash Flow</a></li>`);
    container.append(`<li><a href=#>Monthly</a></li>`);

}

const getChildElByIndex = (id, index) => document.querySelector(`#${id}`).children[index];

const getMontlyHTML = () => {
    const html = `<li>
        <a href="${window.location.origin}/graphs/Monthly">Monthly</a>
            </li>
             <li>
            <a href='${window.location.origin}/graphs/Monthly'>Weather Monthly Graph</a>
            </li>`;

    return html;
}

const getAggregatesHTML = () => {

    /*
    <li>
                <a href="${window.location.origin}/graphs/WeatherMonthly">Weather Monthly</a>
                </li>

                <li>
                <a href="${window.location.origin}/graphs/WeatherHourly">Weather Hourly</a>
                </li>

                 <li>
                <a href="${window.location.origin}/graphs/HourlyScalar">Hourly Scalar</a>
                </li>

                <li>
                <a href="${window.location.origin}/graphs/Risk">Risk</a>
                  </li>

                 <li>
                <a href="${window.location.origin}/graphs/Peak">Peak model</a>
                </li>
                <li>
                <a href="${window.location.origin}/graphs/Mape">MAPE</a>
                </li>
                 */
    const html =
        `       
                <li>
                    <a href="${window.location.origin}/graphs/Monthly">Standart Graphs</a>
                </li>
               
                <li>
                <a href="${window.location.origin}/graphs/Deal">Deal Entry Chart</a>
                </li>
                <li>
                <a href="${window.location.origin}/graphs/Pricing">Pricing</a>
                </li>
                <li>
                <a href="${window.location.origin}/graphs/GrossMargin">GrossMargin</a>
                </li>
                <li>
                <a href="${window.location.origin}/graphs/Mem">Mem</a>
                </li>
 </li>
                <li>
                <a href="${window.location.origin}/graphs/ScatterPlot">ScatterPlot</a>
                </li>
               `;

    //�Deal Entry Chart�

    //�Weather Monthly Graph Chart�

    return html;
}

const AddGraphsHeader = container => {
    const graphsArr = ['Aggregates'];

    for (const graphs of graphsArr) {
        if (graphs !== 'Aggregates') container.append(getGraphLi(graphs));
        else {

            container.append(getAggregatesHTML());

            //if (graphs !== 'Monthly') container.append(getMontlyHTML());
        }
    }

}

function AddHeader() {
    try {
        // Setting Up First Column Header
        var RowString = "<li id = 'FirstColumn' class='active'><a href=\"Index.html\"><i class=\"fa fa-dashboard\"></i>Dashboard</a></li>";
        $('#MainUL').append(RowString);
        // Setting Up Second Column
        RowString = "<li id='SecondColumn'><a href='#'><i class=\"fa fa-align-justify\"></i>Data Entry</a></li>";
        $('#MainUL').append(RowString);
        // Setting Up Second Column Within Second Column/Data Entry


        RowString = "<ul id='SecondColumnFirstUL'></ul>";
        $('#SecondColumn').append(RowString);
        AddDataEntryHeader($('#SecondColumnFirstUL'));


        RowString = "<li id='ThirdColumn'><a href='#'><i class=\"fa fa-bar-chart-o\"></i>Graphs</a></li>";
        RowString = "<li id='ThirdColumn'><a href='#'><i class=\"fa fa-bar-chart-o\"></i>Graphs</a></li>";
        $('#MainUL').append(RowString);
        RowString = "<ul id='ThirdColumnFirstUL'></ul>";
        $('#ThirdColumn').append(RowString);

        const container = $('#ThirdColumnFirstUL');
        AddGraphsHeader(container);

    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function MainPageTransactionsGetInfo() {
    try {
        var UserName = ReturnUserName();
        msg = "All customers updated!!!"
        var urlMain = "/Services/WCFWebService.svc/TransactionsGetInfo";
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        var CustomerCount = ResultData.CustomerCount;
        var DealCount = ResultData.DealCount;
        var FacilityCount = ResultData.FacilityCount;
        var FileCount = ResultData.FileCount;
        $('#CustomersDivLabel').text(CustomerCount);
        $('#FacilityDivLabel').text(FacilityCount);
        $('#DealsDivLabel').text(DealCount);
        $('#FilesDivLabel').text(FileCount);
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CalcImportDate() {
    try {
        var msgAction = "import date";
        var msg = "Please confirm that you want to " + msgAction + ".";
        alertify.confirm(msg, function (e) {
            if (e) {
                var msg = "The " + msgAction + " confirmed";
                alertify.success(msg);
            } else {
                alertify.error("Nothing completed");
            }
        });

    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CalcUnitPrice() {
    try {
        var msgAction = "calculate unit price";
        var msg = "Please confirm that you want to " + msgAction + ".";
        alertify.confirm(msg, function (e) {
            if (e) {
                var msg = "The " + msgAction + " confirmed";
                alertify.success(msg);
            } else {
                alertify.error("Nothing completed");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CalcProspectLoad() {
    try {
        var msgAction = "calculate prospect load";
        var msg = "Please confirm that you want to " + msgAction + ".";
        alertify.confirm(msg, function (e) {
            if (e) {
                var msg = "The " + msgAction + " confirmed";
                alertify.success(msg);
            } else {
                alertify.error("Nothing completed");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}

function CalcPricing() {
    try {
        var msgAction = "calculate pricing";
        var msg = "Please confirm that you want to " + msgAction + ".";
        alertify.confirm(msg, function (e) {
            if (e) {
                var msg = "The " + msgAction + " confirmed";
                alertify.success(msg);
            } else {
                alertify.error("Nothing completed");
            }
        });
    } catch (e) {
        HeaderDataErrorReport(e);
    }
}