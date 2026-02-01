import React, { useEffect, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';
import './Homepage.css';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { FaPlay } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import Card from '../components/card';
import api from '../api/axios';
import { toast, Toaster } from 'sonner';

function Homepage() {
    const [thriller, setThriller] = useState([]);
    const [romance, setRomance] = useState([]);
    const [comedy, setComedy] = useState([]);
    const [action, setAction] = useState([]);
    const [drama, setDrama] = useState([]);
    const [horror, setHorror] = useState([]);
    const [fiction, setFiction] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Thriller',
                });
                const movieArr = res.data;
                setThriller(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Romance',
                });
                const movieArr = res.data;
                setRomance(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Comedy',
                });
                const movieArr = res.data;
                setComedy(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Action',
                });
                const movieArr = res.data;
                setAction(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Drama',
                });
                const movieArr = res.data;
                setDrama(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Horror',
                });
                const movieArr = res.data;
                setHorror(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
        (async () => {
            try {
                const res = await api.post('bytag', {
                    tag: 'Science Fiction',
                });
                const movieArr = res.data;
                setFiction(movieArr);
            } catch {
                toast.error('Something went wrong', {
                    position: 'top-center',
                });
            }
        })();
    }, []);

    return (
        <div>
            <Toaster
                toastOptions={{
                    style: {
                        background: 'var(--color-bg-card)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--overlay-white-10)',
                        boxShadow: '0 8px 24px var(--overlay-dark-70)',
                        borderRadius: '8px',
                    },
                }}
            />
            <div className="navbar">
                <div className="turtle">TURTLE</div>
                <a className="navElements">Home</a>
                <a className="navElements" href="#Recommendation">
                    Recommendation
                </a>
                <a className="navElements" href="#Comedy">
                    Comedy
                </a>
                <a className="navElements" href="#Thriller">
                    Thriller
                </a>
                <a className="navElements" href="#Horror">
                    Horror
                </a>
                <a className="navElements" href="#Romance">
                    Love
                </a>
                <div className="searchBox">
                    <IoSearchSharp size={24} />
                </div>
                <div className="uploadBox">
                    <button className="uploadBtn">
                        <FiUpload />
                        Upload
                    </button>
                </div>
                {/* <div className="loginBox">
                    <button className="loginBtn">Upload</button>
                </div> */}
            </div>

            <div className="heroMovie">
                <img src="./poster.jpeg" alt="" className="posterImg" />
                <div className="contentHero">
                    <div className="titleHero">The Last Horizon</div>
                    <div className="featuresHero">98% Match</div>
                    <div className="descriptionHero">
                        When humanity's final colony ship encounters an
                        impossible anomaly at the edge of known space, Captain
                        Sarah Chen must make a choice that will determine the
                        fate of the human race. sample data
                    </div>
                    <div className="btnboxHero">
                        <button className="playHero">
                            <FaPlay />
                            Play
                        </button>
                        <button className="infoHero">
                            <IoIosInformationCircleOutline />
                            More info
                        </button>
                    </div>
                    <div className="detailsHero">
                        <div className="priceHero">$4.99</div>
                        <GoDotFill size={10} />
                        <div className="createdHero">Created with Love</div>
                    </div>
                </div>
            </div>

            {/* ["Action","Comedy","Drama","Horror","Romance","Science Fiction","Thriller","Western"] */}

            <div className="responsive">
                <div className="cardRow">
                    <div className="cardTitle" id="Thriller">
                        Thriller{' '}
                    </div>
                    <div className="cards">
                        {thriller.length > 0 ? (
                            thriller.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Romance">
                        Romance
                    </div>
                    <div className="cards">
                        {romance.length > 0 ? (
                            romance.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Recommendation">
                        Top 10 for You
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle">You may like</div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Comedy">
                        Comedy
                    </div>
                    <div className="cards">
                        {comedy.length > 0 ? (
                            comedy.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Action">
                        Action
                    </div>
                    <div className="cards">
                        {action.length > 0 ? (
                            action.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Drama">
                        Drama
                    </div>
                    <div className="cards">
                        {drama.length > 0 ? (
                            drama.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Horror">
                        Horror
                    </div>
                    <div className="cards">
                        {horror.length > 0 ? (
                            horror.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="cardRow">
                    <div className="cardTitle" id="Fiction">
                        Science Fiction
                    </div>
                    <div className="cards">
                        {fiction.length > 0 ? (
                            fiction.map(
                                (e: {
                                    name: string;
                                    description: string;
                                    _id: string;
                                    price: number;
                                }) => {
                                    return (
                                        <Card
                                            name={e.name}
                                            description={e.description}
                                            id={e._id}
                                            price={e.price}
                                        />
                                    );
                                },
                            )
                        ) : (
                            <>
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                                <Card
                                    name="Loading"
                                    description="Loading"
                                    id="0"
                                    price={0}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
