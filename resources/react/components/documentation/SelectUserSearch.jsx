import React from 'react';
import Select, { components } from 'react-select';


const MultiValue = props => (
    <components.MultiValue {...props}>
        {props.data.username}
    </components.MultiValue>
);

export default function SelectUserSearch({id, renderUsers, handleSelectChange}) {
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
                    maxHeight: '150px',
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
                    backgroundColor: state.isFocused ? 'rgba(255, 168, 168, 0.47)' : base.backgroundColor,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 168, 168, 0.47)',
                    },
                    cursor: 'pointer',
                }),
            }}
            components={{ MultiValue }}
            placeholder="Seleziona utenti"
            options={renderUsers()}
            noOptionsMessage={() => 'Nessun utente disponibile'}
            onChange={handleSelectChange}
            isSearchable={false}
            isMulti
        />
    );
}
