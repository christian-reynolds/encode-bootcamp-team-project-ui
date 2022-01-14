interface Props {
    label: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

function Textbox({ label, onChange, className }: Props) {
    const fullClassName = className && `add-css-here ${className}`;

    return (
        <div>
            <input placeholder={label} type="text" className={fullClassName} onChange={onChange}></input>
        </div>
    );
}

export default Textbox;
