import {parse, stringify} from 'flatted/esm';
import dequal from 'dequal';
import {differenceInMinutes} from 'date-fns';
import {getStores} from './store/getStores';
import i18n from 'i18next';
import Wix from 'wix-sdk';
import {get} from 'lodash';
import moment from 'moment-timezone';

/**
 * custom console.log for outputting mobx store variables
 * used to avoid the Proxy print of mobx store variables
 * @param args
 */
window.console.logx = (...args) => console.log(...args.map(arg => !arg ? arg : parse(stringify(arg))));

export const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * set the wix instance id in the session storage
 * fallback to dev instance id for development purposes (defined in .env)
 */
export const getWixInstanceId = () => {
    let instanceId;
    try {
        if (isDevelopment) {
            instanceId = process.env.DEV_INSTANCE_ID;
        } else {
            instanceId = Wix.Utils.getInstanceId();
        }
    } catch (e) {
        console.log(e);
    }
    return instanceId;
};

/**
 * add days to a given date
 * @param daysDifference
 * @returns {Date}
 */
export const addDays = (daysDifference) => {
    const now = moment();
    return now.add(daysDifference, 'days').toDate();
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
    const difference = Math.abs(differenceInMinutes(moment(t1).toDate(), moment(t2).toDate()) / 60);
    return Number.isInteger(difference) ? difference : parseFloat(difference).toFixed(2);
};

export const raiseNotification = (text, theme) => {
    const {bookingsNotificationStore} = getStores('bookingsNotificationStore');
    bookingsNotificationStore.setNotification(text, theme);
};

export const handleResponseError = (e) => {
    const message = get(e, 'response.data.message');
    raiseNotification(message, 'error');
};

export const pause = async (t) => (new Promise(resolve => setTimeout(resolve, t)));

export const translate = (...args) => i18n.t(...args);

export const isBookingOneOnOne = (booking) => {
    const {bookedEntity = {}} = booking;
    const {tags = []} = bookedEntity;
    return tags.includes('INDIVIDUAL');
};

export const isBookingSingleSession = (booking) => {
    const {bookedEntity = {}} = booking;
    const {singleSession} = bookedEntity;
    return !!singleSession;
};

export const shorthandDateOnlyFormat = 'll';
export const dateOnlyWithoutYearFormat = 'DD MMM';
export const timeOnlyFormat = 'HH:mm a';
export const dayHourFormat = 'MMM D, HH:mm a';