import { ChangeEvent, useState } from 'react';
import { Input } from '../utils/interfaces';
import Textbox from './common/Textbox';

interface Props {
    name: string;
    inputs: Input[];
    onClick?: () => void;
}

function TokenManagementForm({ name, inputs, onClick }: Props) {
    const [inputValue, setInputValue] = useState({});

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputValue(prevState => ({ ...prevState, [name]: value }));
      };

    //   const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    //     // Disregard *any* errors, since they will be caught downstream any way
    //     update(event.target.value);
    //   };
    
    const callContractFunction = async (event: any) => {
        console.log(inputValue);
    };

    return (
        <>
            {/* <div className="flex justify-center items-center h-screen w-full"> */}
                <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4"> 
                    <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">{name}</h1>
                    {inputs.map((item, idx) => (
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={item.name}>{item.name} ({item.type})</label>
                            <input className="border py-2 px-3 text-black" type="text" name={item.name} id={item.name} onChange={onChange} />
                            {/* <Textbox label={item.name} value={inputValue} update={updateValue} className="border py-2 px-3 text-black" index={idx} /> */}
                        </div>
                    ))}
                    <button className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded" onClick={callContractFunction}>Write</button>
                 </div>
            {/* </div> */}
        </>
    );
}

export default TokenManagementForm;