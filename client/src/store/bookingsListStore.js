import {observable, action} from 'mobx';

const initialState = {
    filters: {},
    bookingEntries: []
};

class BookingsListStore {
    @observable store = initialState;

    @action('Set booking entries')
    setBookingEntries = (bookingEntries) => {
        this.store.bookingEntries = bookingEntries;
    };

    @action('update filters')
    updateFilters = (name, value) => {
        this.store.filters = {
            ...this.store.filters,
            [name]: value
        };
    };
}

export default BookingsListStore;