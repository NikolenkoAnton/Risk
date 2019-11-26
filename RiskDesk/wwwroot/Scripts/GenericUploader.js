let page = 0;
let dropDownFields = [];
let selectedFields = [];
let UploadedFileName = '';
let UploadedFileType = '';
let changedRows = [];
let indexesFilledTd = [];
const filledTD = new Set();
const getFillTD = () => {
    const row = [...[...document.querySelectorAll('.bodyRow')][1].children].slice(2);
    const indexes = [];
    for (const id in row) {
        if (row[id].innerText !== '') indexes.push(id);
    }
    return indexes.map(el=>+el);
}

const validateSelected = () => {
    const selects = [...document.querySelectorAll('.dropDownTable')].map(el => el.value);
    const requiredSelect = [];

    for (const index of indexesFilledTd) {
        if (selects[index] === 'Not Selected') {
            alertify.error('You have not selected all the required fields')
            return false;
        }
        requiredSelect.push(selects[index]);
    }

    //const selects = [...document.querySelectorAll('.dropDownTable')].map(el => el.value);
    const uniqueSelects = [...new Set(requiredSelect)];
    console.log(uniqueSelects);
    console.log(requiredSelect);
    if (requiredSelect.length !== uniqueSelects.length) {
        alertify.error('You select a field more than 1 times');
        return false;
    }
    return true;
}
const clearTable = () => {
    page = 0;
    const tds = [...document.querySelectorAll('.bodyRow td')];
    tds.forEach(td => !td.classList.contains('RowNumber') ? td.innerText = '' : true);
}
//#region tableInit
function getTableHTML() {
    
    const a = `<table cellpadding="4" id="main-table"> 
           ${getTheadHTML()}
           ${getTbodyHTML()}
        </table>`;
    return a;
}
function getTheadHTML() {
    let str = '';

    for (let i = 0; i < 30; i++) {
        str += `<th> 
            <select class="dropDownTable"> 
               <option> Choose file type </option>
            </select>
            </th>`
    }


   return `<thead> 
        <tr class="headRow">
        <th> ValidateID</th>
        <th style = "width:max-content">File Name</th>
        ${ str}
        </tr>
        </thead>`;
}
function getTbodyRow(rowNumber) {
    let str = `<tr id="rowNum${rowNumber}" class="bodyRow">
                <td class="validateID"></td>
                <td class="fileName"></td>`;
    for (let i = 1; i < 31; i++) {
        str += 
            `<td contenteditable="true" class='field${i}'></td>`; 
    }
    return str + '</tr>';
}
function getTbodyHTML() {
    //${getTbodyRow(1)}
    return `<tbody> 
        
        </tbody>`;
}
function CreateBaseTable() {
    const container = document.querySelector('#container');
    container.innerHTML = getTableHTML();
}
//#endregion
const getRows = () => {
  return [...document.querySelectorAll('.bodyRow')];
}

const getDropDownOptionss = (values) => {
    if (!values.includes('Not Selected')) values.push('Not Selected');
    let str = '';
    for (const option of values) {
        str += `<option value="${option}">${option}</option>`;
    }
    return str;
}
const getDropDownValues = (fileType) => {
    const url = `/api/generic/validation?InformationType=${fileType}`;
    const results = [...ReturnDataFromService(url)];
    return results.filter(el => el.hasOwnProperty('informationFields') && el.informationFields).map(el => el.informationFields);
}
const changeTableDropDown = (fileType) => {

    const values = getDropDownValues(fileType.value);
    const options = getDropDownOptionss(values);

    const selects = [...document.querySelectorAll('.dropDownTable')];
    for (const selectId in selects) {
        const select = selects[selectId];
        select.classList += ` SelectField${selectId}`; 
        select.innerHTML = options;
    }
    dropDownFields = values;

}

