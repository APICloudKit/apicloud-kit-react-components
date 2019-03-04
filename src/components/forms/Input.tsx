import { forwardRef, ChangeEvent } from 'react';
import { FormItemDiv } from '../../styles/components/FormItemDivStyled';

interface Props {
    title: string;
    placeholder?: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    onChange?(val: string, e: ChangeEvent): void;
    maxLength?: number;
    name?: string;
}

export const InputComponent = forwardRef<HTMLInputElement, Props>(
    (props: Props, ref) => {
        return (
            <FormItemDiv>
                <div className="left">{props.title}</div>
                <div className="right">
                    <input
                        name={props.name}
                        type={props.type || 'text'}
                        placeholder={props.placeholder}
                        ref={ref}
                        onChange={e =>
                            props.onChange &&
                            props.onChange(e.currentTarget.value, e)
                        }
                        defaultValue={props.defaultValue}
                        value={props.value}
                        disabled={props.disabled}
                        maxLength={props.maxLength}
                    />
                </div>
            </FormItemDiv>
        );
    },
);
