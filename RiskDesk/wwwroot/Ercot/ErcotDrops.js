const getSelectedMonthsValue = () => {
    const str = getSelectedMonths($('#FilterMonth')[0]);
    return str.length;


}

const getSelectedMonths = (dropdown) => {
    let indexes = '';
    const options = [...dropdown.selectedOptions];
    for (const opt of options) {
        if (opt.value.length > 1) {
            if (opt.value == '10') indexes += 'O';

            if (opt.value == '11') indexes += 'N';

            if (opt.value == '12') indexes += 'D';
        } else indexes += opt.value;
    }
    if (indexes === "0" || indexes === "") return "D";
    return (indexes.length || indexes !== '0') ? indexes : 'D';
}
async function fillHours() {
    const hoursDropdown = document.querySelector('#FilterHours');
    for (let i = 0; i < 24; i++) {
        const index = i + 1;
        hoursDropdown.innerHTML += getSelectOption(index, index);
    }
    $(hoursDropdown).multiselect({
        selectAll: true
    });
}
async function fillMonth() {
    const monthes = (await getMonth()).slice(1);
    const monthDropdown = document.querySelector('#FilterMonth');
    for (const month of monthes) {
        const index = monthes.indexOf(month) + 1;
        monthDropdown.innerHTML += getSelectOption(month.name, index);

    }
    $(monthDropdown).multiselect({
        selectAll: true
    });

}
async function fillCongestionZone() {
    const congestionZones = await getCongestionZones();
    const congestionZonesDropdown = document.querySelector('#FilterCongestionZone');

    for (const zone of congestionZones) {
        const index = congestionZones.indexOf(zone) + 1;
        congestionZonesDropdown.innerHTML += getSelectOption(zone.zone, index);
    }
    $(congestionZonesDropdown).multiselect({

        selectAll: true

    });

}
async function fillWholeSales() {
    const wholeSales = await getWholeSales();

    const wholeSalesDropdown = document.querySelector('#FilterWholeSales');
    for (const block of wholeSales) {

        const index = wholeSales.indexOf(block) + 1;

        wholeSalesDropdown.innerHTML += getSelectOption(block.block, index);

    }
    $(wholeSalesDropdown).multiselect({

        selectAll: true

    });

}
async function fillAccNumbers() {
    const accNumbers = await getAccNumbers();

    const accNumberDropdown = document.querySelector('#FilterAccNumber');
    for (const number of accNumbers) {

        const index = accNumbers.indexOf(number) + 1;

        accNumberDropdown.innerHTML += getSelectOption(number.accNumber, index);

    }
    $(accNumberDropdown).multiselect({

        selectAll: true

    });
}