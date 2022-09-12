const CardLocation = function ({ location, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <div>
                <h3>Location: </h3>
                <p>{JSON.stringify(location)}</p>
            </div>
        );
    }
    return null;
};

export default CardLocation;