const mapDataRow = dataLine => Object.keys(dataLine).map(el => dataLine[el]);
const renderRow = (rowNumber,arrOfValues) => {

   
    let str = `<tr class="bodyRow">
                <td class="validateID">${arrOfValues[0]}</td>
                <td class="fileName">${arrOfValues[2]}</td>`;
    for (let i = 3; i < arrOfValues.length; i++) {
        str +=
            `<td contenteditable="true" onblur= "changeRow(this)" class='field${i}'>${arrOfValues[i]}</td>`;
    }
    return str + '</tr>';
}
const renderNewTbody = (data) => {
    const tbody = document.querySelector('#main-table tbody');
    let rows = '';
    for (const rowId in data) {
        const arrValues = mapDataRow(data[rowId]);
        rows += renderRow(rowId, arrValues);
    }
    tbody.innerHTML = rows;
    changePageNumber();
}
const updateRows = () => {
    console.log(changedRows)
    if (!changedRows.length) {
        alertify.error('No changes found!');
    }
    else {
        alertify.success('Row update started');
        for (const tr of changedRows) {
           
            const arr = [...tr.children].map(el => ({ Name: el.classList[0], Value: el.innerText }));
            const validate = Number(arr[0].Value);
            const data = {
                ValidateId: validate,
                FileName: UploadedFileName,
                FileTypeName: UploadedFileType,
                fieldArr: arr.slice(2).map(el => el.Value).map(el => el.length ? el : null)
            };
            const url = '/api/generic/UpdateByRow';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            }).then(response => alertify.success(`Row ${validate} updated!`));

        }
        changedRows = [];
    }
}
const changeRow = (currTd) => {
    !changedRows.includes(currTd.parentNode) ? changedRows.push(currTd.parentNode) : true;
}
const getBadRows = () => {
    const selects = [...document.querySelectorAll('.dropDownTable')].map(el => el.value);
    const infoType = document.querySelector('#FileTypeSel').value;
    const firstRowOfData = document.querySelector('#LineLength').value;
    let str = '';
    for (let i = 0; i < 12; i++) {
        const num = i + 1;
        str += `&Field${num}=${selects[i]}`;
    }
    const url = `api/generic/getbadrows/?FileName=${FileUniqueName}&InformationType=${infoType}&FirstRowOfData${str}`;
    return ReturnDataFromService(url);
}
const returnBadRows = () => {
    if (!validateSelected()) {
        return;
    }

    const badRows =  getBadRows();
    renderNewTbody(badRows);
   
}
const upsertDataToBaseTable = () => {
    if (!validateSelected()) {
        return;
    }
    const badRows = getBadRows();
    if (badRows.length > 1) {
        alertify.error(`You can't insert data with bad rows to table! Update bad rows and try again!`)
        renderNewTbody(badRows);
        return;
    }
    const selects = [...document.querySelectorAll('.dropDownTable')].map(el => el.value).map(el => el.length ? el : null);
    const infoType = document.querySelector('#FileTypeSel').value;
    const linedata = document.querySelector('#LineLength').value;
    const data = {
        FileName: UploadedFileName,
        InformationType: infoType,
        FirstRowOfData: linedata,
        FieldArr: selects,
    }
    console.log(data);
    const url = '/api/generic/UpsertDataToTable';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(response => alertify.success(`Table updated!`));
}

const changePageNumber = () => {
    const pageContainer = document.querySelector('#PageNumber');
    pageContainer.innerText = page ? `Page : ${page}` : '';
}
const getNextPageData = () => {
    if (!page) return;
    urlMain = 'api/generic/infobyrows?';
    const nexPage = page + 1;
    DataMain = 'FileName=' + UploadedFileName + '&FileTypeName=' + UploadedFileType + '&page=' + nexPage;
    urlMain = urlMain + DataMain;
    // Display Loading Screen                    
    const data = [...ReturnDataFromService(urlMain)];
    if (!data.length) {
        return;
    }
    page++;
    renderNewTbody(data);
}

const getPrevPageData = () => {
    if (!page || page === 1) return;
    const prevPage = page - 1;
    urlMain = 'api/generic/infobyrows?';
    DataMain = 'FileName=' + UploadedFileName + '&FileTypeName=' + UploadedFileType + '&page=' + prevPage;
    urlMain = urlMain + DataMain;
    // Display Loading Screen                    
    const data = [...ReturnDataFromService(urlMain)];
    page--;
    renderNewTbody(data);
}

//#region TH and SELECT TableHeaders Handlers
const changeTH = (th) => {
    
    //console.log(th);
}

const changeSELECT = () => {
   
    
}
const clickTH = (th) => {
    //console.log(th);
}
const clickSELECT = (select) => {
    //console.log(select);
}
//#endregion

const changeOptionValue = () => {
    const as = [...document.querySelectorAll('select')];
    //as.forEach(el => console.log(el));
}

const getInnerHtmlThead = (arr) => {
   
    let asd = getDropDownOptions(arr);
 
    let str =
        `<tr>
               <th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "FileIDTH"> FileID </th>
               <th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "FileNameTH"> FileName </th>`;
        for (let i = 0; i < arr.length; i++) {
            str +=
                `<th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "TableHeaders">
                    <select  onclick = "changeSELECT(this)" onclick = "clickSELECT(this)" class="dropDownTable">
                    ${getDropDownOptions(arr)}
                    </select>
                 </th>`;
    }
   
        return str + '</tr>';
        
    
}

