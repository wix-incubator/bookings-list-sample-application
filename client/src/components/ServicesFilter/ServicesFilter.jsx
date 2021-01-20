import React from 'react';
import {listItemSectionBuilder, MultiSelectCheckbox, TableToolbar} from 'wix-style-react';
import {translate} from '../../utils';
import {isEqual} from 'lodash';

export default class ServicesFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedServices: props.filters.services
        };
    }

    _getOptionsList = () => {
        const {servicesGroups} = this.props;
        return Object.keys(servicesGroups).reduce((options, serviceGroup) => {
            if (servicesGroups[serviceGroup].length) {
                options.push(listItemSectionBuilder({title: translate(`ServicesFilter.${serviceGroup.toLowerCase()}`)}));
                options.push(...servicesGroups[serviceGroup]);
            }
            return options;
        }, []);
    };

    _onServiceOptionSelect = (optionScheduleId) => {
        this.setState({selectedServices: [...this.state.selectedServices, optionScheduleId]});
    };

    _onServiceOptionDeselect = (optionScheduleId) => {
        this.setState({selectedServices: this.state.selectedServices.filter((selectedService) => selectedService !== optionScheduleId)});
    };

    _onServiceFilterClose = () => {
        const {onFilterChanged, filters} = this.props;
        if (!isEqual(filters.services.toJS().sort(), this.state.selectedServices.sort())) {
            onFilterChanged('services', this.state.selectedServices);
        }
    };

    render() {
        return (
            <MultiSelectCheckbox
                options={this._getOptionsList()}
                selectedOptions={this.state.selectedServices}
                onSelect={this._onServiceOptionSelect}
                onDeselect={this._onServiceOptionDeselect}
                placeholder={translate('ServicesFilter.placeholder')}
                onClose={this._onServiceFilterClose}
            />
        );
    }

};