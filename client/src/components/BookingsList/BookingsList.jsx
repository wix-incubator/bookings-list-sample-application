import React from 'react';
import PropTypes from 'prop-types';
import {st, classes} from './BookingsList.st.css';
import {Page, Table, Card, TableToolbar, Dropdown, Loader, Text} from 'wix-style-react';
import CalendarPanelDatePicker from '../CalendarPanelDatePicker';
import BookingsListColumn from '../BookingsListColumn';
import {addDays, translate} from '../../utils';
import {observer} from 'mobx-react';
import BookingNotification from '../BookingNotification/BookingNotification';

function getDefaultPresets() {
    return [
        {
            id: 1,
            selectedDays: {
                from: addDays(-30),
                to: new Date()
            },
            value: translate('lastNDays', {count: 30})
        }, {
            id: 2,

            selectedDays: {
                from: addDays(-7),
                to: new Date()
            },
            value: translate('lastNDays', {count: 7})
        }
    ];
}

const getBookingStatuses = () => [
    {id: 'CONFIRMED', value: translate('BookingStatus.confirmed')},
    {id: 'PENDING', value: translate('BookingStatus.pending')},
    {id: 'CANCELED', value: translate('BookingStatus.cancelled')},
    {id: 'PENDING_APPROVAL', value: translate('BookingStatus.pendingApproval')},
    {id: 'PENDING_CHECKOUT', value: translate('BookingStatus.pendingCheckout')},
    {id: 'DECLINED', value: translate('BookingStatus.declined')}
    // {id: 'UNDEFINED', value: translate('BookingStatus.undefined')}
];

@observer
export default class BookingsList extends React.Component {
    _renderBookingsListHeaderTitle = () => {
        const {constantsLoaded, bookingsMetadata} = this.props;

        const bookingsCount = constantsLoaded && bookingsMetadata ?
            <h4 className={st(classes.title, classes.amount)}>{this._getBookingEntries().length}/{bookingsMetadata.totalCount}</h4>
            :
            null;

        return (
            <div>
                <h4 className={st(classes.title)}>{translate('BookingsList.pageHeaderTitle')}</h4>
                {bookingsCount}
            </div>
        );
    };

    _renderBookingsListHeaderSubtitle = () => {
        return (
            <label>{translate('BookingsList.pageHeaderSubtitle')}</label>
        );
    };

    _onBookingDateRangeChanged = (value) => {
        this.props.onFilterChanged('dateRange', value);
    };

    _getCalendarPanelDatePickerProps = () => {
        const {filters, calendarPresets} = this.props;
        return {
            primaryActionOnClick: this._onBookingDateRangeChanged,
            dateFormat: 'MMM DD, YYYY',
            presets: calendarPresets || getDefaultPresets(),
            value: filters.dateRange,
            primaryActionLabel: translate('submit'),
            secondaryActionLabel: translate('cancel'),
            popoverProps: {
                placement: 'top-start',
                zIndex: 2
            }
        };
    };

    _onBookingStatusChanged = (bookingStatus) => {
        const {filters} = this.props;
        if (filters.status === bookingStatus.id) {
            return;
        }
        this.props.onFilterChanged('status', bookingStatus.id);
    };

    _onBookingSortChanged = (column) => {
        this.props.onSortChanged(column.fieldName);
    };

    _renderBookingsListToolbar = () => {
        const {filters} = this.props;

        return (
            <Card>
                <TableToolbar>
                    <TableToolbar.ItemGroup position="start">
                        <TableToolbar.Item>
                            <TableToolbar.Label>
                                <CalendarPanelDatePicker
                                    {...this._getCalendarPanelDatePickerProps()}
                                />
                            </TableToolbar.Label>
                        </TableToolbar.Item>
                        <TableToolbar.Item>
                            <TableToolbar.Label>
                                <Dropdown
                                    roundInput
                                    placeholder={translate('BookingStatus.allBookingStatuses')}
                                    options={getBookingStatuses()}
                                    selectedId={filters.status}
                                    onSelect={this._onBookingStatusChanged}
                                    onClear={this._onBookingStatusChanged}
                                    closeOnSelect={false} // not sure why this is working this way... bug in the library?
                                />
                            </TableToolbar.Label>
                        </TableToolbar.Item>
                    </TableToolbar.ItemGroup>
                </TableToolbar>
            </Card>
        );
    };

