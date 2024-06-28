import {  format } from "date-fns";
export const formatDateTime = dateString => {
    if (!dateString) {
        return "No date";
    }

    const formattedDate = format(new Date(dateString), "yyyy MMMM dd, HH:mm", {
        timeZone: "UTC"
    });

    return formattedDate;
};

export const generateOTP = length => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charsetLength = charset.length;
    let otp = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        otp += charset[randomIndex];
    }
    return otp;
};

export const diffDays = (date, days) => {
  
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - date;
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays < days;
};

export const diffSec = (raw, sec) => {
    const currentDate = new Date();
    const date = new Date(raw);
    

    const differenceInMilliseconds = currentDate - date;
    const differenceInSecs = differenceInMilliseconds / 1000;
    return differenceInSecs;
    // return differenceInSecs < sec;
};
