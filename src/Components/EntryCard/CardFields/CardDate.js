const CardDate = function ({ date, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <div>
                <h3>Date: </h3>
                <p>{new Date(date).toDateString()}</p>
            </div>
        );
    }
    return null;
};

export default CardDate;
