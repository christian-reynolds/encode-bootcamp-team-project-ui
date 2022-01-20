import { ToastContent, ToastOptions, toast as doToast } from 'react-toastify';
import { overrideTailwindClasses } from 'tailwind-override';

export const toast = (content: ToastContent, options?: ToastOptions) => {
    const defaultOptions = {
        className: 'border-2 border-black text-black font-bold font-charriot rounded-none bg-white text-center',
    };

    const className = overrideTailwindClasses(`${defaultOptions.className} ${options?.className ?? ''}`);
    const combinedOptions = { ...defaultOptions, ...options, className };

    doToast(content, combinedOptions);
};