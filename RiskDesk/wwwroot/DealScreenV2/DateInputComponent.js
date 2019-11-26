function mapDate(date) {
    const arr = date.slice(0, 10).split('-').reverse();

    return [arr[1], arr[0], arr[2]].join('/');
}