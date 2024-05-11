import robot from '../../assets/robot.gif'
import './welcome.scss'

interface welcomeProps {
    nameuser : string
}

export default function WelcomeComponent({nameuser} : welcomeProps) {
    return (
        <div className="welcome">
            <img src={robot} alt="Robot welcome" />
            <h1>
                Welcome , <span>{nameuser} !</span>
            </h1>
            <h3>Please select a chat to start conversation.</h3>
        </div>
    )
}
