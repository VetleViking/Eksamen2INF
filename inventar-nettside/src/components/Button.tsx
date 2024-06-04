import React from "react";

type ButtonProps = {
    text: string;
    onClick: () => void;
};

const Button = ({ text, onClick }: ButtonProps) => {    
    return (
        <button 
            className="bg-main text-white py-1 px-2 rounded-md mt-2 border-4 border-main hover:bg-white hover:text-main transition duration-300 ease-in-out min-w-max"
            onClick={onClick}
        >{text}</button>
    );
};

export default Button;