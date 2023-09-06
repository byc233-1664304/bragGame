export default function Background() {
    return(
        <div className="hpbg">
            <img src={process.env.PUBLIC_URL + '/images/bg.svg'} alt="Background" />
        </div>
    );
}