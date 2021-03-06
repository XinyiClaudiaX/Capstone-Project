import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';



function Quiz(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [qindex, setQindex] = useState(0);
    const [radioChecked, setRadioChecked] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [popupContent, setpopupContent] = useState();
    const [formSubmit, setFormSubmit] = useState(false);
    const responses = {};

    useEffect(() => {
        fetch("/Quiz")
            .then(res => res.json())
            .then(
                (data) => {
                    if (data !== undefined) {
                        setQuestions(data.quiz_data);
                        console.log(data.quiz_data);
                        setIsLoaded(true);

                    }
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const handleSelect = (e) => {
        responses[e.target.name] = e.target.value
        console.log(responses)
    }

    const handleClose = () => {
        setShowPopup(false);
        props.history.push('/Leaderboard');
    }

    const handleSubmit = (e) => {
        /*if (Object.keys(responses).length < 5) {
            setpopupContent("You haven't answered all the questions. Do you want to submit now?")
            setShowPopup1(true)
            e.preventDefault();
        } else {
            setFormSubmit(true)
            e.preventDefault();
        }*/
        //if (formSubmit == true) {
        const userAnswers = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'responses': responses })
        };
        fetch('/Quiz', userAnswers)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setpopupContent("You Score is " + data.score)
                setShowPopup(true)
            });
        e.preventDefault();
        //}
    }

    const refreshQuiz = () => {
        window.location.reload(true);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="row">
                <form onSubmit={e => handleSubmit(e)}>
                    <div>
                        <p style = {{fontFamily: 'Kanit'}}><b>{questions[qindex].Question}</b></p>
                    </div>
                    <div className="d-flex flex-row">

                    <div className="p-2"></div>

                        <div style={{ textAlign: 'left', }} className="p-2 mx-auto">
                            {
                                questions[qindex].Answers.map(choice => {
                                    return (
                                        <>
                                            <div className="" >
                                                <input type="radio" value={choice}
                                                    name={questions[qindex].Question}
                                                    onChange={e => { setRadioChecked(choice); handleSelect(e); }}
                                                    checked={radioChecked == choice} />
                                                <label style = {{fontFamily: 'Kanit'}}>{choice}</label>
                                                <br />
                                            </div>
                                        </>
                                    )
                                })
                            }
                            
                            
                        </div>
                        <div className="p-2"></div>
                    </div>

                    <br />
                    <button className=".btn-space btn btn-outline-primary m-2" type="button" onClick={e => setQindex(qindex - 1)} hidden={(qindex == 0) ? true : false}>Previous</button>
                    <button className=".btn-space btn btn-outline-primary m-2" type="button" onClick={e => { setQindex(qindex + 1); setRadioChecked(""); }} hidden={(qindex == 4) ? true : false}>Next</button>
                    <button style = {{fontFamily: 'Kanit'}} className=".btn-space btn btn-outline-primary m-2" type="submit">Submit</button>
                </form>
                <Modal show={showPopup} onHide={handleClose}>
                    <Modal.Body>{popupContent}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                        <Button onClick={refreshQuiz}>
                            Try Again
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/*<Modal show={showPopup1}>
                    <Modal.Body>{popupContent}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setFormSubmit(true)}>
                           Yes
                        </Button>
                        <Button onClick={() => { setFormSubmit(false); setShowPopup(false);}}>
                           No
                        </Button>
                    </Modal.Footer>
            </Modal>*/}
            </div>
        );
    }
}

export default Quiz;