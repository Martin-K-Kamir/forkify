import Icon from "./Icon.jsx";
import Field from "./Field.jsx";
import React from "react";
import Button from "./Button.jsx";
import IconButton from "./IconButton.jsx";

let FieldList = ({ fields, onChange, options }) => {
    return fields.map((field, i, arr) => {
        const isFirstIndex = i === 0;
        const isLastIndex = i === arr.length - 1;
        const isLimitReached = arr.length === (options?.limit ?? 5);

        const renderedField = field.subFields ? (
            field.subFields?.map(subField => (
                <Field
                    key={subField.id}
                    field={subField}
                    onChange={e =>
                        onChange({
                            id: subField.id,
                            value: e.target.value,
                            path: fields,
                        })
                    }
                />
            ))
        ) : (
            <Field
                key={field.id}
                field={field}
                onChange={e =>
                    onChange({
                        id: field.id,
                        value: e.target.value,
                        path: fields,
                    })
                }
            />
        );

        return (
            <div key={field.id}>
                <div className="form-row grid align-items-center gap-xs">
                    {renderedField}
                    {options?.handleRemoveField && !isFirstIndex && (
                        <IconButton
                            type="button"
                            color="error"
                            padSize="md"
                            onClick={() =>
                                options.handleRemoveField({
                                    id: field.id,
                                    path: fields,
                                })
                            }
                        >
                            <Icon className="f-size-2" type="cancel" />
                        </IconButton>
                    )}
                </div>
                {options?.handleAddField && !isLimitReached && isLastIndex && (
                    <Button
                        bold
                        fontSize="sm"
                        padSize="sm"
                        type="button"
                        className="mt-xs"
                        startIcon={
                            <Icon className="f-size-1" type="addCircle" />
                        }
                        onClick={() => {
                            options.handleAddField({
                                key: options.key,
                                path: fields,
                            });
                        }}
                    >
                        {options.addFieldText}
                    </Button>
                )}
            </div>
        );
    });
};

FieldList = React.memo(FieldList, (prevProps, nextProps) => {
    const isSameLength = prevProps.fields.length === nextProps.fields.length;
    const areFieldsSame = prevProps.fields.every((field, i) => {
        return (
            field.id === nextProps.fields[i]?.id &&
            field.value === nextProps.fields[i].value
        );
    });

    const hasSubFields = prevProps.fields.some(field => field.subFields);
    let areSubFieldsSame = true;
    if (hasSubFields) {
        areSubFieldsSame = prevProps.fields.every((field, i) => {
            return field.subFields?.every((subField, j) => {
                return (
                    subField.id === nextProps.fields[i]?.subFields[j]?.id &&
                    subField.value === nextProps.fields[i].subFields[j].value
                );
            });
        });
    }

    return isSameLength && areFieldsSame && areSubFieldsSame;
});

export default FieldList;
