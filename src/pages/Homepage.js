import {useEffect, useState} from "react";
import '../stylesheets/Homepage.scss'
import Loki from '../photos/loki.png'
import DrWho from '../photos/DrWho.jpg'
import Plan from '../photos/plan.jpg'

const descriptions = [
    "Your time is extremely precious and you shouldn't lose track of it. Be it a simple thing that you don't want to forget, or plan your entire next week carefully, Dexter's Ward is here to help you fill your time with glorious purpose",
    "Create tasks and keep track of them, see which one you finished and on which ones you still have to work a bit more. Don't lose even a moment with Dexter's Ward",
    "Change of plan? No problem! You can always move the deadline just a bit further if you need the time! Or a window opened and you are ready to move some plans sooner? You are the lord of your own time"
]


const titles = [
    'Glorious time',
    'Keep an eye on your tasks',
    'Your plans should fit you'
]

const images = [Loki, Plan, DrWho]

function Homepage(props) {
    const [slide, setSlide] = useState(0)
    const [image,setImage]= useState(images[0])
    const [title, setTitle]= useState(titles[0])
    const [description,setDescription]= useState(descriptions[0])
    useEffect(() => {
        //la fiecare 10 secunde schimbam imaginea, titlul si descrierea de pe homepage
        const id = setInterval(() => {
            setSlide((slide+1)%titles.length)
            setImage(images[slide])
            setTitle(titles[slide])
            setDescription(descriptions[slide])
        }, 10000);
        return () => clearInterval(id);
    }, [slide])
    return (
        <div id='homepageScreen'>
            <img src={image} alt="Motivational"/>
            <h1>{title}</h1>
            <h3>{description}</h3>
        </div>
    )
}

export default Homepage