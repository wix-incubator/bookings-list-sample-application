import {observable, action} from 'mobx';
import {uuid} from 'uuidv4';

const initialState = {
    notifications: []
};

class BookingsNotificationStore {
    constructor(mobxRoot) {
        this.mobxRoot = mobxRoot;
    }

    @observable store = initialState;

    @action('Set notification')
    setNotification = (text, theme = 'success') => {
        const notification = {
            id: uuid(),
            text,
            theme,
            show: true
        };

        this.store.notifications.push(notification);
    };

    @action('Remove notification')
    removeNotification = (notificationId) => {
        this.store.notifications = this.store.notifications.filter(notification => notification.id !== notificationId);
    };
}

export default BookingsNotificationStore;