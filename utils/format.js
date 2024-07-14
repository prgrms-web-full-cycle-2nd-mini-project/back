const createTime = (time) => {
    const [hour, minute] = time.split(':');
    const newTime = new Date(`2024-07-20T${hour}:${minute}:00.000Z`);
    newTime.setHours(newTime.getHours() - 9);

    return newTime;
}

module.exports = { createTime }