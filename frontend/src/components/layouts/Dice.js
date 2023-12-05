export const Dice = ({ value, selected }) => {
    if(selected) {
        return (
            <img src={process.env.PUBLIC_URL + "/images/selected_dice" + value + ".png"} alt={"selected_dice" + value}  />
        );
    }else {
        return (
            <img src={process.env.PUBLIC_URL + "/images/dice" + value + ".png"} alt={"dice" + value}  />
        );
    }
}