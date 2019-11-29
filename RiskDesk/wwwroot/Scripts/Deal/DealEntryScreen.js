//let dealsKey = [];
const calculatedValues = ["Cost", "MTM", "GrossMargin"];
let Calculated = false;
let IsPickedkDeal = false;
let CommitmentStatus = false;
const dealKeysString = `DealID
DealName
DealDate
CounterPartyID
SecondCounterPartyID
SetPointID
CongestionZonesID
WholeSaleBlocksID
VolumeMW
VolumeMWh
Price
Fee
Cost
MTM
GrossMargin
Calculated
CommitmentDate
Notes
StartDate
EndDate`;
const SaveNewDealKeysString = `
DealName
DealDate
CounterPartyID
SecondCounterPartyID
SetPointID
CongestionZonesID
WholeSaleBlocksID
VolumeMW
VolumeMWh
Price
Fee
Notes
StartDate
EndDate`;

const SaveKeysString = `DealID
DealName
DealDate
CounterPartyID
SecondCounterPartyID
SetPointID
CongestionZonesID
WholeSaleBlocksID
VolumeMW
VolumeMWh
Price
Fee
Notes
StartDate
EndDate`;
const neededDealKeys = dealKeysString.split('\n');
const neededSaveKeys = SaveKeysString.split('\n');
const neededSaveNewDealKeys = SaveNewDealKeysString.split('\n');
let KeysById = [];
let info = [];
const GetRequestData = async (url) => {

    const response = await fetch(url);
    return response.json();
}
const GetSelectOptionDefault = (value, index) => {
    return ` <option value="${index}">
                           ${value}
                            </option>`;
}
const GetSelectOption = (value, date, index) => {
    return ` <option value="${index}">
                            DealID - ${index}
                            </option>`;
}
const clearCommitment = () => {

    const elem = document.querySelector('#CommitmentDate');
    elem.value = null;
}
const fillCommitment = date => {

    //const mapDate = (date.split(' ')[0]);
    const elem = document.querySelector('#CommitmentDate');
    elem.value = date;
}
const PickDeal = async drops => {

    if (drops.value === "None") {
        IsPickedkDeal = false;
        ClearFields();
        return;
    }

    const value = +drops.value;
    const data = await GetPickedDealInfo(value);
    info = data;
    IsPickedkDeal = true;


    if (info.Committed) {
        CommitmentStatus = true;
        fillCommitment(info.CommitmentDate); //CommitmentDate = "30.09.2019 07:57:13"
    } else {
        clearCommitment();
        CommitmentStatus = false;
    }
    Calculated = info.Calculated; //? info.Calculate : info.Calculated ? info.Calculated :false;
    for (const key of neededDealKeys) {
        var item = document.querySelector(`#${key}`);
        item ? KeysById.push(item) : true;
    }

    for (const item of KeysById) {

        if (info[item.id] && item.type === 'number') {
            let value = info[item.id].split(',').join('.');

            item.value = Number(value);
        }

        if (info[item.id] && item.type === 'text') {
            if (item.id == "Price" || item.id == "Fee") item.value = info[item.id] + " $";

            else item.value = info[item.id];
        }
    }
    let dates = [document.querySelector('#DealDate'), document.querySelector('#StartDate'), document.querySelector('#EndDate'), document.querySelector('#CommitmentDate')]


    dates.forEach(el => el.value = el.value ? el.value.split(' ')[0].split('.').join('/') : '');

    document.querySelector('#DropWholesale').value = info["WholeSaleBlocksID"];


    const noIdKeys = ['CounterPartyID', 'SecondCounterPartyID', 'SetPointID', 'CongestionZonesID', 'WholeSaleBlocksID'];
    const noIdKeysShort = ['CNT', 'SECCNT', 'POINT', 'LOC', 'WH'];

    const noIdDrops = [...document.querySelectorAll('.NoIdSelect')];
    for (const k of noIdKeysShort) {

        const ind = noIdKeys[noIdKeysShort.indexOf(k)];
        const value = info[ind];
        if (value) {

            const d = noIdDrops[noIdKeysShort.indexOf(k)];
            d.value = value;
            //for (const drops of noIdDrops) {
            //    if (drops.classList.contains(k)) {
            //        const opt = [...drops.options].filter(el => el.value === value);
            //        drops.selectedOptions = opt;
            //    }
            //}
        } else {
            noIdDrops[noIdKeysShort.indexOf(k)].value = 'None';
        }

    }

    document.querySelector("#GrossMargin").value = info.GrossMargin.length ? Number(info.GrossMargin.replace(',', '.')) : 0;
    document.querySelector("#MTM").value = info.MTM.length ? Number(info.MTM.replace(',', '.')) : 0;
    document.querySelector("#Cost").value = info.Cost.length ? Number(info.Cost.replace(',', '.')) : 0;

    ChangeToNumber(document.querySelector("#GrossMargin"));
    changeInputType(document.querySelector("#GrossMargin"));

    ChangeToNumber(document.querySelector("#MTM"));
    changeInputType(document.querySelector("#MTM"));
    ChangeToNumber(document.querySelector("#Cost"));
    changeInputType(document.querySelector("#Cost"));
    ChangeToNumber(document.querySelector("#Fee"));
    changeInputType(document.querySelector("#Fee"));
    ChangeToNumber(document.querySelector("#Price"));
    changeInputType(document.querySelector("#Price"));

    ChangeToNumber1(document.querySelector("#VolumeMW"));
    changeInputType1(document.querySelector("#VolumeMW"));
    ChangeToNumber1(document.querySelector("#VolumeMWh"));
    changeInputType1(document.querySelector("#VolumeMWh"));
}
const GetPickedDealInfo = async DealID => {
    const url = `api/Deal/GetDealInfo/${DealID}`;
    const data = await GetRequestData(url);
    return data;

}
const FillDealInfo = async dealInfo => {

}
const fillDropDownsGeneral = (data, drops) => {
    for (const el of data) {
        const {
            id,
            name
        } = el;
        drops.innerHTML += GetSelectOptionDefault(name, +id);
    }
}
async function FillDealDrops() {

    const url = 'api/Deal/dropdownsInfo';
    const data = await GetRequestData(url);
    console.log(data);
    const {
        counters,
        pointers,
        deals,
        locations,
        wholesales,
    } = data;
    console.log(deals);


    const dealDrops = document.querySelector('#DealBoxes');
    const cntr = document.querySelector('#DropCounter');
    const scndcntr = document.querySelector('#DropSecondCounter');
    const points = document.querySelector('#DropPoint');
    const locationss = document.querySelector('#DropLocation');
    const wholesaless = document.querySelector('#DropWholesale');
    fillDropDownsGeneral(counters, cntr);
    fillDropDownsGeneral(counters, scndcntr);
    fillDropDownsGeneral(pointers, points);
    fillDropDownsGeneral(locations, locationss);
    fillDropDownsGeneral(wholesales, wholesaless);
    for (const deal of deals) {
        const {
            dealId,
            dealName,
            dealDate
        } = deal;
        dealDrops.innerHTML += GetSelectOption(dealName, dealDate, +dealId);
    }

}


