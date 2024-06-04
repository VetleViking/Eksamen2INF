import Image from "next/image";
import React from "react";
import logo2 from "../images/hamar-katedralskole.png";

const Footer = () => {    
    return (
        <div className="bg-main text-white p-8">
            <Image className="my-12" src={logo2} alt="Innlandet fylkeskommune logo" width={150} height={100}/>
            <div className="md:grid grid-cols-2 gap-4">
                <div>
                    <p className="text-2xl font-semibold border-b border-white">Kontakt oss</p>
                    <p  className="my-5">Telefon: 62 54 42 00</p>
                    <a href="mailto:post.hamar.katedralskole@innlandetfylke.no"><p className="underline cursor-pointer">Send e-post</p></a> 
                    <a href="https://svarut.ks.no/edialog/mottaker/920717152"><p className="underline cursor-pointer my-5">Send sikker digital post</p></a>
                    <div>
                        <p className="font-semibold">Besøksadresse</p>
                        <p>Ringgata 235</p>
                        <p>2315 Hamar</p>
                        <a href="http://www.googlemaps.com"><p className="underline cursor-pointer">Vis i kart</p></a>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">Postadresse</p>
                        <a href="https://www.hamar-katedral.vgs.no/hovedmeny/kontakt-oss/kontaktinformasjon/"><p className="underline cursor-pointer">Se nærmere informasjon</p></a>
                    </div>
                </div>
                <div>
                    <p className="text-2xl font-semibold border-b border-white mb-5">Videregående skoler i Innlandet</p>
                    <div className="flex">
                        <div>
                            <p className="underline cursor-pointer">Dokka vgs</p>
                            <p className="underline cursor-pointer">Elverum vgs</p>
                            <p className="underline cursor-pointer">Gausdal vgs</p>
                            <p className="underline cursor-pointer">Gjøvik vgs</p>
                            <p className="underline cursor-pointer">Hadeland vgs</p>
                            <p className="underline cursor-pointer">Hamar katedralskole</p>
                            <p className="underline cursor-pointer">Jønsberg vgs</p>
                            <p className="underline cursor-pointer">Lena-Valle vgs</p>
                            <p className="underline cursor-pointer">Lillehammer vgs</p>
                            <p className="underline cursor-pointer">Nord-Gudbrandsdal vgs</p>
                            <p className="underline cursor-pointer">Nord-Østerdal vgs</p>
                            <p className="underline cursor-pointer">Raufoss vgs</p>
                        </div>
                        <div>
                            <p className="underline cursor-pointer">Ringsaker vgs</p>
                            <p className="underline cursor-pointer">Sentrum vgs</p>
                            <p className="underline cursor-pointer">Skarnes vgs</p>
                            <p className="underline cursor-pointer">Solør vgs</p>
                            <p className="underline cursor-pointer">Stange vgs</p>
                            <p className="underline cursor-pointer">Storhamar vgs</p>
                            <p className="underline cursor-pointer">Storsteigen vgs</p>
                            <p className="underline cursor-pointer">Trysil vgs</p>
                            <p className="underline cursor-pointer">Valdres vgs</p>
                            <p className="underline cursor-pointer">Vinstra vgs</p>
                            <p className="underline cursor-pointer">Øvrebyen vgs</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-2xl font-semibold border-b border-white mb-8">Følg oss</p>
                <div className="flex gap-4">
                    <a className="underline cursor-pointer" href="https://www.facebook.com/hamarkatedralskole/">Facebook</a>
                    <a className="underline cursor-pointer" href="https://www.instagram.com/hamarkatedralskole1153/">Instagram</a>
                </div>
                <div className="flex justify-center items-center m-12">
                    <Image src={logo2} alt="Innlandet fylkeskommune logo" width={150} height={100}/>
                </div>
            </div>
            <div className="border-t border-white">
                <a className="underline cursor-pointer" href="https://innlandetfylke.no/om-fylkeskommunen/personvern/"><p className="mt-8">Personvern</p></a>
                <a className="underline cursor-pointer" href="https://innlandetfylke.no/om-fylkeskommunen/informasjonskapsler/"><p className="my-3">Informasjonskapsler (cookies)</p></a>
                <a className="underline cursor-pointer" href="https://uustatus.no/nb/erklaringer/publisert/947710bb-4ba7-43d7-8638-def79b4ab3dd"><p>Tilgjengelighetserklæring</p></a>
            </div>
        </div>
    );
};

export default Footer;