import { useState } from 'react';

/**
 * Custom Hook for generic form handling.
 * 
 * @param {Object} initialState The initial state of the form
 * @param {Object} validators An object containing validation functions for each field
 * @returns {Object} form state and handlers
 */
export const useForm = (initialState, validators = {}) => {
    const [formData, setFormData] = useState(initialState);
    const [fieldErrors, setFieldErrors] = useState({});

    /**
     * Handle input change
     * Automatically clears the error for the changed field
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * Handle input blur for validation
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const validator = validators[name];
        if (validator) {
            const errMsg = validator(value, formData);
            setFieldErrors((prev) => ({ ...prev, [name]: errMsg }));
        }
    };

    /**
     * Validate all fields
     * @returns {boolean} true if valid, false if not
     */
    const validateAll = () => {
        const errors = {};
        Object.keys(validators).forEach((key) => {
            const val = formData[key] || '';
            const errMsg = validators[key](val, formData);
            if (errMsg) errors[key] = errMsg;
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Helper to determine input class based on error
     */
    const inputClass = (name, defaultClass = '') => {
        return `${defaultClass} ${fieldErrors[name] ? 'input-error error-input' : ''}`.trim();
    };

    return {
        formData,
        setFormData,
        fieldErrors,
        setFieldErrors,
        handleChange,
        handleBlur,
        validateAll,
        inputClass
    };
};