const AddNewTHForTable = (row) => {
    $(`<th class='TableTH'></th>`).text("FileID").appendTo(row);
    $(`<th class='TableTH'></th>`).text("FileName").appendTo(row);
    for (const field of tableOptions) {
        $(`<th class='TableTH'></th>`).html(`<select data-select-value='Not Selected' class='dropDownTable'>${field}</select>`).appendTo(row);
    }
}

const RenderNewTable = () => {

    //$('#data-table').remove();
    //$("#tableContainer").remove("#data-table");
    
    //const mytable = $('<table></table>').attr({ id: "data-table", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
    //const tHead = $('<thead></thead>').attr({}).appendTo(mytable);
    //const row = $('<tr></tr>').appendTo(tHead);

    AddNewTHForTable(row);

    mytable.appendTo("#tableContainer");
    //oTable = $('#data-table').dataTable(
    //    {
    //        "sScrollY": "300px",
    //        "sScrollX": "100%",
    //        "sScrollXInner": "150%",
    //        "paging": true,
    //        "ordering": true,
    //        "info": false,
    //        "bScrollCollapse": true,
    //        "bPaginate": false,
    //        "bFilter": false
    //    });
    const selections = [...document.querySelectorAll('.dropDownTable')];
    const thTags = [...document.querySelectorAll('.th')];

    for (const select of selections) {
        $(select).change(() => changeSELECT(select));
        $(select).click(() => clickSELECT(select));
    }
    for (const th of thTags) {
        $(th).change(() => changeTH(select));
        $(th).click(() => clickTH(select));
    }

}

function ImportGenericData() {
    try {
        // Reset the process uploader        
        clearTable();
        AddGenericData();
        progressmovebar();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }

}

