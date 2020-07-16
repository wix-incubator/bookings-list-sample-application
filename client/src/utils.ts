export const addDays = (daysDifference: number): Date => {

    const now = (new Date()).getTime();
    return new Date(now + (daysDifference * 24 * 60 * 60 * 1000));
};