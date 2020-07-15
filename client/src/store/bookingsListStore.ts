import {observable, action} from 'mobx';

export interface BookingEntry {
    id?: string;
    title: string;
}

export interface InitialState {
    bookingEntries: Array<BookingEntry>;
}

const initialState: InitialState = {
    bookingEntries: []
};

class BookingsListStore {
    @observable store = initialState;

    @action('Set booking entries')
    setBookingEntries = (bookingEntries: Array<BookingEntry>) => {
        this.store.bookingEntries = bookingEntries;
    };
}

export default BookingsListStore;