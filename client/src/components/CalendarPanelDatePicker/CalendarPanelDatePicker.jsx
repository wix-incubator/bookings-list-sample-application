import React from 'react';
import PropTypes from 'prop-types';
import {startOfDay, endOfDay} from 'date-fns';
import {CalendarPanel, CalendarPanelFooter, Input, Popover} from 'wix-style-react';
import {formatDate} from 'wix-style-react/src/LocaleUtils';

import DateAndTime from 'wix-ui-icons-common/DateAndTime';
import {addDays, noop, objectsAreEqual} from '../../utils';

export function getDefaultValue() {
    return {
        from: addDays(0),
        to: addDays(30)
    };
}

export default class CalendarPanelDatePicker extends React.PureComponent {
    static displayName = 'CalendarPanelDatePicker';

    static defaultProps = {
        locale: 'en',
        selectionMode: 'range',
        numOfMonths: 2,
        dateFormat: 'MM/DD/YYYY',
        filterDate: () => true,
        rtl: false,
        inputMinWidth: '250px',
        zIndex: 1,
        disabled: false,
        inputDataHook: 'calendar-panel-date-picker-input',
        presets: [],
        primaryActionLabel: 'Submit',
        secondaryActionLabel: 'Cancel',
        primaryActionOnClick: noop,
        secondaryActionOnClick: noop,
        popoverProps: {
            placement: 'top-start',
            zIndex: 1
        }
    };

    constructor(props) {
        super(props);

        const isOpen = props.initialOpen && !props.disabled;

        const value = props.value || getDefaultValue();

        this.state = {
            value,
            previousValue: value,
            isOpen
        };
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (!objectsAreEqual(prevProps.value, this.props.value)) {
            return {value: this.props.value};
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot && snapshot.value) {
            this.setState({value: snapshot.value, previousValue: snapshot.value});
        }
    }

    openCalendar = () => {
        if (this.state.isOpen) {
            return;
        }

        const newState = {
            isOpen: true
        };

        this.setState(newState, () => {
            this.props.onOpen && this.props.onOpen();
        });
    };

    closeCalendarTimeout = (resetToPreviousValue = false, updatePreviousValue = false) => {
        const newState = {
            isOpen: false
        };

        if (resetToPreviousValue && this.state.previousValue) {
            newState.value = this.state.previousValue;
        }

        if (updatePreviousValue) {
            newState.previousValue = this.state.value;
        }

        this.setState(newState, () => {
            this.props.onClose && this.props.onClose();
        });
    };

    closeCalendar = (resetToPreviousValue = false, updatePreviousValue = false) => {
        if (!this.state.isOpen) {
            return;
        }

        // to avoid having the calendar open after submit/cancel action => have the actual closing call in a timeout
        // probably an issue with the lifecycle messing up the setState for the isOpen value
        setTimeout(() => this.closeCalendarTimeout(resetToPreviousValue, updatePreviousValue));
    };

    _primaryActionOnClick = () => {
        const {value} = this.state;
        this.closeCalendar(false, true);
        this.props.primaryActionOnClick(value);
    };

    _secondaryActionOnClick = () => {
        this.closeCalendar(true);
        this.props.secondaryActionOnClick();
    };

    _setValue = (value) => {
        const newState = {};
        if (value.from) {
            value.from = startOfDay(value.from);
        }
        if (value.to) {
            value.to = endOfDay(value.to);
        }
        newState.value = value;
        this.setState(newState);
    };

    _getPlaceholder = () => {
        const {previousValue: value} = this.state;
        const {locale, dateFormat} = this.props;
        const fromString = `${value.from ? formatDate(value.from, dateFormat, locale) : ''}`;
        const toString = `${value.to ? formatDate(value.to, dateFormat, locale) : ''}`;

        if (fromString && toString) {
            return `${fromString} - ${toString}`;
        }
        return fromString;
    };

