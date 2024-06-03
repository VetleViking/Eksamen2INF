import Image from "next/image";
import React from "react";
import logo from "../images/innlandet-fylkeskommune.svg";

const Footer = () => {    
    return (
        <div className="bg-main">
            <Image src={logo} alt="Innlandet fylkeskommune logo" width={150} height={100}/>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3>Kontakt oss</h3>
                    <p>Telefon: 62 54 42 00</p>
                    <a className="underline cursor-pointer" href="mailto:post.hamar.katedralskole@innlandetfylke.no" data-id="1513">Send e-post</a> 
                    <a className="underline cursor-pointer" href="https://svarut.ks.no/edialog/mottaker/920717152" data-id="10791">Send sikker digital post</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;