    _getBookingEntries = () => {
        const {constantsLoaded, bookingEntries} = this.props;
        if (!constantsLoaded) {
            return [];
        }
        return bookingEntries;
    };

    _getBookingColumns = () => {
        const {services, staff, filters, sort} = this.props;

        return [
            {fieldName: 'created', sortable: true, localeLabelKey: 'bookingTime', render: row => <BookingsListColumn.BookingTime data={row}/>},
            {fieldName: 'formInfo.contactDetails.firstName', sortable: true, localeLabelKey: 'clientName', render: row => <BookingsListColumn.ClientName data={row}/>},
            {
                fieldName: '',
                localeLabelKey: 'serviceAndSession',
                width: '17%',
                render: row => <BookingsListColumn.ServiceAndSession services={services} onCalendarClick={this.props.openRescheduleBookingModal} data={row}/>
            },
            {fieldName: '', localeLabelKey: 'staff', render: row => <BookingsListColumn.Staff staff={staff} data={row}/>},
            {fieldName: '', localeLabelKey: 'bookingAndAttendance', width: '15%', render: row => <BookingsListColumn.BookingAndAttendance data={row}/>},
            {
                fieldName: '',
                localeLabelKey: 'paymentStatus',
                render: row => <BookingsListColumn.PaymentStatus onPaymentStatusSelect={(option) => this.props.onPaymentStatusSelect(row.booking, option)} data={row}/>
            },
            {fieldName: '', localeLabelKey: 'payment', render: row => <BookingsListColumn.Payment data={row}/>}
        ].map(column => ({
            ...column,
            title: translate(`BookingsList.TableColumnsTitles.${column.localeLabelKey}`),
            fieldName: `booking.${column.fieldName}`,
            sortDescending: sort[`booking.${column.fieldName}`] && sort[`booking.${column.fieldName}`].order === 'DESC'
        }));
    };

    _renderLoader = () => {
        const {loading, constantsLoaded} = this.props;
        if (!loading && constantsLoaded) {
            return null;
        }

        return (
            <div className={st(classes.centered, classes.tableLoader)}>
                <Loader size="small"/>
            </div>
        );
    };

    _renderEmptyState = () => {
        const {loading, bookingEntries} = this.props;
        if (loading || bookingEntries.length) {
            return null;
        }

        return (
            <Table.EmptyState
                title={translate('BookingsList.noBookingsFound')}
            />
        );
    };

    render() {
        const {setRowFocused} = this.props;

        return (
            <div className={st(classes.bookingsListContainer)}>
                <BookingNotification/>
                <Page className={st(classes.bookingsListPage)}>
                    <Page.Header title={this._renderBookingsListHeaderTitle()} subtitle={this._renderBookingsListHeaderSubtitle()}/>
                    <Page.Content>
                        {this._renderBookingsListToolbar()}
                        <Table
                            showHeaderWhenEmpty
                            infiniteScroll
                            itemsPerPage={this._getBookingEntries().length}
                            data={this._getBookingEntries()}
                            columns={this._getBookingColumns()}
                            showSelection={false}
                            onRowClick={this.props.onRowClick}
                            onMouseEnterRow={row => setRowFocused(row, true)}
                            onMouseLeaveRow={row => setRowFocused(row, false)}
                            onSortClick={this._onBookingSortChanged}
                            loadMore={this.props.loadMore}
                            hasMore={this.props.hasMore}
                            loader={null}
                        >
                            <Table.Content/>
                            {this._renderLoader()}
                            {this._renderEmptyState()}
                        </Table>
                    </Page.Content>
                </Page>
            </div>
        );
    }
}

BookingsList.propTypes = {
    bookingEntries: PropTypes.array,
    calendarPresets: PropTypes.array,
    filters: PropTypes.object,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
    constantsLoaded: PropTypes.bool,
    bookingsMetadata: PropTypes.object,
    onFilterChanged: PropTypes.func,
    onRowClick: PropTypes.func,
    onSortChanged: PropTypes.func,
    openRescheduleBookingModal: PropTypes.func,
    onPaymentStatusSelect: PropTypes.func,
    services: PropTypes.object,
    setRowFocused: PropTypes.func,
    sort: PropTypes.object,
    staff: PropTypes.object
};