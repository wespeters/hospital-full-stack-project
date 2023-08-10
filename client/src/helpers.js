export const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    let period = 'AM';
    let hour12 = parseInt(hours);

    if (hour12 >= 12) {
        period = 'PM';
        if (hour12 > 12) hour12 -= 12;
    } else if (hour12 === 0) {
        hour12 = 12;
    }

    return `${hour12}:${minutes} ${period}`;
};
