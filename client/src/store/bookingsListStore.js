import {observable, action} from 'mobx';
import axiosInstance from '../network';
import mockData from './mockData';
import {SORT_ORDER} from './constants';
import {raiseNotification, pause} from '../utils';
import {uuid} from 'uuidv4';

// TODO: set to false on production or get rid of the entire mocking mechanism
const USE_MOCK = false;

const rescheduleModalInitialState = {
    isOpen: false,
    slots: [],
    selectedSlot: {},
    data: null,
    loading: false
};

const initialState = {
    filters: {},
    sort: {},
    paging: {offset: 0, limit: 10},
    services: {},
    resources: {},
    staff: {},
    bookingsEntries: [],
    bookingsMetadata: null,
    rescheduleModal: rescheduleModalInitialState,
    loadingBookings: true
};


const getData = async (endpoint, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        return {data: mockData[endpoint]};
    }

    return axiosInstance.get(`/${endpoint}`, config);
};

const postData = async (endpoint, payload, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        await pause(2000);
        return {data: mockData[endpoint]};
    }

    return axiosInstance.post(`/${endpoint}`, payload, config);
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

    @action('Set bookingsMetadata')
    setBookingsMetadata = (bookingsMetadata) => {
        this.store.bookingsMetadata = bookingsMetadata;
    };


    @action('Load services')
    loadConstants = async () => {
        try {
            // const result = await Promise.all([axiosInstance.get('/services'), axiosInstance.get('/resources')]);
            const result = await Promise.all([getData('services', true), getData('resources', true)]);

            const services = result[0].data.services;
            const resources = result[1].data.resources;
            this.setServices(services);
            this.setResources(resources);
        } catch (e) {
            console.log({e});
            raiseNotification(e.message, 'error');
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
            dateRange.endTime = {'$lt': filters.endTime};
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
        const pagingObject = {};
        if (paging.limit !== undefined) {
            pagingObject['query.paging.limit'] = paging.limit;
        }
        if (paging.offset !== undefined) {
            pagingObject['query.paging.offset'] = paging.offset;
        }
        return pagingObject;
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
            // const result = await axiosInstance.get('/bookings', requestConfig);
            const result = await getData('bookings', requestConfig);
            const {data} = result;
            this.setBookingsEntries(data.bookingsEntries, concatenate);
            this.setBookingsMetadata(data.metadata);
        } catch (e) {
            console.log({e});
            raiseNotification(e.message, 'error');
        }
        this.setLoadingBookings(false);
    };

    @action('Set reschedule modal is open')
    setRescheduleModalIsOpen = (rescheduleModalIsOpen) => {
        this.store.rescheduleModal.isOpen = rescheduleModalIsOpen;
    };

    @action('Set reschedule modal data')
    setRescheduleModalData = (key, value) => {
        this.store.rescheduleModal[key] = value;
    };

    @action('Set selected slot')
    setSelectedSlot = (slots, selectedSlot) => {
        console.logx(slots, selectedSlot);
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

            // const result = await axiosInstance.post(`/calendar/listSlots`, requestBody, {headers: {'Content-Type': 'application/json'}});
            const result = await postData(`calendar/listSlots`, requestBody, {headers: {'Content-Type': 'application/json'}});
            const {data} = result;

            const slots = data.slots.map(slot => ({
                ...slot,
                clientId: uuid()
            }));

            this.setRescheduleModalData('slots', slots);
        } catch (e) {
            console.log({e});
            raiseNotification(e.message, 'error');
        }
        this.setLoadingScheduleSlots(false);
    };

    @action('Set row focused')
    setRowFocused = (row, focused) => {
        row.focused = focused;
    };
}

export default BookingsListStore;