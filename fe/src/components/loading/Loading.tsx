import { useEffect, useState } from 'react';

import './Loading.css'



const Loading = () => {
    const loadingTickMax = 6;

    const [loadingTick, setLoadingTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingTick(loadingTick => (loadingTick + 1) % ((loadingTickMax - 1) * 2));
        }, 150);

        return () => { clearInterval(interval); }
    }, []);

    const loadingPos = (loadingTick < loadingTickMax) ? loadingTick : loadingTickMax - (loadingTick - loadingTickMax + 2);
    const loadingText = '. '.repeat(loadingPos) + 'loading' + ' .'.repeat(loadingTickMax - 1 - loadingPos);

    return (
        <div className='loading-box'>
            <p className='loading-box__text'>{ loadingText }</p>
        </div>
    );
}



export default Loading;