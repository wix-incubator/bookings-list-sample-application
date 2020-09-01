import {observable, action} from 'mobx';
import axiosInstance from '../network';
import mockData from './mockData';
import {SORT_ORDER} from './constants';
import {handleResponseError, pause} from '../utils';
import {uuid} from 'uuidv4';
import {get} from 'lodash';
import {formatDate} from 'wix-style-react/src/LocaleUtils';


// TODO: set to false on production or get rid of the entire mocking mechanism
const USE_MOCK = process.env.USE_MOCKS === 'true';

const rescheduleModalInitialState = {
    isOpen: false,
    slots: null,
    selectedSlot: null,
    data: null,
    loading: false,
    errorMessage: ''
};

const replaceStaffModalInitialState = {
    isOpen: false,
    currentStaffMember: null,
    selectedStaffMember: null,
    data: null,
    loading: false,
    errorMessage: ''
};

const paymentModalInitialState = {
    isOpen: false,
    data: null,
    loading: false
};

const initialState = {
    filters: {},
    sort: {},
    paging: {offset: 0, limit: 15},
    services: {},
    resources: {},
    siteProperties: {},
    staff: {},
    bookingsEntries: [],
    bookingsMetadata: null,
    rescheduleModal: rescheduleModalInitialState,
    replaceStaffModal: replaceStaffModalInitialState,
    paymentModal: paymentModalInitialState,
    loadingBookings: true,
    constantsLoaded: false
};

/**
 * wrapper for GET method
 * returns mock data if the USE_MOCK flag === true and there is available mock data for the EP
 * @param endpoint
 * @param config
 * @returns Object
 */
const getData = async (endpoint, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        return {data: mockData[endpoint]};
    }

    return axiosInstance.get(`/${endpoint}`, config);
};

/**
 * wrapper for POST method
 * returns mock data if the USE_MOCK flag === true and there is available mock data for the EP
 * @param endpoint
 * @param payload
 * @param config
 * @returns Object
 */
const postData = async (endpoint, payload, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        await pause(2000);
        return {data: mockData[endpoint]};
    }

    return axiosInstance.post(`/${endpoint}`, payload, config);
};

const patchData = async (endpoint, payload, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        await pause(2000);
        return {data: mockData[endpoint]};
    }

    return axiosInstance.patch(`/${endpoint}`, payload, config);
};

class BookingsListStore {
    constructor(mobxRoot) {
        this.mobxRoot = mobxRoot;
    }

    @observable store = initialState;

    @action('Set loading bookings')
    setLoadingBookings = (loadingBookings) => {
        this.store.loadingBookings = loadingBookings;
    };

    @action('Set loading schedule slots')
    setLoadingScheduleSlots = (loadingScheduleSlots) => {
        this.store.rescheduleModal.loading = loadingScheduleSlots;
    };

    @action('Rest bookings entries')
    resetBookingsEntries = () => {
        this.updatePaging('offset', 0);
        this.store.bookingsMetadata = null;
        this.store.bookingsEntries = [];
    };

    @action('Set bookings entries')
    setBookingsEntries = (bookingsEntries, concatenate) => {
        const mappedData = bookingsEntries.map(bookingsEntry => ({...bookingsEntry, focused: false}));
        if (concatenate) {
            this.store.bookingsEntries.push(...mappedData);
        } else {
            this.store.bookingsEntries = mappedData;
        }
    };

