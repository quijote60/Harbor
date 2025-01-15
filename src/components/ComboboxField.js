import React, { useState } from 'react';
import { useField } from 'formik';
import { Form as BootstrapForm, InputGroup } from 'react-bootstrap';
import { PersonBadge } from 'react-bootstrap-icons';

const ComboboxField = ({ name, label, options }) => {
    const [field, meta, helpers] = useField(name);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        helpers.setValue(value);
        setIsOpen(true);
    };

    const handleSelect = (value) => {
        helpers.setValue(value);
        setInputValue(value.toString());
        setIsOpen(false);
    };

    const handleBlur = (e) => {
        // Delay closing the dropdown to allow for click events
        setTimeout(() => {
            setIsOpen(false);
        }, 200);
        field.onBlur(e);
    };

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label htmlFor={name} className="fw-medium">
                {label}
            </BootstrapForm.Label>
            <InputGroup>
                <InputGroup.Text>
                    <PersonBadge />
                </InputGroup.Text>
                <div className="position-relative flex-grow-1">
                    <input
                        type="text"
                        id={name}
                        {...field}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        onBlur={handleBlur}
                        className="form-control"
                        autoComplete="off"
                    />
                    {isOpen && filteredOptions.length > 0 && (
                        <div 
                            className="position-absolute w-100 mt-1 shadow bg-white border rounded-2"
                            style={{ 
                                maxHeight: '200px', 
                                overflowY: 'auto',
                                zIndex: 1000 
                            }}
                        >
                            {filteredOptions.map(option => (
                                <div
                                    key={option.value}
                                    className="px-3 py-2 hover:bg-light"
                                    onClick={() => handleSelect(option.value)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </InputGroup>
            {meta.touched && meta.error ? (
                <div className="text-danger mt-1 small">{meta.error}</div>
            ) : null}
        </BootstrapForm.Group>
    );
};

export default ComboboxField;
