import ReactDom from "react-dom";
import Alert from "./components/Alert";

function triggerAlert(message){
    const thisComponent = document.getElementById('navbar')
    const newNode = document.createElement('div')
    newNode.setAttribute('id', 'alertPopUp')
    thisComponent.parentNode.insertBefore(newNode, thisComponent.nextSibling)
    ReactDom.render(<Alert
        message={message}
    />, newNode)
}

export default triggerAlert