const changeInputType1 = input => {

    let val = String(input.value).length || +input.value == 0 ? input.value + "" : '0.00';

    let valMap = "";
    let value = ('' + input.value).split('.')[0];

    if (value.length < 4) {

    } else if (value.length === 4) {
        value = value[0] + ',' + value.slice(1);
    } else if (value.length === 5) {
        value = value[0] + value[1] + ',' + value.slice(2);
    } else if (value.length === 6) {
        value = value[0] + value[1] + value[2] + ',' + value.slice(3);
    } else if (value.length === 7) {
        value = value[0] + ',' + value[1] + value[2] + value[3] + ',' + value.slice(4);
    }

    input.type = 'text';
    input.value = value;
}


const changeInputType = input => {

    let val = String(input.value).length || +input.value == 0 ? input.value + " $" : '0.00 $';

    let valMap = "";
    let value = '' + input.value;

    if (!val.includes('.')) valMap = value + '.00';
    else valMap = (val.split('.')[0]) + (val.split('.')[1]).slice(0, 4);
    if (val.split('.')[0].length > 3) {

        val = val[0] + ',' + val.slice(1);
    }
    valMap += ' $';
    input.type = 'text';
    input.value = val;
}

const ChangeToNumber1 = input => {
    let vall = +(input.value.split(',')).join('');

    input.type = 'number';
    input.min = '0';
    input.value = vall;
    console.log(vall, "number");

}


const ChangeToNumber = input => {
    let vall = +(input.value.split(' ')[0]);

    input.type = 'number';
    input.min = '0';
    input.value = vall;
    console.log(vall, "number");

}



