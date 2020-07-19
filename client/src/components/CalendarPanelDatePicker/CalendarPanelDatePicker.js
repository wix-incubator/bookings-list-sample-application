import React, {useCallback, useState} from 'react';
import {CalendarPanel, CalendarPanelFooter, Input, Popover} from 'wix-style-react';
import DateAndTime from 'wix-ui-icons-common/DateAndTime';
import {addDays} from '../../utils';

function getDefaultValue() {
    return {
        from: addDays(-30),
        to: new Date()
    };
}

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

export interface CalendarPanelDatePickerProps {
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    primaryActionOnClick: (value) => any;
    dateLocale?: string;
}

export default class CalendarPanelDatePicker extends React.PureComponent {
    static displayName = 'CalendarPanelDatePicker';

    static defaultProps = {};

    constructor(props) {
        super(props);

        const isOpen = props.initialOpen && !props.disabled;
        this.state = {
            value: props.value || getDefaultValue(),
            previousValue: null,
            isOpen
        };
    }

    openCalendar = () => {
        if (this.state.isOpen) {
            return;
        }
        this.setState({isOpen: true}, () => {
            this.props.onOpen && this.props.onOpen();
        });
    };

    closeCalendar = (updatePreviousValue = false) => {
        if (!this.state.isOpen) {
            return;
        }
        this.setState({isOpen: false}, () => {
            this.props.onClose && this.props.onClose();
        });
        if (updatePreviousValue) {
            this.setState({previousValue: this.state.value});
        }
    };

    render() {
        return null;

        const {primaryActionLabel, secondaryActionLabel, primaryActionOnClick, dateLocale} = this.props;
        const [calendarOpen, setCalendarOpen] = useState(false);
        const [selectedDays, setSelectedDays] = useState(getDefaultDays());
        const [previousSelectedDays, setPreviousSelectedDays] = useState(selectedDays);

        const toggleCalendar = useCallback((isOpen, restorePrevious = false) => {
            if (restorePrevious) {
                // restore previous selected days of flag is present
                setSelectedDays(previousSelectedDays);
            }
            if (isOpen) {
                // save previous selected days on open
                setPreviousSelectedDays(selectedDays);
            }

            setCalendarOpen(isOpen);
        }, [calendarOpen]);

        const getPlaceholder = () => {
            const fromString = `${selectedDays.from ? selectedDays.from.toLocaleDateString(dateLocale) : ''}`;
            const toString = `${selectedDays.to ? selectedDays.to.toLocaleDateString(dateLocale) : ''}`;

            if (fromString && toString) {
                return `${fromString} - ${toString}`;
            }
            return fromString;
        };

        const presets = getDefaultPresets();

        return (
            <Popover
                shown={calendarOpen}
                appendTo="window"
                placement="bottom-start"
                onClick={() => toggleCalendar(true)}
                onClickOutside={() => toggleCalendar(false, true)}
            >
                <Popover.Element>
                    <Input
                        placeholder={getPlaceholder()}
                        disableEditing={true}
                        prefix={
                            <Input.IconAffix>
                                <DateAndTime/>
                            </Input.IconAffix>
                        }
                    />
                </Popover.Element>
                <Popover.Content>
                    <CalendarPanel
                        selectionMode={'range'}
                        value={selectedDays}
                        onChange={(value: any) => setSelectedDays(value)}
                        presets={presets}
                        footer={() => (
                            <CalendarPanelFooter
                                primaryActionLabel={primaryActionLabel}
                                secondaryActionLabel={secondaryActionLabel}
                                dateToString={date => (new Date(String(date))).toLocaleDateString(dateLocale)}
                                selectedDays={selectedDays}
                                primaryActionDisabled={false}
                                primaryActionOnClick={() => {
                                    primaryActionOnClick(selectedDays);
                                    toggleCalendar(false);
                                }}
                                secondaryActionOnClick={() => toggleCalendar(false, true)}
                            />
                        )}
                    />
                </Popover.Content>
            </Popover>
        );
    }
};

// CalendarPanelDatePicker.defaultProps = {
//     primaryActionLabel: 'Submit',
//     secondaryActionLabel: 'Cancel',
//     dateLocale: 'he-IL'
// };

// export default CalendarPanelDatePicker;