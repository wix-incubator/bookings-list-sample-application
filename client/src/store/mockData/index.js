import bookings from './bookings';
import services from './services';
import resources from './resources';
import constants from './constants';
import listSlots from './listSlots';

/**
 * mocked data retrieved from https://dev.wix.com/api/rest/wix-bookings
 */
export default {
    bookings,
    services,
    resources,
    constants,
    ["calendar/listSlots"]: listSlots
}