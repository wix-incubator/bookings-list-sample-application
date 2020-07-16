import React, {ReactElement} from 'react';
import {st, classes} from './style.st.css';
import {Highlighter, Page, Table, Card, TableToolbar, Dropdown, CalendarPanel, CalendarPanelFooter, Popover, PopoverMenu, Input, IconButton} from 'wix-style-react';
import CalendarPanelDatePicker from '../calendar-panel-date-picker';

export interface BookingsListProps {
    bookingEntries: Array<Record<any, any>>;
    onFilterChanged: (value) => any;
}

export default class BookingsList extends React.Component<BookingsListProps> {

    _renderBookingsListHeader = (): string => {
        return 'Booking List';
    };

    _renderBookingsListToolbar = (): ReactElement => {
        const filterOptions = [
            {id: 0, value: 'All'},
            {id: 1, value: 'Red'},
            {id: 2, value: 'Cyan'}
        ];

        return (
            <Card>
                <TableToolbar>
                    <TableToolbar.ItemGroup position="start">
                        <TableToolbar.Item>
                            <TableToolbar.Label>
                                <CalendarPanelDatePicker
                                    primaryActionOnClick={(selectedDays) => console.error({selectedDays})}
                                />
                            </TableToolbar.Label>
                        </TableToolbar.Item>
                        <TableToolbar.Item>
                            <TableToolbar.Label>
                                        <span>
                                        <Dropdown
                                            placeholder={'All Booking Statuses'}
                                            options={filterOptions}
                                            selectedId={undefined}
                                            onSelect={selectedOption =>
                                                this.setState({filterId: selectedOption.id})
                                            }
                                            roundInput
                                        />
                                        </span>
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
        return [
            {title: 'Booking Time', render: row => <Highlighter>{row.name}</Highlighter>},
            {title: 'Client Name', render: row => <Highlighter>{row.booking.formInfo.contactDetails.firstName} {row.booking.formInfo.contactDetails.lastName}</Highlighter>},
            {title: 'Service & Session', render: row => <Highlighter>{row.name}</Highlighter>},
            {title: 'Staff', render: row => <Highlighter>{row.booking.bookedResources.map(resource => resource.name)}</Highlighter>},
            {title: 'Booking & Attendance', render: row => <Highlighter>{row.name}</Highlighter>},
            {title: 'Payment Status', render: row => <Highlighter>{row.name}</Highlighter>},
            {title: 'Payment', render: row => <Highlighter>{row.name}</Highlighter>}
        ];
    };

    render(): ReactElement {

        return (
            <Page>
                <Page.Header title={this._renderBookingsListHeader()}/>
                <Page.Content>
                    {this._renderBookingsListToolbar()}
                    <Table
                        data={this._getBookingEntries()}
                        columns={this._getBookingColumns()}
                        showSelection={false}
                    >
                        <Table.Content/>
                    </Table>
                </Page.Content>
            </Page>
        );
    }
}
