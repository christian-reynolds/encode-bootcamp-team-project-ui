interface Props {
    label: string;
    onClick?: () => void;
    className?: string;
}

function Button({ label, onClick, className }: Props) {
    const fullClassName = 'bg-gray-500 hover:bg-red-500 border-2 border-black shadow-sm px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none';

    return (
        <button type="submit" className={fullClassName} onClick={onClick}>{label}</button>
    );
}

export default Button;
