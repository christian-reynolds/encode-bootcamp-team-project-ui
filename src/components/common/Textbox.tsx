import { ChangeEvent } from "react";

interface Props {
    label: string;
    value: string;
    index: number;
    update: (value: string) => void;
    className?: string;
}

function Textbox({ label, value, index, update, className }: Props) {
    const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
        // Disregard *any* errors, since they will be caught downstream any way
        update(event.target.value);
      };

    return (        
        <input placeholder={label} type="text" value={value} className={className} onChange={updateValue} data-index={index}></input>
    );
}

export default Textbox;
