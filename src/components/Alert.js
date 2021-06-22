import {useState,useEffect} from 'react'
import {unmountComponentAtNode} from "react-dom";

function Alert(props){
    const [show,setShow]=useState(true)
    useEffect(() => {
        const interval = setInterval(() => {
            if(show){
                setShow(!show)
                unmountComponentAtNode(document.getElementById('alertPopUp'))
                const alertDiv=document.getElementById('alertPopUp')
                alertDiv.parentNode.removeChild(alertDiv)
            }
        }, 3000);
        return()=>clearInterval(interval)
    }, [show]);

    return (
        <div>
            {props.message}
        </div>
    )
}

export default Alert