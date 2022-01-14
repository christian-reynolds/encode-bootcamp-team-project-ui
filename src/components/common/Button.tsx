interface Props {
    label: string;
    onClick?: () => void;
    className?: string;
}

function Button({ label, onClick, className }: Props) {
    const fullClassName = className && `add-css-here ${className}`;

    return (
        <button type="submit" className={fullClassName} onClick={onClick}>{label}</button>
    );
}

export default Button;
