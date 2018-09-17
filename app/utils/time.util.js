const timestampToDate = (timestamp) => {
    const dateObj = new Date(parseInt(timestamp)*1000);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth()+1;
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();

    return `${year}년 ${month}월 ${date}일 ${hour}시 ${min}분`;
};

const timestampToMonthDate = (timestamp) => {
    const dateObj = new Date(timestamp*1000);

    const month = dateObj.getMonth()+1;
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();

    return `${month}월 ${date}일 ${hour}시 ${min}분`;
};


const timestampToTime = (timestamp) => {
    const dateObj = new Date(timestamp*1000);

    const hour = dateObj.getHours();
    const min = dateObj.getMinutes();

    return `${hour}시 ${min}분`;
};

const dateStringToTimestamp = (dateString) => {
    return Date.parse(dateString) / 1000;
};

module.exports = {
    timestampToDate,
    timestampToMonthDate,
    timestampToTime,
    dateStringToTimestamp
};