const ClearFields = () => {
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');
    CommitmentStatus = false;
    inputs.forEach(el => el.type === 'date' ? el.valueAsDate = null : el.type = 'nulber' ? el.value = "0" : el.value = "");
    selects.forEach(el => el.value = "None");
}

const GetInputsValues = (newDealKeys) => {
    const obj = [];
    const currKeys = (newDealKeys !== undefined && newDealKeys) ? newDealKeys : neededSaveKeys;
    for (const k of currKeys) {
        var a = document.querySelector(`#${k}`);
        if (a && a.value !== 'None' && Number(a.value) !== 0) {

            let ob = {
                key: k,
                value: a.value
            };
            obj.push(ob);
            //obj[k] = a.value; 
        }
    }

    const noIdKeys = ['CounterPartyID', 'SecondCounterPartyID', 'SetPointID', 'CongestionZonesID', 'WholeSaleBlocksID'];
    const noIdDrops = [...document.querySelectorAll('.NoIdSelect')];

    for (const i in noIdDrops) {
        let val = noIdDrops[i].value;
        if (val !== 'None') {
            let ob = {
                key: noIdKeys[i],
                value: val
            };
            obj.push(ob);
            //obj[noIdKeys[i]] = val;
        }
    }
    if (document.querySelector('#DealBoxes').value !== 'None') {
        let ob = {
            key: 'DealID',
            value: document.querySelector('#DealBoxes').value
        };
        obj.push(ob);
    }
    obj.forEach(el => {
        console.log(typeof (el.key) + " keyType");
        console.log(typeof (el.value) + " valueType");

    });

    return obj;
}
const UpdateDealsIDSelect = async () => {
    var qwe = document.querySelector('#DealBoxes');

    var valuesArr = ([...qwe.children].slice(1)).map(el => el.value);

    alertify.success('saved');


    const url = 'api/Deal/dropdownsInfo';
    const data = await GetRequestData(url);
    const {
        deals,
    } = data;
    const dealDrops = document.querySelector('#DealBoxes');

    for (const d of deals) {
        const {
            dealId,
            dealName,
            dealDate
        } = d;
        if (!valuesArr.includes(dealId)) {
            dealDrops.innerHTML += GetSelectOption(dealName, dealDate, +dealId);
            qwe.value = dealId;
            break;
        }
    }
}
const SetCalculatedInputs = (data) => {
    const {
        GrossMargin,
        MTM,
        Cost
    } = data.CommitmentDate;
    document.querySelector("#GrossMargin").value = Number(GrossMargin.replace(',', '.'));
    document.querySelector("#MTM").value = Number(MTM.replace(',', '.'));
    document.querySelector("#Cost").value = Number(Cost.replace(',', '.'));

    info["MTM"] = MTM;
    info["GrossMargin"] = GrossMargin;
    info["Cost"] = Cost;
}
// #region Buttons

const SaveRequest = () => {

    const data = GetInputsValues();
    let arr1 = [];
    let arr2 = [];
    data.forEach(el => {
        arr1.push(el.key);
        arr2.push(el.value);

    })
    let mainArr = [...arr1, ...arr2];
    let esc = encodeURIComponent;
    var query = mainArr
        .map((k, i) => `arr=` + esc(k))
        .join('&');
    let url = 'api/Help?' + query;
    console.log(url);

    const datas = GetRequestData(url);

}
const IsCalculatedInputsFill = () => {

    for (const inp of calculatedValues) {
        const input = document.querySelector(`#${inp}`);
        console.log(input.value);
        console.log(input.text);
        if (input.value && (input.value === '0' || input.value === 0)) {
            return false;
        }
    }
    return true;
}
const IsAvailableInputsFill = () => {
    const values = GetInputsValues();
    if (values.length !== neededSaveKeys.length - 3) return false;
    return true;
}

const SaveCalculateCallback = async () => {
    alertify.success('Calculated!');
    var qwe = document.querySelector('#DealBoxes');
    PickDeal(qwe);
}
const SaveDefaultCallback = async () => {

    var qwe = document.querySelector('#DealBoxes');

    var valuesArr = ([...qwe.children].slice(1)).map(el => el.value);

    alertify.success('saved');


    const url = 'api/Deal/dropdownsInfo';
    const data = await GetRequestData(url);
    const {
        deals,
    } = data;
    const dealDrops = document.querySelector('#DealBoxes');

    for (const d of deals) {
        const {
            dealId,
            dealName,
            dealDate
        } = d;
        if (!valuesArr.includes(dealId)) {
            dealDrops.innerHTML += GetSelectOption(dealName, dealDate, +dealId);
            qwe.value = dealId;
            //PickDeal(qwe);
            break;
        }
    }
};