    @action('Set services')
    setServices = (services) => {
        this.store.services = services.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});
    };

    @action('Set resources')
    setResources = (resources) => {
        this.store.resources = resources.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});

        this.store.staff = resources.reduce((acc, curr) => {
            if (curr.tags.includes('staff')) {
                acc[curr.id] = curr;
            }
            return acc;
        }, {});
    };

    @action('Set site properites')
    setSiteProperties = (siteProperties) => {
        this.store.siteProperties = siteProperties;
    };

    @action('Set bookingsMetadata')
    setBookingsMetadata = (bookingsMetadata) => {
        this.store.bookingsMetadata = bookingsMetadata;
    };

    @action('Load constants')
    loadConstants = async () => {
        try {
            const result = await getData('constants');
            const {data} = result;
            const {services, resources, siteProperties} = data;
            this.setServices(services);
            this.setResources(resources);
            this.setSiteProperties(siteProperties);
            this.store.constantsLoaded = true;
        } catch (e) {
            handleResponseError(e);
        }
    };

    @action('Update filters')
    updateFilters = (name, value) => {
        this.store.filters = {
            ...this.store.filters,
            [name]: value
        };
    };

    /**
     * sort object is stored as:
     * {
     *  fieldName1: {fieldName: fieldName1, order: ASC | DESC},
     *  fieldName2: {fieldName: fieldName2, order: ASC | DESC}
     * }
     * @param fieldName
     */
    @action('Update sort')
    updateSort = (fieldName) => {
        const fieldNameSort = this.store.sort[fieldName];
        if (!fieldNameSort) {
            // first click => order by ASC
            this.store.sort[fieldName] = {fieldName, order: SORT_ORDER.ASC};
        } else if (fieldNameSort && fieldNameSort.order === SORT_ORDER.ASC) {
            // second click => order by DESC
            fieldNameSort.order = SORT_ORDER.DESC;
        } else if (fieldNameSort && fieldNameSort.order === SORT_ORDER.DESC) {
            // third click => reset sort of the field
            delete this.store.sort[fieldName];
        }
    };

    @action('Update paging')
    updatePaging = (name, value) => {
        this.store.paging = {
            ...this.store.paging,
            [name]: value
        };
    };

    prepareFilters = (filters) => {
        const dateRange = {};
        if (filters.startTime) {
            dateRange.startTime = {'$gte': filters.startTime};
        }
        if (filters.endTime) {
            dateRange.endTime = {'$lte': filters.endTime};
        }

        return {
            withBookingAllowedActions: true,
            'query.filter.stringValue': {
                status: filters.status,
                ...dateRange
            }
        };
    };

    /**
     * returns a query sort array derived from the sort object
     * @param sort
     * @returns {{'query.sort': *[]}|{}}
     */
    prepareSort = (sort) => {
        const sortParams = Object.keys(sort).reduce((acc, key) => {
            acc.push({...sort[key]});

            return acc;
        }, []);

        if (sortParams.length) {
            // TODO: activate this once the API is implemented
            //  should be one of the options below
            return {
                // 'query.sort': JSON.stringify(sortParams).replace('[', '').replace(']', '')
                // 'query.sort': JSON.stringify(sortParams)
                // 'query.sort': sortParams
            };
        }

        return {};
    };

    preparePaging = (paging) => {
        return Object.keys(paging).reduce((acc, curr) => {
            acc[`query.paging.${curr}`] = paging[curr];
            return acc;
        }, {});
    };

    @action('Fetch data')
    fetchData = async (concatenate = false) => {
        const {filters, sort, paging} = this.store;
        const requestConfig = {
            params: {
                ...this.prepareFilters(filters),
                ...this.prepareSort(sort),
                ...this.preparePaging(paging)
            }
        };

        this.setLoadingBookings(true);
        try {
            const result = await getData('bookings', requestConfig);
            const {data} = result;
            this.setBookingsEntries(data.bookingsEntries, concatenate);
            this.setBookingsMetadata(data.metadata);
        } catch (e) {
            handleResponseError(e);
        }
        this.setLoadingBookings(false);
    };

    @action('Set reschedule modal is open')
    setRescheduleModalIsOpen = (rescheduleModalIsOpen) => {
        this.store.rescheduleModal.isOpen = rescheduleModalIsOpen;
        if (!rescheduleModalIsOpen) {
            this.store.rescheduleModal = rescheduleModalInitialState;
        }
    };

    @action('Set reschedule modal data')
    setRescheduleModalData = (key, value) => {
        this.store.rescheduleModal[key] = value;
    };

    @action('Fetch schedule data')
    fetchScheduleSlots = async (scheduleId) => {
        this.setLoadingScheduleSlots(true);
        try {
            const requestBody = `{
                "query": {
                   "filter": "{\\"scheduleIds\\":[\\"${scheduleId}\\"]}",
                   "paging": {"limit": 5}
                 }
             }`;

            const result = await postData(`calendar/listSlots`, requestBody, {headers: {'Content-Type': 'application/json'}});
            const {data} = result;

            const slots = data.slots.map(slot => ({
                ...slot,
                clientId: uuid()
            }));

            this.setRescheduleModalData('slots', slots);
        } catch (e) {
            handleResponseError(e);
        }
        this.setLoadingScheduleSlots(false);
    };

    @action('Reschedule booking')
    rescheduleBooking = async (bookingId, selectedSlot) => {
        try {
            const requestBody = {
                participantNotification: {
                    notifyParticipants: false
                },
                createSession: {
                    scheduleId: selectedSlot.scheduleId,
                    start: selectedSlot.start,
                    end: selectedSlot.end,
                    affectedSchedules: selectedSlot.affectedSchedules.map(affectedSchedule => ({scheduleId: affectedSchedule.scheduleId, transparency: affectedSchedule.transparency}))
                }
            };

            const result = await postData(`bookings/${bookingId}/reschedule`, requestBody);
            const {data} = result;
            const {booking} = data;
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            if (bookingEntryIndex > -1 && booking) {
                this.store.bookingsEntries[bookingEntryIndex].booking = booking;
            }
            return true;

        } catch (e) {
            const message = get(e, 'response.data.message');
            this.setRescheduleModalData('errorMessage', message);
            return false;
        }
    };

    @action('Set replace staff modal is open')
    setReplaceStaffModalIsOpen = (replaceStaffModalIsOpen) => {
        this.store.replaceStaffModal.isOpen = replaceStaffModalIsOpen;
        if (!replaceStaffModalIsOpen) {
            this.store.replaceStaffModal = replaceStaffModalInitialState;
        }
    };

    @action('Set replace staff modal data')
    setReplaceStaffModalData = (key, value) => {
        this.store.replaceStaffModal[key] = value;
    };

    @action('Replace staff member')
    replaceStaffMember = async (bookingId, sessionId, staffMemberScheduleId, startTimestamp, endTimestamp) => {
        try {
            const requestBody = {
                sessionId,
                payload: {
                    session: {
                        affectedSchedules: [{scheduleId: staffMemberScheduleId, transparency: 'BUSY'}],
                        start: {timestamp: startTimestamp},
                        end: {timestamp: endTimestamp}
                    },
                    updated: {
                        paths: ['affectedSchedules']
                    }
                }
            };

            const result = await patchData(`bookings/${bookingId}/replaceStaff`, requestBody);
            const {booking} = result.data;
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            const bookingIndexTest = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === booking.id);
            if (bookingEntryIndex > -1 && booking) {
                this.store.bookingsEntries[bookingEntryIndex].booking = booking;
            }
            return true;
        } catch (e) {
            const message = get(e, 'response.data.message');
            this.setReplaceStaffModalData('errorMessage', message);
            return false;
        }
    };

    @action('Fetch available staff')
    fetchAvailableStaff = async (booking) => {
        this.setReplaceStaffModalData('loading', true);
        try {
            const scheduleIds = Object.values(this.store.staff).flatMap(staffMember => staffMember.schedules.map(schedule => schedule.id));

            const {singleSession = {}} = booking.bookedEntity;
            const {start: from, end: to} = singleSession;

            const requestBody = `{
                "query": {
                   "filter": "{\\"scheduleIds\\":[\\"${scheduleIds.join('\\",\\"')}\\"],\\"from\\":\\"${formatDate(from)}\\",\\"to\\":\\"${formatDate(to)}\\",\\"isAvailable\\": true}"
                 }
             }`;

            const result = await postData(`calendar/listSlots`, requestBody, {headers: {'Content-Type': 'application/json'}});
            const {data} = result;

            const slots = data.slots.map(slot => ({
                ...slot,
                clientId: uuid()
            }));

            this.setReplaceStaffModalData('slots', slots);
        } catch (e) {
            handleResponseError(e);
        }
        this.setReplaceStaffModalData('loading', false);
    };

    @action('Set payment modal is open')
    setPaymentModalIsOpen = (paymentModalIsOpen) => {
        this.store.paymentModal.isOpen = paymentModalIsOpen;
        if (!paymentModalIsOpen) {
            this.store.paymentModal = paymentModalInitialState;
        }
    };

    @action('Set payment modal data')
    setPaymentModalData = (key, value) => {
        this.store.paymentModal[key] = value;
    };

    @action('Mark booking as paid')
    markBookingAsPaid = async (bookingId) => {
        try {
            const result = await postData(`bookings/${bookingId}/markAsPaid`);
            const {data} = result;
            const {booking} = data;
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            if (bookingEntryIndex > -1 && booking) {
                this.store.bookingsEntries[bookingEntryIndex].booking = booking;
            }
            return true;
        } catch (e) {
            handleResponseError(e);
            return false;
        }
    };

    @action('Set row focused')
    setRowFocused = (row, focused) => {
        row.focused = focused;
    };

    @action('Set booking loading')
    setBookingLoading = (bookingId, loading) => {
        const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
        if (bookingEntryIndex > -1) {
            this.store.bookingsEntries[bookingEntryIndex].booking.loading = loading;
        }
    };

    @action('Confirm booking')
    confirmBooking = async (bookingId) => {
        try {
            this.setBookingLoading(bookingId, true);
            const result = await postData(`bookings/${bookingId}/confirm`);
            this.setBookingLoading(bookingId, false);
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            if (bookingEntryIndex > -1) {
                this.store.bookingsEntries[bookingEntryIndex].booking.status = 'CONFIRMED';
            }
        } catch (e) {
            handleResponseError(e);
        }
    };

    @action('Decline booking')
    declineBooking = async (bookingId) => {
        try {
            this.setBookingLoading(bookingId, true);
            const result = await postData(`bookings/${bookingId}/decline`);
            this.setBookingLoading(bookingId, false);
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            if (bookingEntryIndex > -1) {
                this.store.bookingsEntries[bookingEntryIndex].booking.status = 'DECLINED';
            }
        } catch (e) {
            handleResponseError(e);
        }
    };


    @action('Set attendance')
    setAttendance = async (bookingId, attendanceStatus, numberOfAttendees) => {
        try {
            const requestBody = {
                attendanceInfo: {
                    attendanceStatus,
                    numberOfAttendees
                }
            };
            this.setBookingLoading(bookingId, true);
            const result = await postData(`bookings/${bookingId}/setAttendance`, requestBody);
            this.setBookingLoading(bookingId, false);
            const {data} = result;
            const {booking} = data;
            const bookingEntryIndex = this.store.bookingsEntries.findIndex(bookingEntry => bookingEntry.booking.id === bookingId);
            if (bookingEntryIndex > -1 && booking) {
                this.store.bookingsEntries[bookingEntryIndex].booking = booking;
            }
        } catch (e) {
            handleResponseError(e);
        }
    };
}

export default BookingsListStore;
