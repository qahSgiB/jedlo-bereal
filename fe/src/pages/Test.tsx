import useDocumentTitle from '../hooks/documentTitle';

import './Test.css'



function Test() {
  useDocumentTitle('kalorie | HOME');

  return (
    <div className='di__container'>
      <h1 className='di__title'>DAILY INTAKE</h1>
      {/* <canvas className='di__graph' id='di-graph' /> */}
    </div>
  )
}



export default Test;