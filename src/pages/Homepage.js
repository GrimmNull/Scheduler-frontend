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
    useEffect(() => {
        //la fiecare 10 secunde schimbam imaginea, titlul si descrierea de pe homepage
        const id = setInterval(() => {
            console.log('Gorin')
            document.getElementById('motImage').setAttribute('class', 'next')
            document.getElementById('motTitle').setAttribute('class', 'next')
            document.getElementById('descParagraph').setAttribute('class', 'next')
            setTimeout(() => {
                setSlide((slide + 1) % 3)
                document.getElementById('motImage').setAttribute('class', '')
                document.getElementById('motTitle').setAttribute('class', '')
                document.getElementById('descParagraph').setAttribute('class', '')
            }, 1000);

        }, 10000);
        return () => clearInterval(id);
    }, [slide])
    return (
        <div id='homepageScreen'>
            <img id='motImage' src={images[slide]} alt='motivationalImage'/>
            <h1 id='motTitle'>{titles[slide]}</h1>
            <h3 id='descParagraph'>{descriptions[slide]}</h3>
        </div>
    )
}

export default Homepage