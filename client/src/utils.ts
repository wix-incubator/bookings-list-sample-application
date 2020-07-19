import {parse, stringify} from 'flatted/esm';

/**
 * custom console.log for mobx store variables
 * @param args
 */
declare global {
    interface Console {
        logx: (payload: any) => void
    }
}
window.console.logx = (...args) => console.log(...args.map(arg => !arg ? arg : parse(stringify(arg))));

export const addDays = (daysDifference: number): Date => {

    const now = (new Date()).getTime();
    return new Date(now + (daysDifference * 24 * 60 * 60 * 1000));
};

export const noop = () => {

};

