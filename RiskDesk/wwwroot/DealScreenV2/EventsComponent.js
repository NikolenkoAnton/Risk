var selectedDealID = 0;
async function SelectDeal(event) {
    let rows = [...event.currentTarget.children];
    let currRow = event.target.parentNode;

    for (const row of rows) {
        if (row.classList.contains('selected') && row !== currRow) {
            row.classList.remove('selected');
        }
    }

    currRow.classList.toggle('selected');
    const dealID = +currRow.children[0].textContent;

    const deal = await getDealById(dealID);
    fillPickedDealInfo(deal);
}
function SaveInputValue(input) {
    input.setAttribute("value", input.value)
}
function AddDealPart() {
    //const newPart = GetLastPartInfo();
    const newPart = {
        term: null,
        brokerFee: null,
        riskPremium: null,
        dealMargin: null,
    };
    const PartDrop = document.querySelector('#PartDrop');
    PartDrop.innerHTML += renderNewPart();
}

function RemoveDealPart(backet) {
    $('#PartDrop')[0].removeChild(backet.parentNode.parentNode);

}
function GetLastPartInfo() {
    let as = document.querySelector('#PartDrop')
    let index = as.children.length
    if (index === 1) {
        return {
            term: 0,
            brokerFee: 0,
            riskPremium: 0,
            dealMargin: 0,
        };
    }
    let row = as.children[index - 1]
    const a = [];
    [...row.children].forEach(el => a.push(el.children[0].value))

    return {
        term: a[0],
        brokerFee: a[1],
        riskPremium: a[2],
        dealMargin: a[3],
    }

}
function GetPartsValue() {
    let arr = [];
    [...$('#PartDrop')[0].children]
        .forEach(el => [...el.children]
            .forEach(ell =>
                console.log(ell.children[0]
                    ? arr.push(ell.children[0].value)
                    : true)));


    arr = arr.filter(el => el);
    const values = [];
    for (let i = 0; i < arr.length / 4; i++) {
        const part = {
            term: +arr[4 * i],
            brokerFee: +arr[4 * i + 1],
            dealMargin: +arr[4 * i + 2],
            riskPremium: +arr[4 * i + 3],
        }
        console.log("part", part);
        values.push(part);
    }
    return values;

    //fetch('/Save', {
    //    method: 'POST', // или 'PUT'
    //    headers: {
    //        'Content-Type': 'application/json;charset=utf-8'
    //    },
    //    body: JSON.stringify(asd), // data может быть типа `string` или {object}!

    //})
}
function GetSelectedDealID() {
    const row = document.querySelector('.selected');
    const id = +row.children[0].textContent;
    return id;
}
function GetSelectedDealName() {
    const row = document.querySelector('.selected');
    const name = row.children[1].textContent;
    return name;
}
function SaveDealPart() {
    const parts = GetPartsValue();
    const id = GetSelectedDealID();
    const url = "api/test/Deal/PartsUpdate/" + id;
    const fullUrl = `${window.location.origin}/${url}`;
    console.log(parts);
    fetch(fullUrl, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(parts), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
}
function GetNewDealInfo() {
    const wholeSaleDealID = '' + GetSelectedDealID();
    const wholeSaleDealName = $('#InputName').val();
    //const StartDate = $('#StartDate').val();
    const customerID = +$('#CustomerSelect').val();
    const brokerID = +$('#BrokerSelect').val();
    const commited = $('#CommitedStatus').val() === 'Yes' ? 1 : 0;
    const notes = $('#Notes').val();
    const deal = {
        wholeSaleDealID,
        wholeSaleDealName,
        //startDate,
        customerID,
        brokerID,
        commited,
        notes
    };
    return deal;
}
function Save() {
    SaveDealPart();
    alertify.success('Deal parts saved!');
    const deal = GetNewDealInfo();
    selectedDealID = GetSelectedDealID();
    const wholeSaleDealID = '' + GetSelectedDealID();
    const wholeSaleDealName = $('#InputName').val();
    const startDate = Date.parse($('#StartDate').val());
    const customerID = +$('#CustomerSelect').val();
    const brokerID = +$('#BrokerSelect').val();
    const commited = $('#CommitedStatus').val() === 'Yes' ? 1 : 0;
    const notes = $('#Notes').val();
    const url = "api/test/Deal/Update";
    const fullUrl = `${window.location.origin}/${url}`;
    fetch(fullUrl, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ wholeSaleDealID, wholeSaleDealName, customerID, brokerID, commited, notes, startDate }), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    }).then(resp => alertify.success('Deal info saved!'));
    renderDeal();


}

function SaveNewDeal() {
    let msg = "Are you sure you want to add a new deal?";
    alertify.confirm(msg, function (e) {
        if (e) {
            //const deal = GetNewDealInfo();
            //selectedDealID = GetSelectedDealID();
            const wholeSaleDealID = '0';
            const wholeSaleDealName = $('#InputName').val();
            const startDate = Date.parse($('#StartDate').val());
            const customerID = +$('#CustomerSelect').val();
            const brokerID = +$('#BrokerSelect').val();
            const commited = $('#CommitedStatus').val() === 'Yes' ? 1 : 0;
            const notes = $('#Notes').val();
            const url = "api/test/Deal/Create";
            const fullUrl = `${window.location.origin}/${url}`;
            fetch(fullUrl, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify({ wholeSaleDealID, wholeSaleDealName, customerID, brokerID, commited, notes, startDate }), // тип данных в body должен соответвовать значению заголовка "Content-Type"
            }).then(async resp => {
                const parts = GetPartsValue();
                const id = await resp.json();
                const url = "api/test/Deal/PartsUpdate/" + id;
                const fullUrl = `${window.location.origin}/${url}`;
                console.log(parts);
                fetch(fullUrl, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, cors, *same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrer: 'no-referrer', // no-referrer, *client
                    body: JSON.stringify(parts), // тип данных в body должен соответвовать значению заголовка "Content-Type"
                })
            });
            renderDeal();
            var msg = "The " + "Save new deal" + " confirmed";
            alertify.success(msg);
        } else {
            alertify.error("Nothing completed");
        }
    });
}
/*public string WholeSaleDealID { get; set; }

        public string WholeSaleDealName { get; set; }

        public DateTime StartDate { get; set; }

        public int Committed { get; set; }
         public int CustomerID { get; set; }

        public int BrokerID { get; set; }

        public string Notes { get; set; }
        */