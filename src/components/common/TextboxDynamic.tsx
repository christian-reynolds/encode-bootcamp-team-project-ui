import { ChangeEvent } from "react";

interface Props {
    label: string;
    update: (value: {}) => void;
    className?: string;
}

function TextboxDynamic({ label, update, className }: Props) {
    const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
        // Disregard *any* errors, since they will be caught downstream any way
        const { name, value } = event.target;
        update((prevState: any) => ({ ...prevState, [name]: value }));
      };

    return (        
        <input placeholder={label} type="text" name={label} className={className} onChange={updateValue}></input>
    );
}

export default TextboxDynamic;
