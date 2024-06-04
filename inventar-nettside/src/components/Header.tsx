import React from "react";
import logo from "../images/innlandet-fylkeskommune.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <div className="border-b-2 border-b-secondary">
            <div className="bg-main p-1 flex justify-end text-white pr-12">
                <Link href={"/admin"}>Adminpanel</Link>
            </div>
            <div className="flex justify-center md:justify-between px-8 items-center">
                <Link href={"/"} className="hidden md:block">
                <Image src={logo} alt="Innlandet fylkeskommune logo" width={180} height={100}/>
                </Link>
                <div className="flex items-center">
                    <Link href={"/"} className="py-6 px-4 hover:bg-tertiary font-medium text-lg">Lån ut</Link>
                    <Link href={"/loans"} className="py-6 px-4 hover:bg-tertiary font-medium text-lg">Dine lån</Link>
                </div>
            </div>
        </div>
    );
};

export default Header;