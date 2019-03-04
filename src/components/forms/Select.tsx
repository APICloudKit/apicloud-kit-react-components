import { forwardRef, ChangeEvent } from 'react';
import { FormItemDiv } from '../../styles/components/FormItemDivStyled';

interface Props {
    title: string;
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    onChange?(val: string, e: ChangeEvent): void;
    options: {
        key: string;
        value: string;
        selected?: boolean;
    }[];
    name?: string;
}

export const SelectComponent = forwardRef<HTMLSelectElement, Props>(
    (props: Props, ref) => {
        return (
            <FormItemDiv>
                <div className="left">{props.title}</div>
                <div className="right">
                    <select
                        name={props.name}
                        placeholder={props.placeholder}
                        ref={ref}
                        onChange={e =>
                            props.onChange &&
                            props.onChange(e.currentTarget.value, e)
                        }
                        value={props.value}
                        defaultValue={props.defaultValue}
                        disabled={props.disabled}
                        dir="rtl"
                    >
                        {props.options.map((el, i) => (
                            <option
                                selected={el.selected}
                                key={i}
                                defaultValue={el.key}
                            >
                                {el.value}
                            </option>
                        ))}
                    </select>
                </div>
            </FormItemDiv>
        );
    },
);
