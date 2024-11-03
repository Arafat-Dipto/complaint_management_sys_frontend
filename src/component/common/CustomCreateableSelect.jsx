import React from "react";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";

const CustomCreatableSelect = ({
    options,
    value,
    onChange,
    onCreateOption,
    placeholder,
    touched,
    error,
    createValue = [],
    additionalStyles = {},
    showOptionLabel,
    activeDisabled,
    disable,
    newOptionStatus = true,
    mainOptions = []
}) => {
    const SingleValue = ({ children, ...props }) => (
        <components.SingleValue {...props}>{props.data.value}</components.SingleValue>
    );

    return (
        <div className="min-width-100">
            <CreatableSelect
                onChange={onChange}
                onCreateOption={onCreateOption}
                options={[...createValue, ...options]}
                value={
                    [...createValue, ...options, ...mainOptions]?.find(
                        (option) => option.value === value
                    ) || ""
                }
                placeholder={placeholder}
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                    }),
                    placeholder: (provided) => ({
                        ...provided,
                        color: "#A8ABB2",
                        fontSize: "14px",
                        fontWeight: 300,
                        letterSpacing: "0.30px",
                    }),
                    control: (provided, state) => ({
                        ...provided,
                        borderColor: touched && error ? "red" : "#dee2e6",
                        ...additionalStyles?.control,
                    }),
                }}
                getOptionLabel={(option) => showOptionLabel ? `${option.value} (${option.label})` : option.label}
                classNamePrefix="react-select"
                isDisabled={activeDisabled && disable}
                isValidNewOption={() => newOptionStatus}
                components={{ SingleValue }}
            />
            <div className="error-message">
                {touched && error && (
                    <div className="text-danger text-start small">{error}</div>
                )}
            </div>
        </div>
    );
};

export default CustomCreatableSelect;
