const convertUTC = (time) => {
    const newTime = new Date(time + '.000Z');
    newTime.setHours(newTime.getHours() - 9);

    return newTime;
}

module.exports = { convertUTC }