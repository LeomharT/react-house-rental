import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function Index()
{
    const history = useHistory();

    const location = useLocation();


    useEffect(() =>
    {
        if (location.pathname === '/')
        {
            history.push('/Home');
        }
    }, [location.pathname,]);


    return (
        <React.Fragment>

        </React.Fragment>
    );
}
