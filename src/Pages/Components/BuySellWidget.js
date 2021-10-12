import React from 'react';
import { useState, useContext } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {AuthContext} from '../../Auth';

function BuySellWidget(props){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ownedProperty, setOwnedProperty] = useState(0);
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);
    const {currentUser} = useContext(AuthContext);


    fetch("/Information?uid=" + currentUser.uid)
        .then(res => res.json())
        .then(
            (data) => {
                setOwnedProperty(data.property);
                setIsLoaded(true);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            });


    const handleSubmit = (e) => {
        const buySellRequest = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'trade': { coin_name: props.coin, amount: value, method: (index == 0) ? 'buy' : 'sell', uid: currentUser.uid, date: new Date(), price: props.price } })
        };/*
        console.log(buySellRequest)
        fetch('/SignIn', myRequest)
        .then(response => response.json())
        .then(data => console.log(data));*/
        e.preventDefault();
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
           <Tabs
                defaultIndex={0}
                selectedIndex={index}
                onSelect={(index) => setIndex(index)}
                style={{ width: 500 }}
            >
                <TabList>
                    <Tab>Buy</Tab>
                    <Tab>Sell</Tab>
                </TabList>

                <TabPanel style={{ width: 200 }}>
                    <form onSubmit={e => { handleSubmit(e) }}>
                        <label>I want to buy</label>
                        <RangeSlider
                            min={0}
                            max={ownedProperty}
                            value={value}
                            onChange={changeEvent => {
                                setValue(changeEvent.target.value);
                            }}
                            size='sm'
                            tooltip='on'
                        />
                        <br />
                        <button type="submit">Buy Now!</button>
                    </form>
                </TabPanel>
                <TabPanel style={{ width: 200 }}>
                    <form onSubmit={e => { handleSubmit(e) }}>
                        <label>I want to sell</label>
                        <RangeSlider
                            min={0}
                            max={ownedProperty}
                            value={value}
                            onChange={changeEvent => {
                                setValue(changeEvent.target.value);
                            }}
                            size='sm'
                            tooltip='on'
                        />
                        <br />
                        <button type="submit">Sell Now!</button>
                    </form>
                </TabPanel>
            </Tabs>
        );
    }
}
export default BuySellWidget;