/*
 * Author  : Nurainun
 * Email   : nurainunlubis24@gmail.com
 * GitHub  : github.com/Nurainunlubis
 * Created : 29 Mei 2025
 * Project : Sistem Kebutuhan PLN - Frontend
 */

import React, { useEffect, useState } from "react"

const useMobile = (breakpoint = 768)=>{
    const [isMobile,setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleResize = ()=>{
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return ()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])

    return [ isMobile ]
}

export default useMobile  