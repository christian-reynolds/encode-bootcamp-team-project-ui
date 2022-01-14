interface Props {
    label: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

function Textbox({ label, onChange, className }: Props) {
    const fullClassName = className && `add-css-here ${className}`;

    return (        
        <input placeholder={label} type="text" className={fullClassName} onChange={onChange}></input>
    );
}

export default Textbox;
