// submit.js

export const SubmitButton = ({submitData}) => {

    return (
        <button onClick={()=>submitData()} className="fixed bottom-16 left-[50%] translate-x-[-50%] min-w-[100px] text-center font-semibold text-white bg-[#1C2536] px-4 py-2 rounded-[8px] cursor-grab" type="submit">Submit</button>
    );
}
