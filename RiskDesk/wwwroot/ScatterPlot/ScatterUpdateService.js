const getSelectedMonths = (dropdown) => {
    let indexes = '';
    const options = [...dropdown.selectedOptions];
    for (const opt of options) {
        if (opt.value == '0') return '0';


        if (opt.value.length > 1) {
            if (opt.value == '10') indexes += 'O';

            if (opt.value == '11') indexes += 'N';

            if (opt.value == '11') indexes += 'D';
        } else indexes += opt.value;
    }
    return indexes.length ? indexes : '0';
}

const getSelectedHours = (dropdown) => {
    const hoursArr = [];
    if (dropdown) {
        const options = [...dropdown.selectedOptions];
        for (const opt of options) opt.value === '0' ? '' : hoursArr.push(opt.value);
    }
    return hoursArr.length ? hoursArr.join('h') : '0';
}