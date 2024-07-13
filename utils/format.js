const convertUTC = (time) => {
    const newTime = new Date(time + '.000Z');
    newTime.setHours(newTime.getHours() - 9);
    newTime.setFullYear(2024, 6, 20);

    return newTime;
}

module.exports = { convertUTC }