import { Link } from 'react-router-dom';
import './LoggedInMessage.css'



const LoggedInMessage = () => {
  return (
    <div className='logged-out-message'>
      <p><Link to='/profile/login'>Login</Link> to use </p>
      <span className='logged-out-message__logo'>CalorieS</span>
    </div>
  )
}



export default LoggedInMessage;