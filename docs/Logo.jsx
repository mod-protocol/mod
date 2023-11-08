import Image from "next/image";
import { useTheme } from "nextra-theme-docs";
import React, { useState, useEffect } from "react";

export default function Logo() {
    const { resolvedTheme } = useTheme();
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
        setIsClient(true)
    }, [])
    
    // don't render on server as is creating a hydration warning/not refreshing when there's a mismatch between default theme and client theme
    if (!isClient) return null;
    
    return (
        <Image
            src={
                resolvedTheme === "dark"
                ? "/mod-protocol-white.svg"
                : "/mod-protocol.svg"
            }
            alt="Mod protocol"
            width={350}
            height={28.5}
        />
    );
}