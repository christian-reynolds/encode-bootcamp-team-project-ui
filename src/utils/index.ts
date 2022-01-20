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

export const toastPromise = (promise: Promise<any>) => {
    let test;

    doToast.promise(
        test = promise,
        {
          pending: {
            render(){
              return "Transaction pending..."
            },
            icon: '🤔',
            position: 'top-center',
            className: 'border-2 border-black text-black font-bold font-charriot rounded-none bg-white text-center',
          },
          success: {
            render({data}){
              return `Transaction successful! tx hash: ${data}`
            },
            // other options
            icon: '👌',
            className: 'border-2 border-black text-black font-bold font-charriot rounded-none bg-green-500 text-center',
          },
          error: {
            render({data}){
              // When the promise reject, data will contains the error
              console.log((data as any).code);
                if ((data as any).code && (data as any).code === 4001) {
                    return 'Transaction rejected by user'
                } else {
                    return `Error! ${data}`
                }
            },
            icon: '🤯',
            className: 'border-2 border-black text-black font-bold font-charriot rounded-none bg-red-500 text-center',
          }
        }
    );

    return test;
};