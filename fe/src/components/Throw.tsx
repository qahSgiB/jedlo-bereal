type ThrowProps = {
    error: unknown,
}


const Throw = (props: ThrowProps) => {
    throw props.error;
}



export default Throw