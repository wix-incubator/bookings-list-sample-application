import React from 'react';
import {inject, observer} from 'mobx-react';
import {Layout, Cell, Notification} from 'wix-style-react';

const DEFAULT_AUTO_HIDE_TIMEOUT = 3000;

const BookingNotification = inject('bookingsNotificationStore')(observer((props) => {
    const {bookingsNotificationStore} = props;
    const {notifications} = bookingsNotificationStore.store;

    return (
        <Layout gap={'40px'}>
            {
                notifications.map(({id, show, theme, text}) => (
                    <Cell key={id}>
                        <Notification
                            show={show}
                            type={'sticky'}
                            theme={theme}
                            autoHideTimeout={DEFAULT_AUTO_HIDE_TIMEOUT}
                            onClose={() => bookingsNotificationStore.removeNotification(id)}
                        >
                            <Notification.TextLabel>{text}</Notification.TextLabel>
                            <Notification.CloseButton/>
                        </Notification>
                    </Cell>
                ))
            }
        </Layout>
    );
}));

export default BookingNotification;