import {parse, stringify} from 'flatted/esm';
import dequal from 'dequal';
import {differenceInMinutes} from 'date-fns';

/**
 * custom console.log for outputting mobx store variables
 * used to avoid the Proxy print of mobx store variables
 * @param args
 */
window.console.logx = (...args) => console.log(...args.map(arg => !arg ? arg : parse(stringify(arg))));

/**
 * add days to a given date
 * @param daysDifference
 * @returns {Date}
 */
export const addDays = (daysDifference) => {
    const now = (new Date()).getTime();
    return new Date(now + (daysDifference * 24 * 60 * 60 * 1000));
};

/**
 * no operation function
 */
export const noop = () => {
};

/**
 * compares two objects using "dequal" library
 * https://github.com/lukeed/dequal
 * @param o1
 * @param o2
 * @returns {boolean}
 */
export const objectsAreEqual = (o1, o2) => {
    return dequal(o1, o2);
};

export const getTimeDifference = (t1, t2) => {
    const difference = Math.abs(differenceInMinutes(new Date(t1), new Date(t2)) / 60);

    return Number.isInteger(difference) ? difference : parseFloat(difference).toFixed(2);
};