import React from 'react';
import Select, { components } from 'react-select';

const SingleValue = props => (
    <components.SingleValue {...props}>
        {props.data.category}
    </components.SingleValue>
);

export default function SelectCategory({id, renderCategories, handleSelectChange}) {
    return (
        <Select
            inputId={id}
            styles={{
                container: (base) => ({
                    ...base,
                    width: '50%',
                }),
                menu: (base) => ({
                    ...base,
                    zIndex: '100',
                    maxHeight: '200px',
                    width: '100%',
                    overflowY: 'auto',
                }),
                control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? 'rgba(255, 93, 93, 0.47)' : '#bebebe',
                    boxShadow: state.isFocused ? '0 0 2px 2px rgba(255, 69, 69, 0.25)' : null,
                    '&:hover': {
                        borderColor: state.isFocused ? 'rgba(255, 93, 93, 0.47)' : 'rgba(107, 107, 107, 0.47)',
                    },
                    cursor: 'pointer',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? 'rgba(253, 70, 70, 0.47)' :
                        state.isFocused ? 'rgba(255, 168, 168, 0.47)' : base.backgroundColor,
                    '&:hover': {
                        backgroundColor: state.isSelected ? 'rgba(253, 70, 70, 0.47)' : 'rgba(255, 168, 168, 0.47)',
                    },
                    cursor: 'pointer',
                }),
            }}
            components={{ SingleValue }}
            placeholder="Seleziona categoria"
            noOptionsMessage={() => 'Nessuna categoria disponibile'}
            options={renderCategories()}
            onChange={handleSelectChange}
            isSearchable={false}
        />
    );
}
