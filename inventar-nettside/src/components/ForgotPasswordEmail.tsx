import React, { useState } from "react";
import Button from "./Button";
import { send_reset_email } from "@/api/email";

const ForgotPasswordEmail = () => {    
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const reset_button_handler = async () => {
        const data: any = await send_reset_email(email);
        console.log(data);
        setMessage(data.message || "Noe gikk galt");
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <p className="text-xl font-semibold">Vi sender deg en epost med lenke for å tilbakestille passordet ditt.</p>
            <div className="flex flex-col gap-4 w-max">
                <input 
                    className="border border-black rounded-md p-1"
                    type="text" 
                    placeholder="Epost"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    />

                <Button
                    text="Send epost" 
                    onClick={() => {
                        reset_button_handler();
                    }} />
                <p className="text-center">{message}</p>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;