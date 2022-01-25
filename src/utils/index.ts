import { ToastContent, ToastOptions, toast as doToast } from 'react-toastify';
import { overrideTailwindClasses } from 'tailwind-override';

export const toast = (content: ToastContent, options?: ToastOptions) => {
    const defaultOptions = {
        className: 'border-2 border-black text-black font-bold font-charriot rounded bg-white text-center',
    };

    const className = overrideTailwindClasses(`${defaultOptions.className} ${options?.className ?? ''}`);
    const combinedOptions = { ...defaultOptions, ...options, className };

    doToast(content, combinedOptions);
};

export const toastPromise = (promise: Promise<any>) => {
    let returnObj;

    doToast.promise(
        returnObj = promise,
        {
          pending: {
            render(){
              return "Transaction pending..."
            },
            icon: '🤔',
            position: 'top-center',
            className: 'border-2 border-black text-black font-bold font-charriot rounded bg-white text-center',
          },
          success: {
            render({data}){
              return 'Transaction successful!'
            },
            icon: '👌',
            className: 'border-2 border-black text-black font-bold font-charriot rounded bg-green-500 text-center',
          },
          error: {
            render({data}){
              // When the promise reject, data will contain the error
              if ((data as any).code && (data as any).code === 4001) {
                  return 'Transaction rejected by user'
              } else {
                  return `Error! ${(data as any).error.message}`
              }
            },
            icon: '🤯',
            className: 'border-2 border-black text-black font-bold font-charriot rounded bg-red-500 text-center',
          }
        }
    );

    return returnObj;
};