import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



function Market() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [coins, setCoins] = useState([]);
    

    useEffect(() => {
        document.title = "Cryptics Market";
        fetch("/Market")
            .then(res => res.json())
            .then(
                (data) => {
                    setIsLoaded(true);
                    setCoins(data.Market);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const imageStyle = {
        width: "40%",
        height: "40%"
    }

    const innerTablePadding = {
            paddingTop: "50%"
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <table style={innerTablePadding}>
                <tr>
                    <td></td>
                    <td><h3>Coin</h3></td>
                    <td><h3>Price</h3></td>
                    <td><h3>Price Change in Past 24h</h3></td>
                    <td><h3>Price Change % in Past 24h</h3></td>
                </tr>
                {coins.map(coin => (
                    <tr>
                        <td><img style={imageStyle} src={coin.image} /></td>
                        <td><h3>{coin.name}</h3><h5>{coin.symbol}</h5></td>
                        <td>{coin.current_price}</td>
                        <td>{coin.price_change_24h}</td>
                        <td>{coin.price_change_percentage_24h}</td>
                        <td><button><Link to={{ pathname: `/Information`, state: { currency: coin.id } }} target = "_blank" onClick={() => {
                            localStorage.setItem("currency", coin.id)
                            }}> Detail </Link></button></td>
                    </tr>
                ))}
            </table>
        );
    }
}

export default Market;