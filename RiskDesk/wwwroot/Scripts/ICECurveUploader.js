function CreateICECurveUploaderTable() {
    try {
        var urlMain = '/Services/CurveUploader.svc/GetFileAllFileInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        $('#data-table').remove();
        $("#tableContainer").remove("#data-table");
        var mytable = $('<table></table>').attr({ id: "data-table", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
        var rows = j - 2;
        var cols = 2;
        var tr = [];
        for (var i = 0; i <= rows; i++) {
            if (i == 0) {
                var tHead = $('<thead></thead>').attr({}).appendTo(mytable);
                var row = $('<tr></tr>').appendTo(tHead);
                $('<th></th>').text("File Name").appendTo(row);
                $('<th></th>').text("Upload Status").appendTo(row);
                $('<th></th>').text("Curve Name").appendTo(row);
                $('<th></th>').text("Curve Date").appendTo(row);
                $('<th></th>').text("Min. Forward Date").appendTo(row);
                $('<th></th>').text("Max. Forward Date").appendTo(row);
                //$('<th></th>').text("Loss Code").appendTo(row);
                //$('<th></th>').text("Broker Margin").appendTo(row);
            } else {
                if (i == 1) {
                    var tBody = $('<tbody id="MainTBody"></tbody>').appendTo(mytable);
                }
                for (var i in ResultData) {
                    var row = $('<tr></tr>').attr({ id: "fac_" + ResultData[i].FileID, class: "gradeA success" }).appendTo(tBody);
                    $('<td></td>').text(ResultData[i].FileName).appendTo(row);
                    $('<td></td>').text(ResultData[i].FileStatus).appendTo(row);
                    $('<td></td>').text(ResultData[i].CurveName).appendTo(row);
                    $('<td></td>').text(ResultData[i].CurveDateString).appendTo(row);
                    $('<td></td>').text(ResultData[i].MinForwardDateString).appendTo(row);
                    $('<td></td>').text(ResultData[i].MaxForwardDateString).appendTo(row);
                    //$('<td></td>').text(ResultData[i].FileName).appendTo(row);
                    //$('<td></td>').text(ResultData[i].BrokerMargin).appendTo(row);
                }
            }
        }
        mytable.appendTo("#tableContainer");
        oTable = $('#data-table').DataTable(
            {
                "sScrollY": "300px",
                "sScrollX": "100%",
                "sScrollXInner": "150%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bFilter": false
            });        
        //ReloadFileTable();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function ReloadICECurves() {
    try {
        // Loop through values on table
        var urlMain = '/Services/CurveUploader.svc/GetFileAllFileInfo';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }        
        // Obtain oTable
        //var t = $('#data-tableUpload').DataTable();

        var iLimit = oTable.fnGetData().length;
        for (i = 1; i <= iLimit; i++) {
            oTable.fnDeleteRow(0);
        }        
        for (var i in ResultData) {
            oTable.fnAddData([                
                ResultData[i].FileName,
                ResultData[i].FileStatus,
                ResultData[i].CurveName,
                ResultData[i].CurveDateString,
                ResultData[i].MinForwardDateString,
                ResultData[i].MaxForwardDateString
            ]);
        }        
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}