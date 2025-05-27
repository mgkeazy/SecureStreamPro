import React from "react";
import useUserStore from "../store/useUserStore";
import { Navigate } from "react-router-dom";
import Hero from "./Hero";

const HomeRedirect = () =>{
    const user = useUserStore((state) => state.user);

    if(user?.role === 'admin'){
        return <Navigate to="/admin" replace/>
    }

    return <Hero/>
}
export default HomeRedirect;