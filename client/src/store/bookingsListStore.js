import {observable, action} from 'mobx';
import axiosInstance from '../network';

const initialState = {
    filters: {},
    bookingsEntries: [],
    metadata: null
};

class BookingsListStore {
    @observable store = initialState;

    @action('Set booking entries')
    setBookingsEntries = (bookingsEntries) => {
        this.store.bookingsEntries = bookingsEntries;
    };

    @action('Set metadata')
    setMetadata = (metadata) => {
        this.store.metadata = metadata;
    };

    @action('update filters')
    updateFilters = (name, value) => {
        this.store.filters = {
            ...this.store.filters,
            [name]: value
        };
    };

    @action('fetch data')
    fetchData = async () => {

        try {
            const result = await axiosInstance.get('/bookings');
            const {data} = result;
            this.setBookingsEntries(data.bookingsEntries);
            this.setMetadata(data.metadata);
        } catch (e) {

        }
    };
}

export default BookingsListStore;