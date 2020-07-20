import {observable, action} from 'mobx';
import axiosInstance from '../network';
import mockData from './mockData';

// TODO: set to false on production or get rid of the entire mocking mechanism
const USE_MOCK = true;

const initialState = {
    filters: {},
    services: {},
    resources: {},
    staff: {},
    bookingsEntries: [],
    metadata: null
};

const getData = async (endpoint, config) => {
    if (USE_MOCK && mockData[endpoint]) {
        return {data: mockData[endpoint]};
    }

    return axiosInstance.get(`/${endpoint}`, config);
};

class BookingsListStore {
    @observable store = initialState;

    @action('Set booking entries')
    setBookingsEntries = (bookingsEntries) => {
        this.store.bookingsEntries = bookingsEntries.map(bookingsEntry => ({...bookingsEntry, focused: false}));
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

    @action('Set metadata')
    setMetadata = (metadata) => {
        this.store.metadata = metadata;
    };


    @action('Load services')
    loadConstants = async () => {
        try {
            // const result = await Promise.all([axiosInstance.get('/services'), axiosInstance.get('/resources')]);
            const result = await Promise.all([getData('services'), getData('resources')]);

            const services = result[0].data.services;
            const resources = result[1].data.resources;
            this.setServices(services);
            this.setResources(resources);

        } catch (e) {
            console.log({e});
        }
    };

    @action('update filters')
    updateFilters = (name, value) => {
        this.store.filters = {
            ...this.store.filters,
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
            'query.filter.stringValue': {
                status: filters.status,
                ...dateRange
            }
        };
    };

    @action('fetch data')
    fetchData = async () => {
        const {filters} = this.store;
        const requestConfig = {
            params: {
                ...this.prepareFilters(filters)
            }
        };

        try {
            // const result = await axiosInstance.get('/bookings', requestConfig);
            const result = await getData('bookings', requestConfig);
            const {data} = result;
            this.setBookingsEntries(data.bookingsEntries);
            this.setMetadata(data.metadata);
        } catch (e) {

        }
    };

    @action('Set row focused')
    setRowFocused = (row, focused) => {
        row.focused = focused;
    };
}

export default BookingsListStore;