import BookingsListStore from './bookingsListStore';
import BookingsNotificationStore from './bookingsNotificationStore';


class mobxRoot {
    constructor() {
        this.bookingsListStore = new BookingsListStore(this);
        this.bookingsNotificationStore = new BookingsNotificationStore(this);
    }
}

export default new mobxRoot();