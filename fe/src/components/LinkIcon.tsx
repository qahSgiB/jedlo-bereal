import { Link } from "react-router-dom";
import "./LinkIcon.css";

type LinkIconProps = {
    path_to_page: string;
    path_to_image: string; 
    className?: string;
}

function LinkIcon(props: LinkIconProps) {
    return (
        <Link className={props.className ?? ''} to={props.path_to_page}>
            <img className='link-icon' src={props.path_to_image} alt='icon' />
        </Link>
    )
}

export default LinkIcon;