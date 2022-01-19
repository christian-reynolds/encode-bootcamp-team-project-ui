import { Input } from "../utils/interfaces";

interface Props {
    name: string;
    inputs: Input[];
    onClick?: () => void;
}

function TokenManagementForm({ name, inputs, onClick }: Props) {

    return (
        <>
            {/* <div className="flex justify-center items-center h-screen w-full"> */}
                <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4"> 
                    <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">{name}</h1>
                    {inputs.map((item) => (
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={item.name}>{item.name}</label>
                            <input className="border py-2 px-3 text-grey-800" type="text" name={item.name} id={item.name} />
                        </div>
                    ))}
                    <button className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded" onClick={onClick}>Write</button>
                 </div>
            {/* </div> */}
        </>
    );
}

export default TokenManagementForm;