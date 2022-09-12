const CardID = function ({ uuid, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <div>
                <h3>Entry ID: </h3>
                <p>{uuid}</p>
            </div>
        );
    }
    return null;
};

export default CardID;
