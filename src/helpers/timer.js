const getHourRangeForDate = (date) => {
    const selectedDate = new Date(date);
    const startHour = new Date(selectedDate).setMinutes(0, 0, 0); // Set minutes and seconds to 0
    const endHour = new Date(selectedDate).setMinutes(59, 59, 999); // Set minutes to 59 and seconds to 999

    return [new Date(startHour), new Date(endHour)];
};

const getDay = (date) => {
    const currDate = new Date(date);
    currDate.setHours(0, 0, 0, 0); // Set time to midnight for the start of the day

    const nextDate = new Date(currDate);
    nextDate.setDate(currDate.getDate() + 1);

    return [currDate, nextDate]
}

const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for the start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [today, tomorrow]
}

const getYesterday = () => {
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day
    
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 1); // Subtract 1 to get the start of yesterday
    startDate.setHours(0, 0, 0, 0);

    return [startDate, endDate];
};

const getLast7Days = (date) => {
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6); // Subtract 6 to get the start of the last 7 days
    startDate.setHours(0, 0, 0, 0);

    return [startDate, endDate];
};

const getMonth = (date) => {
    const startOfMonth = new Date(date);
    startOfMonth.setHours(0, 0, 0, 0); // Set time to midnight
    startOfMonth.setDate(1); // Move to the beginning of the month

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1, 0); // Move to the last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    return [startOfMonth, endOfMonth];
}

const getYear = (date) => {
    const startOfYear = new Date(date);
    startOfYear.setHours(0, 0, 0, 0); // Set time to midnight
    startOfYear.setMonth(0, 1); // Move to the beginning of the year

    const endOfYear = new Date(startOfYear);
    endOfYear.setFullYear(startOfYear.getFullYear() + 1);
    endOfYear.setMilliseconds(endOfYear.getMilliseconds() - 1); // Set to the last millisecond of the last day of the year

    return [startOfYear, endOfYear];
}

module.exports = { timer: {getHourRangeForDate, getDay, getToday, getYesterday, getLast7Days, getMonth, getYear} };
