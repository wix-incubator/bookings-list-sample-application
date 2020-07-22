import React from 'react';
import PropTypes from 'prop-types';
import {st, classes} from './BookingsList.st.css';
import {Page, Table, Card, TableToolbar, Dropdown, Loader, Text} from 'wix-style-react';
import CalendarPanelDatePicker from '../CalendarPanelDatePicker';
import BookingsListColumn from '../BookingsListColumn';
import {addDays} from '../../utils';
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
            value: 'Last 30 Days'
        }, {
            id: 2,

            selectedDays: {
                from: addDays(-7),
                to: new Date()
            },
            value: 'Last 7 Days'
        }
    ];
}

const getBookingStatuses = () => [
    {id: 'CONFIRMED', value: 'Confirmed'},
    {id: 'PENDING', value: 'Pending'},
    {id: 'CANCELED', value: 'Cancelled'},
    {id: 'PENDING_APPROVAL', value: 'Pending Approval'},
    {id: 'PENDING_CHECKOUT', value: 'Pending Checkout'},
    {id: 'DECLINED', value: 'Declined'}
    // {id: 'UNDEFINED', value: 'Undefined'}
];

@observer
export default class BookingsList extends React.Component {
    _renderBookingsListHeaderTitle = () => {
        const {metadata} = this.props;
        return (
            <div>
                <h4 className={st(classes.title)}>Booking List</h4>
                {metadata ? <h4 className={st(classes.title, classes.amount)}>{metadata.totalCount}</h4> : null}
            </div>
        );
    };

    _renderBookingsListHeaderSubtitle = () => {
        return (
            <label>Ut placet, inquam tum dicere exorsus est laborum et fortibus.</label>
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
            value: filters.dateRange
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
                                    placeholder={'All Booking Statuses'}
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
        return this.props.bookingEntries;
    };

    _getBookingColumns = () => {
        const {services, staff, filters, sort} = this.props;
        return [
            {fieldName: 'created', sortable: true, title: 'Booking Time', render: row => <BookingsListColumn.BookingTime data={row}/>},
            {fieldName: 'formInfo.contactDetails.firstName', sortable: true, title: 'Client Name', render: row => <BookingsListColumn.ClientName data={row}/>},
            {fieldName: '', title: 'Service & Session', render: row => <BookingsListColumn.ServiceAndSession services={services} data={row}/>},
            {fieldName: '', title: 'Staff', render: row => <BookingsListColumn.Staff staff={staff} data={row}/>},
            {fieldName: '', title: 'Booking & Attendance', render: row => <BookingsListColumn.BookingAndAttendance data={row}/>},
            {fieldName: '', title: 'Payment Status', render: row => <BookingsListColumn.PaymentStatus data={row}/>},
            {fieldName: '', title: 'Payment', render: row => <BookingsListColumn.Payment data={row}/>}
        ].map(column => ({
            ...column,
            fieldName: `booking.${column.fieldName}`,
            sortDescending: sort[`booking.${column.fieldName}`] && sort[`booking.${column.fieldName}`].order === 'DESC'
        }));
    };

    _renderLoader = () => {
        const {loading} = this.props;
        if (!loading) {
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
                title="No Records Found..."
            />
        );
    };

    render() {
        const {setRowFocused} = this.props;

        return (
            <div className={st(classes.bookingsListContainer)}>
                <BookingNotification/>
                <Page>
                    <Page.Header title={this._renderBookingsListHeaderTitle()} subtitle={this._renderBookingsListHeaderSubtitle()}/>
                    <Page.Content>

                        {this._renderBookingsListToolbar()}
                        <Table
                            showHeaderWhenEmpty
                            infiniteScroll
                            data={this._getBookingEntries()}
                            columns={this._getBookingColumns()}
                            showSelection={false}
                            onRowClick={(row) => console.logx({row})}
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
    metadata: PropTypes.object,
    onFilterChanged: PropTypes.func,
    onSortChanged: PropTypes.func,
    services: PropTypes.object,
    setRowFocused: PropTypes.func,
    sort: PropTypes.object,
    staff: PropTypes.object
};