    _renderInput = () => {
        const {disabled, readOnly, inputMinWidth, onFocus, inputDataHook} = this.props;

        return (
            <div style={{minWidth: inputMinWidth}}>
                <Input
                    dataHook={inputDataHook}
                    placeholder={this._getPlaceholder()}
                    disableEditing={true}
                    readOnly={readOnly}
                    disabled={disabled}
                    onInputClicked={this.openCalendar}
                    tabIndex={0}
                    onFocus={e => {
                        onFocus && onFocus(e);
                        this.openCalendar();
                    }}
                    prefix={
                        <Input.IconAffix>
                            <DateAndTime/>
                        </Input.IconAffix>
                    }
                />
            </div>
        );
    };

    _dateToString = (date) => {
        const {dateFormat, locale} = this.props;
        return formatDate(date, dateFormat, locale);
    };

    _renderCalendarPanelFooter = ({selectedDays, submitDisabled}) => {
        const {primaryActionLabel, secondaryActionLabel, renderCustomCalendarPanelFooter} = this.props;

        if (renderCustomCalendarPanelFooter) {
            return renderCustomCalendarPanelFooter({selectedDays, submitDisabled});
        }

        return (
            <CalendarPanelFooter
                primaryActionLabel={primaryActionLabel}
                secondaryActionLabel={secondaryActionLabel}
                dateToString={this._dateToString}
                selectedDays={selectedDays}
                primaryActionDisabled={submitDisabled}
                primaryActionOnClick={this._primaryActionOnClick}
                secondaryActionOnClick={this._secondaryActionOnClick}
            />
        );
    };

    _renderCalendarPanel = () => {
        const {value} = this.state;
        const {
            presets, selectionMode, numOfMonths, locale,
            filterDate, excludePastDates, rtl, shouldCloseOnSelect
        } = this.props;

        const calendarPanelProps = {
            dataHook: 'calendar-panel-date-picker-calendar',
            locale,
            filterDate,
            excludePastDates,
            rtl,
            onChange: this._setValue,
            value,
            shouldCloseOnSelect,
            numOfMonths,
            selectionMode,
            presets,
            footer: this._renderCalendarPanelFooter
        };

        return (
            <CalendarPanel
                {...calendarPanelProps}
            />
        );
    };

    render() {
        const {isOpen} = this.state;
        const {popoverProps, zIndex} = this.props;

        return (
            <Popover
                shown={isOpen}
                appendTo="parent"
                placement="bottom-start"
                onClickOutside={() => this.closeCalendar(true, false)}
                zIndex={zIndex}
                {...popoverProps}
            >
                <Popover.Element data-hook="calendar-panel-date-picker-input-container">
                    {this._renderInput()}
                </Popover.Element>
                <Popover.Content>
                    {this._renderCalendarPanel()}
                </Popover.Content>
            </Popover>
        );
    }
};

CalendarPanelDatePicker.propTypes = {
    className: PropTypes.string,
    dateFormat: PropTypes.string,
    disabled: PropTypes.bool,
    excludePastDates: PropTypes.bool,
    filterDate: PropTypes.func,
    initialOpen: PropTypes.bool,
    inputDataHook: PropTypes.string,
    inputMinWidth: PropTypes.string,
    locale: PropTypes.oneOf([
        'en', 'es', 'pt', 'fr', 'de', 'pl', 'it', 'ru', 'ja',
        'ko', 'tr', 'sv', 'no', 'nl', 'da', 'zh', 'th', 'cs']
    ),
    numOfMonths: PropTypes.oneOf([1, 2]),
    onClose: PropTypes.func,
    onFocus: PropTypes.func,
    onOpen: PropTypes.func,
    popoverProps: PropTypes.object,
    presets: PropTypes.array,
    primaryActionLabel: PropTypes.string,
    primaryActionOnClick: PropTypes.func,
    readOnly: PropTypes.bool,
    renderCustomCalendarPanelFooter: PropTypes.func,
    rtl: PropTypes.bool,
    secondaryActionLabel: PropTypes.string,
    secondaryActionOnClick: PropTypes.func,
    selectionMode: PropTypes.oneOf(['day', 'range']),
    shouldCloseOnSelect: PropTypes.bool,
    value: PropTypes.object,
    zIndex: PropTypes.number
};