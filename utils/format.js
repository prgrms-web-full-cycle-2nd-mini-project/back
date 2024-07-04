const getLocalTime = (time) => {
    const newTime = new Date(time);
    newTime.setHours(newTime.getHours() + 9);

    return newTime;
}

module.exports = { getLocalTime }