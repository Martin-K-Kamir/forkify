import Icon from "./Icon.jsx";
import Field from "./Field.jsx";

const FieldList = ({fields, onChange, options}) => {

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
                            path: fields
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
                        path: fields
                    })
                }
            />
        )

        return (
            <div key={field.id}>
                <div className="form-row grid align-items-center gap-xs">
                    {renderedField}
                    {options?.handleRemoveField && !isFirstIndex && (
                        <button
                            className="bg-red-700 radius-1 flex-shrink-0 p-2xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1"
                            onClick={() =>
                                options.handleRemoveField({
                                    id: field.id,
                                    path: fields
                                })
                            }
                            type="button"
                        >
                            <Icon className="f-size-2" type="cancel"/>
                        </button>
                    )}
                </div>
                {options?.handleAddField && !isLimitReached && isLastIndex && (
                    <button
                        className="bg-blue-700 radius-1 px-s py-xs f-weight-medium flex align-items-center gap-3xs f-size--1 line-height-1 mt-xs"
                        onClick={() => {
                            options.handleAddField({
                                key: options.key,
                                path: fields
                            });
                        }}
                        type="button"
                    >
                        <Icon className="f-size-1" type="addCircle"/>
                        {options.addFieldText}
                    </button>
                )}
            </div>
        );
    })
}

export default FieldList;