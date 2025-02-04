import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
// import { cn } from "../../lib/utils";
// import { Label } from "../../components/ui/label";

const InputField = forwardRef(({
                                   type = 'text',
                                   label,
                                   name,
                                   value,
                                   onChange,
                                   onBlur,
                                   placeholder = '',
                                   readOnly = false,
                                   required = false,
                                   error = '',
                                   className = '',
                                   helpText = '',
                                   isValid = false
                               }, ref) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="space-y-2">
                <input
                    ref={ref}
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={
                        error ? `${name}-error` :
                            helpText ? `${name}-help` :
                                isValid ? `${name}-success` : undefined
                    }
                />
                {helpText && !error && !isValid && (
                    <p
                        id={`${name}-help`}
                        className="text-sm text-muted-foreground"
                    >
                        {helpText}
                    </p>
                )}
                {error && (
                    <p
                        id={`${name}-error`}
                        className="text-sm font-medium text-red-500"
                    >
                        {error}
                    </p>
                )}
                {isValid && !error && (
                    <p
                        id={`${name}-success`}
                        className="text-sm font-medium text-green-500"
                    >
                        사용 가능한 이메일입니다.
                    </p>
                )}
            </div>
        </div>
    );
});

InputField.displayName = 'InputField';

InputField.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.string,
    className: PropTypes.string,
    helpText: PropTypes.string,
    isValid: PropTypes.bool
};

export default InputField;