const ItsCommitedDeal = () => {
    const commInput = document.querySelector('#CommitmentDate');
    return !!commInput.value;
}
const SaveValidate = () => {

    if (ItsCommitedDeal()) {

        alertify.error("“No saves to this deal are allowed once the deal has been committed");
        return false;
    }
    return true;


}

const CalculateValidate = () => {
    const values = GetInputsValues();

    const valuesButCalculated = values.filter(val => calculatedValues.includes(val.key));

    if ((valuesButCalculated.length !== 3) || valuesButCalculated.any(el => el.value === 'None' || el.value === '0' || el.value === 0)) {
        return false;
    }


    return true;
}

const SetCommitDate = data => {

    const {
        CommitmentDate
    } = data;
    const commInput = document.querySelector('#CommitmentDate');
    commInput.value = CommitmentDate;

}
const CommitValidate = async () => {

    if (GetInputsValues().length < 14) {
        alertify.error("Please fill in all necessary fields and press the calculate button");
        return false;
    }
    //Please press the calculate button before committing a deal

    if (!IsCalculatedInputsFill()) {
        alertify.error("Please press the calculate button before committing a deal");
        return false;

    }
    if (ItsCommitedDeal()) {
        alertify.error("Deal already commited!");
        return false;

    }
    return true;
}
const Commit = async () => {
    const validate = await CommitValidate();
    if (!validate) {
        return;
    }

    alertify.confirm("Once this deal is committed, no further changes are allowed.   Are you sure you want to commit the deal?",
        async () => {
            const dealDrops = document.querySelector('#DealBoxes');
            const DealID = dealDrops.value;
            const url = `api/Deal/Commit?DealID=${DealID}`;

            const data = await GetRequestData(url);
            if (typeof data.date === 'string') {
                const commInput = document.querySelector('#CommitmentDate');
                commInput.value = data.date;
            } else {
                PickDeal(dealDrops);
            }
            alertify.success("Deal successfuly commitment!")
        }, () => {
            alertify.error("Commitment canceled");
        });

}
async function CalculateCallback() {
    const DealID = document.querySelector('#DealBoxes').value;

    let url = `api/Deal/Сalculate?DealID=${DealID}`;

    const data = await GetRequestData(url);

    PickDeal(document.querySelector('#DealBoxes'));
    alertify.success("Deal successfully calculated!")
}
const Calculate = () => {

    //if (IsCalculatedInputsFill()) {
    //    alertify.error("Deal already was calculated");
    //    return;
    //}
    alertify.confirm(' Screen changes must be saved prior to calculating.Do you want to save current deal?',

        CalculateCallback,
        function () {
            alertify.error("No calculations were completed");
        });

}
const Save = async () => {

    if (!SaveValidate()) {

        return;
    }

    const IDSelect = document.querySelector('#DealBoxes');

    await SaveRequest();
    if (IDSelect.value === 'None') {
        alertify.success("Deal successfully saved!")
        UpdateDealsIDSelect();
    } else {
        alertify.success("Deal successfully updated!")

    }
}
const SaveNewDealRequest = () => {

    const data = GetInputsValues(neededSaveNewDealKeys);
    let arr1 = [];
    let arr2 = [];
    arr1.push('DealID');
    arr2.push(0);
    data.forEach(el => {
        arr1.push(el.key);
        arr2.push(el.value);

    })
    let mainArr = [...arr1, ...arr2];
    let esc = encodeURIComponent;
    var query = mainArr
        .map((k, i) => `arr=` + esc(k))
        .join('&');
    let url = 'api/Help?' + query;
    console.log(url);

    const datas = GetRequestData(url);

}

const SaveNewDeal = async () => {
    if (!SaveValidate()) {

        return;
    }
    await SaveNewDealRequest();
    UpdateDealsIDSelect();

    alertify.success("Deal successfully saved!")
    UpdateDealsIDSelect();
    //neededSaveNewDealKeys
}
//Please fill in all necessary fields and press the calculate button”
//Please press the calculate button before committing a deal

// #endregion