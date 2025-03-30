import { createContext, useState, useContext } from "react";

const GovContext=createContext()


export const GovProvider=({children})=>{
    const [govProfile, setGovProfile]=useState(null)
    const [isOwner, setIsOwner]=useState(false)
    const [isSuperOwner, setIsSuperOwner]=useState(false)

    return(
        <GovContext.Provider value={{govProfile, setGovProfile, isOwner, setIsOwner, isSuperOwner, setIsSuperOwner}}>
            {children}
        </GovContext.Provider>
    )
}

export const useGovUser = () => useContext(GovContext);