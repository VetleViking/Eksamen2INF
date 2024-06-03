import React, { useState } from "react";
import logo from "../images/innlandet-fylkeskommune.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <div className="border-b-2 border-t-[16px] border-b-secondary border-t-main">
            <div className="flex justify-between px-8">
                <Image src={logo} alt="Innlandet fylkeskommune logo" width={150} height={100}/>
                <div className="flex items-center">
                    <Link href={"/"} className="py-6 px-4 hover:bg-tertiary">Lån ut</Link>
                    <Link href={"/loans"} className="py-6 px-4 hover:bg-tertiary">Dine lån</Link>
                </div>
            </div>
        </div>
    );
};

export default Header;