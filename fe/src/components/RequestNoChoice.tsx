import './RequestNoChoice.css'

type Props = {
    requestId: number,
    handleDeleteRequest: (requestId: number) => void,
}

function RequestNoChoice(props: Props) {
    
    return (
        <div className='requests-nochoice'>
            <h2 className='requests-nochoice-text'>SENT</h2>
            <button type='submit' onClick={ () => props.handleDeleteRequest(props.requestId) } className='requests-nochoice-button'>
                <img src='/static/icons/reject_primary.svg' className='requests-nochoice-image' alt='x mark icon' />
            </button>
        </div>
    )
}

export default RequestNoChoice;