import {observable, action} from 'mobx';

export interface BookingEntry {
    id?: string;
    title: string;
}

export interface InitialState {
    filters: Record<any, any>;
    bookingEntries: Array<BookingEntry>;
}

const initialState: InitialState = {
    filters: {},
    bookingEntries: []
};

class BookingsListStore {
    @observable store = initialState;

    @action('Set booking entries')
    setBookingEntries = (bookingEntries: Array<BookingEntry>) => {
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