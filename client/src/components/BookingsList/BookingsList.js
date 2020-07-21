import React from 'react';
import PropTypes from 'prop-types';
import {st, classes} from './BookingsList.st.css';
import {Page, Table, Card, TableToolbar, Dropdown} from 'wix-style-react';
import CalendarPanelDatePicker from '../CalendarPanelDatePicker';
import BookingsListColumn from '../BookingsListColumn';
import {addDays} from '../../utils';
import {observer} from 'mobx-react';

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
        this.props.onFilterChanged('status', bookingStatus.id);
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
        const {services, staff} = this.props;
        return [
            {title: 'Booking Time', render: row => <BookingsListColumn.BookingTime data={row}/>},
            {title: 'Client Name', render: row => <BookingsListColumn.ClientName data={row}/>},
            {title: 'Service & Session', render: row => <BookingsListColumn.ServiceAndSession services={services} data={row}/>},
            {title: 'Staff', render: row => <BookingsListColumn.Staff staff={staff} data={row}/>},
            {title: 'Booking & Attendance', render: row => <BookingsListColumn.BookingAndAttendance data={row}/>},
            {title: 'Payment Status', render: row => <BookingsListColumn.PaymentStatus data={row}/>},
            {title: 'Payment', render: row => <BookingsListColumn.Payment data={row}/>}
        ];
    };

    render() {
        const {setRowFocused} = this.props;
        return (
            <Page>
                <Page.Header title={this._renderBookingsListHeaderTitle()} subtitle={this._renderBookingsListHeaderSubtitle()}/>
                <Page.Content>
                    {this._renderBookingsListToolbar()}
                    <Table
                        data={this._getBookingEntries()}
                        columns={this._getBookingColumns()}
                        showSelection={false}
                        onRowClick={(row) => console.logx({row})}
                        onMouseEnterRow={row => setRowFocused(row, true)}
                        onMouseLeaveRow={row => setRowFocused(row, false)}
                    >
                        <Table.Content/>
                    </Table>
                </Page.Content>
            </Page>
        );
    }
}

BookingsList.propTypes = {
    bookingEntries: PropTypes.arrayOf(PropTypes.shape({booking: PropTypes.object})),
    calendarPresets: PropTypes.array,
    filters: PropTypes.object,
    metadata: PropTypes.object,
    onFilterChanged: PropTypes.func,
    services: PropTypes.object,
    setRowFocused: PropTypes.func,
    staff: PropTypes.object
};