import mobxRoot from './index';

/**
 * custom useStores hooks => return given stores
 * usage:
 *
 * const {bookingsListStore, bookingsNotificationStore} = getStores('bookingsListStore', 'bookingsNotificationStore')
 * @param args
 * @return {*}
 */
export const getStores = (...args) => {
    return args.reduce((acc, curr) => {
        acc[curr] = mobxRoot[curr];
        return acc;
    }, {});
};
