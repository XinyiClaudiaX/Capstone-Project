import React, { useState, useEffect } from 'react';
import BuySellWidget from './Components/BuySellWidget';

function Information() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [price, setPrice] = useState(0)
    const [changeRate, setChangeRate] = useState(0)


    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=100&page=1')
    .then(res => res.json())
    .then(
        (data) => {
            setName(data[0].name);
            setImage(data[0].image);
            setPrice(data[0].current_price);
            setChangeRate(data[0].price_change_percentage_24h);
            setIsLoaded(true);
        },
        (error) => {
            setIsLoaded(true);
            setError(error);
        }
    )

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
           <div>
                <img src={image} />
                <h1>{name}</h1>
                <h1>{price}</h1>
                <h1>{changeRate}%</h1>
                <BuySellWidget />
           </div>
            
        );
    }
}

export default Information;