import React, { useState } from "react";
import down_arrow from "../images/down-arrow.svg";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
    username: string,
};

const Header = ({ username }: HeaderProps) => {
    return (
        <div className="">
            <Link href={"/"}>Lån ut</Link>
            <Link href={"/loans"}>Dine lån</Link>
        </div>
    );
};

export default Header;