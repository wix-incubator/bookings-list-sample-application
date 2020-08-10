import React from 'react';
import {translate} from '../../../utils';
import ColumnText from '../ColumnText/ColumnText';

const NotAvailable = () => {
    return (
        <ColumnText>{translate('BookingsList.TableColumns.notAvailable')}</ColumnText>
    );
};

export default NotAvailable;