function AddGenericData() {
    try { 
        
        var files = document.getElementById('files').files;        
        var FileName = files[0].name;
        UploadedFileName = FileUniqueName;
        UploadedFileType = 'ACCOUNT';
        var FileTypeName = 'ACCOUNT';
        var ContainerName = 'riskaccounts';
        RandomNumber = `GenDate_${Date.now()}`//"GenDate_" + year + '-' + month + '-' + day + '-' + hr + '-' + mn + '-' + sec;
        var urlMain = '/api/generic/genericfileupsert?';
        var DataMain = 'FileName=' + FileUniqueName + '&FileTypeName=' + FileTypeName + '&ContainerName=' + ContainerName + '&RandomNumber=' + RandomNumber;
        var urlMain = urlMain + DataMain;
        // Display Loading Screen        
        //var ResultData = ReturnDataFromServiceAsync(urlMain);

        var ResultData = ReturnDataFromService(urlMain);
        var msg = 'Validation was sent for processing....'
        if (ResultData = 4) {
            msg = 'Success';
            alertify.success(msg);
            msg = 'Returning Data...';
            alertify.success(msg);
            // Adding the data to the validation screen
            urlMain = 'api/generic/infobyrows?';
            DataMain = 'FileName=' + FileUniqueName + '&FileTypeName=' + FileTypeName + `&page=1`;
            urlMain = urlMain + DataMain;
            // Display Loading Screen                    
            const data = [...ReturnDataFromService(urlMain)];
           
           
            page++;
            renderNewTbody(data);
            msg = 'Successful Pull Back';
            alertify.success(msg);
            indexesFilledTd = getFillTD();
            //UpdateRow();
        }
        else {
            msg = 'Failure';
            alertify.success(msg);
        }           
        
        //var process = 20;        
        //document.getElementById("progress").style.width = process + '%';
        //document.getElementById("progress").innerHTML = process + '%';
        //wait(3000);
        //process = 30;
        //document.getElementById("progress").style.width = process + '%';
        //document.getElementById("progress").innerHTML = process + '%';
        //wait(3000);
        //process = 50;
        //document.getElementById("progress").style.width = process + '%';
        //document.getElementById("progress").innerHTML = process + '%';
        //wait(3000);
        //process = 100;
        //document.getElementById("progress").style.width = process + '%';
        //document.getElementById("progress").innerHTML = process + '%';
        //wait(3000);
        //for (i = 0; i < 8; i++) {

        //    wait(2000);
        //    SetSpinnerAmount(perc);
        //    perc = perc + 10;
        //    //msg = 'Still processing....' + i * 3000/1000 + ' seconds';
        //    //alertify.success(msg);
        //}
        // STARTS and Resets the loop if any        
        

    }
    catch (e) {
      
        HeaderDataErrorReport(e);
    }
}
function refreshData(perc) {
    x = 7;  // 5 Seconds    
    //SetSpinnerAmount(perc);
    wait(2000);
    alert('Test');
    
}

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}
function CreateBaseFieldsTable() {
    try {
        var FileName = 'N/A';
        var FileTypeName = 'ACCOUNT';
        var ContainerName = 'riskaccounts';
        var urlMain = 'api/generic/validation?InformationType=N/A';
        //var DataMain = 'FileName=' + FileName + '&FileTypeName=' + FileTypeName + '&ContainerName=' + ContainerName;
        //var urlMain = urlMain + DataMain;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        $('#data-tableMatch').remove();
        $("#tableContainerMatch").remove("#data-tableMatch");

        const myTable = $('<table></table>').attr({ id: "data-table", width: "100%", overflow: "scroll", class: "scrollTable table-hover" });
        const tHead = $('<thead></thead>').attr({}).appendTo(myTable);
        //const t = document.querySelector('thead');
        tHead.innerHTML = getInnerHtmlThead(tableOptions);
        //var rows = 5;
        //if (j <= rows) { rows = j - 1; }
        //if (rows <= 1) { rows = 1; }
        //var cols = 2;
        //var tr = [];
        //var iCounter = 1;

        //for (var i = 0; i <= rows; i++) {
        //    if (i == 0) {
        //        var tHead = $('<thead></thead>').attr({}).appendTo(myTable);
        //        var row = $('<tr></tr>').appendTo(tHead);
        //        $('<th></th>').text("InformationType").appendTo(row);
        //        $('<th></th>').text("InformationFields").appendTo(row);

        //    } else {
        //        if (i == 1) {
        //            var tBody = $('<tbody></tbody>').appendTo(myTable);
        //        }
        //        for (var iRows in ResultData) {
        //            if (iCounter > j) break;
        //            var row = $('<tr></tr>').attr({ id: "gen_" + iCounter, class: "gradeA success" }).appendTo(tBody);
        //            $('<td></td>').text(ResultData[iRows].InformationType).appendTo(row);
        //            $('<td></td>').text(ResultData[iRows].InformationFields).appendTo(row);
                    
        //            iCounter = iCounter + 1;
                    
        //        }
        //    }
        //}
        myTable.appendTo("#tableContainerMatch");
        oTableMatch = $('#data-tableMatch').dataTable(
            {
                "sScrollY": "300px",
                "sScrollX": "100%",
                "sScrollXInner": "150%",
                "bScrollCollapse": true,
                "bPaginate": false,
                "bFilter": false
            });
        const tsd = $('#data-table');
        const vcxv = $(oTableMatch);
        console.log(tsd, vcxv);
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function AddTypeSelection() {
    try {
        var urlMain = 'api/generic/validation?InformationType=ACCOUNT';
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        for (var i in ResultData) {
            j = j + 1;
        }
        // Obtain oTable
        //var t = $('#data-tableUpload').DataTable();

        //var iLimit = oTableMatch.fnGetData().length;
        var iLimit = 29;
        for (i = 1; i <= iLimit; i++) {
            oTableMatch.fnDeleteRow(0);
        }
        for (var iRows in ResultData) {
            oTableMatch.fnAddData([
                ResultData[iRows].InformationType,
                ResultData[iRows].InformationFields,
            ]);
        }

    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function deleteRow(row) {
    try{
        var i = row.parentNode.parentNode.rowIndex;
        document.getElementById('data-tableFieldLink').deleteRow(i);
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}


function insRow() {
    try{
        var x = document.getElementById('data-tableFieldLink');
        var new_row = x.rows[1].cloneNode(true);
        var len = x.rows.length;
        new_row.cells[0].innerHTML = len;

        var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
        inp1.id += len;
        inp1.value = '';
        var inp2 = new_row.cells[2].getElementsByTagName('select')[0];
        inp2.id += len;
        inp2.value = '';
        x.appendChild(new_row);
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}

function ReturnStringForFieldsCombo(InformationType) {
    try {    
        var InnerHTMLCBO = "";
        var urlMain = '/api/generic/validation?';
        var DataMain = 'InformationType=' + InformationType
        var urlMain = urlMain + DataMain;
        var ResultData = ReturnDataFromService(urlMain);

        let str =
            `<tr>
               <th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "FileIDTH"> FileID </th>
               <th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "FileNameTH"> FileName </th>`;
  
        for (const option of ResultData) {
            `<th  onclick = "changeTH(this)" onclick = "clickTH(this)" class = "TableHeaders">
                    <select  onclick = "changeSELECT(this)" onclick = "clickSELECT(this)" class="dropDownTable">
                    Choose file type
                    </select>
                 </th>`;
        }
        return str;
    }
    catch (e) {
        HeaderDataErrorReport(e);
        return "ERROR";
    }
}
function ResetComboBoxesToRightText() {
    try {
        var cboInfoSel = document.getElementById('FileTypeSel');
        var InformationType = 'N/A';
        if (cboInfoSel.options[cboInfoSel.selectedIndex].value != "0") { InformationType = cboInfoSel.options[cboInfoSel.selectedIndex].text; }
        var urlMain = '/api/generic/validation?';
        var DataMain = 'InformationType=' + InformationType
        var urlMain = urlMain + DataMain;
        var ResultData = [...ReturnDataFromService(urlMain)];
        tableOptions = ResultData.filter(el => el.hasOwnProperty('informationFields') && el.informationFields).map(el => el.informationFields);
        
        const t = document.querySelector('thead');
        t.innerHTML = getInnerHtmlThead(tableOptions);
       
        return 1;
        changeOptionValue();
    }
    catch (e) {
        HeaderDataErrorReport(e);
        return "ERROR";
    }
}
function GenericTableUpload() {
    try {
        msg = "Starting update to table....";
        alertify.success(msg);  
        var files = document.getElementById('files').files;
        var FileName = files[0].name;

        var cboInfoSel = document.getElementById('FileTypeSel');
        var InformationType = 'N/A';
        if (cboInfoSel.options[cboInfoSel.selectedIndex].value != "0") { InformationType = cboInfoSel.options[cboInfoSel.selectedIndex].text; }
        if (InformationType == "N/A")
        {
            msg = "Please select an information type";
            alertify.success(msg);
        }
        else {
            const fieldsArr = {};
            [...document.querySelectorAll('.dropDownTable')].forEach(
                (el, index) => fieldsArr[`Field${index}`] = el.options[el.selectedIndex].text)

            var FirstLineOfDate = LineLength.options[LineLength.selectedIndex].value;
            msg = "Updating table....";
            alertify.success(msg);    
            progressmovebar();
            const { Field1, Field2, Field3, Field4, Field5, Field6, Field7, Field8, Field9, Field10 } = fieldsArr;
            var urlMain = '/api/generic/GenericTableUpsert?';
            var DataMain = 'FileName=' + FileUniqueName + '&InformationType=' + InformationType + '&Field1=' + Field1 + '&Field2=' + Field2 + '&Field3=' + Field3 + '&Field4=' + Field4 + '&Field5=' + Field5 + '&Field6=' + Field6 + '&Field7=' + Field7 + '&Field8=' + Field8 + '&Field9=' + Field9 + '&Field10=' + Field10 + '&FirstLineOfDate=' + FirstLineOfDate;
            var urlMain = urlMain + DataMain;
            fetch(urlMain).then(response => response.status === 200 ? alertify.success("Table Updated"):true);

        }

        //alert(field1);

    }
    catch (e) {
        HeaderDataErrorReport(e);        
    }
}
function TimerFctn(ms) {
    try{
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }
    catch (e) {
        HeaderDataErrorReport(e);        
    }
}
function SetSpinnerAmount(process) {
    try {        
        displayProcess(process);
        msg = "Successfully updated spinner";
        alertify.success(msg);
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}

const getDropDownOptions = (DropDownOptions) => {
    if (!DropDownOptions.includes('Not Selected')) DropDownOptions.push('Not Selected');
    let str = '';
    for (const options of DropDownOptions) {
        str += `<option value = '${options}'>${options}</option>`;
    }
    return str;
}


function modal() {
    try{
    $('.modal').modal('show');
    
    TimerFctn(5000);
    $('.modal').modal('hide');
    //setTimeout(function () {
    //    //console.log('hejsan');
    //    $('.modal').modal('hide');
        //}, 5000);
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}
function UpdateValidationData() {
    try {
        UploadFiles('ICECURVE');
        ImportGenericData();
        msg = "Successfully updated table";
        alertify.success(msg);
        progressmovebar();
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }

}
const clearProgressMovebar = () => {
    const moveBar = document.querySelector('#progress');
    moveBar.style.width = `0%`;
}
function progressmovebar() {
    var elem = document.getElementById("progress");
    elem.style.width = 0 + '%'
    var width = 1;
    var id = setInterval(frame, 25);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}


