const createTime = (time) => {
    const newTime = new Date('2024-07-20T00:00:00.000Z');
    const [hour, minute] = time.split(':');
    newTime.setHours(Number(hour));
    newTime.setMinutes(Number(minute));

    return newTime;
}

module.exports = { createTime }