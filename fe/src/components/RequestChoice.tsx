import './RequestChoice.css'

type Props = {
    requestId: number,
    handleAcceptRequest: (requestId: number) => void,  
    handleRejectRequest: (requestId: number) => void,
}

function RequestChoice(props: Props) {
    
    return (
        <div className='requests-choice'>
            <button type='submit' onClick={ () => props.handleAcceptRequest(props.requestId) } className='requests-choice-button'>
                <img src='/static/icons/accept_primary.svg' className='requests-choice-image' alt='tilde icon'/>
            </button>
            <button type='submit' onClick={ () => props.handleRejectRequest(props.requestId) } className='requests-choice-button'>
                <img src='/static/icons/reject_primary.svg' className='requests-choice-image' alt='x mark icon'/>
            </button>
        </div>
    )
}

export default RequestChoice;