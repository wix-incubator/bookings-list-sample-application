import React from 'react';
import { MultiSelectCheckbox } from 'wix-style-react';
import { listItemSectionBuilder, listItemSelectBuilder } from 'wix-style-react';

export default class BuildersExample extends React.Component {
  state = { selectedOptions: ['Logan Chandler'] };

  onSelect = (optionId) =>
    optionId &&
    this.setState({
      selectedOptions: [...this.state.selectedOptions, optionId],
    });

  onDeselect = (optionId) =>
    this.setState({
      selectedOptions: this.state.selectedOptions.filter((item) => item !== optionId),
    });

  render() {
    const { selectedOptions } = this.state;
    const optionsList = [
      listItemSectionBuilder({
        title: 'Personal Trainers',
      }),
      //   listItemSelectBuilder({
      //     checkbox: true,
      //     id: 'Logan Chandler',
      //     title: 'Logan Chandler',
      //     label: 'Logan Chandler Label',
      //   }),
      //   { value: 'Paul Simon', id: 'Paul Simon' },
      //   listItemSectionBuilder({
      //     title: 'Nutritionists',
      //   }),
      //   listItemSelectBuilder({
      //     checkbox: true,
      //     id: 'Etta Wheeler',
      //     title: 'Etta Wheeler',
      //     label: 'Etta Wheeler Label',
      //   }),
      //   { value: 'Robert Ortega', id: 'Robert Ortega' },
    ];
    return (
      <MultiSelectCheckbox
        options={optionsList}
        selectedOptions={selectedOptions}
        onSelect={this.onSelect}
        onDeselect={this.onDeselect}
      />
    );
  }
}
