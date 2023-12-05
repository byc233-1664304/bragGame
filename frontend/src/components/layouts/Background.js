export default function Background() {
    return(
        <div className="hpbg">
            <img src={process.env.REACT_APP_PUBLIC_URL + '/images/bg.svg'} alt="Background" />
        </div>
    );
}