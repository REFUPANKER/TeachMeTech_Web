import React from 'react';

import Img_Courses from "./assets/img/Courses_Example.png"
import Img_Chat from "./assets/img/Chat_Example.png"


export default function Home() {
    return (
        <div
            style={{
                background: 'rgb(13,13,13)',
                width: '100%',
                minHeight: '200vh',
                margin: 0,
                color: 'rgb(255,255,255)',
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                fontFamily: "'SF Pro Display', sans-serif",
            }}
        >
            <div>
                <div
                    style={{
                        borderRadius: '10rem',
                        boxShadow: '0 0 50rem 20rem #075D17',
                        width: 0,
                        height: 0,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                    }}
                />
                <div
                    style={{
                        borderRadius: '10rem',
                        boxShadow: '0 0 50rem 20rem #075D17',
                        width: 0,
                        height: 0,
                        position: 'absolute',
                        right: 0,
                        top: '200vh',
                    }}
                />
                <div
                    style={{
                        borderRadius: '10rem',
                        boxShadow: '0 0 50rem 20rem #075D17',
                        width: 0,
                        height: 0,
                        position: 'absolute',
                        left: 0,
                        top: '110vh',
                    }}
                />
            </div>
            <nav className="navbar navbar-expand-md" style={{ zIndex: 6 }}>
                <div className="container-fluid">
                    <a
                        href="#"
                        style={{
                            fontSize: '2rem',
                            color: 'white',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            marginLeft: '2vw',
                        }}
                    >
                        Teach Me Tech
                    </a>
                    <button
                        data-bs-toggle="collapse"
                        className="navbar-toggler"
                        data-bs-target="#navcol-1"
                    >
                        <span className="visually-hidden">Toggle navigation</span>
                        <span className="navbar-toggler-icon" style={{ filter: 'invert(100%)' }} />
                    </button>
                    <div className="collapse navbar-collapse text-white" id="navcol-1" style={{ justifyContent: 'end' }}>
                        <div
                            className="navbar-nav"
                            style={{ display: 'flex', columnGap: '5rem', rowGap: '1rem', marginRight: '2rem' }}
                        >
                            <a className="nav-item text-white text-decoration-none" style={{ cursor: 'pointer', fontSize: '1.3rem' ,color:"white !important"}}>
                                Blog
                            </a>
                            <a className="nav-item text-white text-decoration-none" style={{ cursor: 'pointer', fontSize: '1.3rem' }}>
                                Explore
                            </a>
                            <a className="nav-item text-white text-decoration-none" style={{ cursor: 'pointer', fontSize: '1.3rem' }}>
                                About
                            </a>
                            <a className="nav-item text-white text-decoration-none" style={{ cursor: 'pointer', fontSize: '1.3rem' }}>
                                Contact
                            </a>
                            <a href='account' className="nav-item text-white text-decoration-none" style={{ cursor: 'pointer', fontSize: '1.3rem' }}>
                                Account
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="d-flex flex-column" style={{ zIndex: 5 }}>
                <h1
                    className="pt-5 pb-3"
                    style={{
                        fontSize: '6rem',
                        paddingLeft: '15%',
                        background: 'linear-gradient(125deg, #434343 0%, white 37%, #434343 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    The New Place to Learn
                </h1>
                <div className="w-100 d-flex" style={{ height: '100vh' }}>
                    <div className="w-75 h-100 d-flex flex-column align-items-center pt-5">
                        <div className="w-75 d-flex flex-column justify-content-between" style={{ height: '60%' }}>
                            <div className="w-75 h-auto d-flex flex-column">
                                <h3 style={{ borderLeft: '0.5rem solid rgb(21,255,72)', paddingLeft: '1rem' }}>Download the app</h3>
                                <a
                                    className="d-flex align-items-center mt-3"
                                    href="https://play.google.com/store/games?hl=tr&amp;pli=1"
                                    style={{
                                        columnCount: 3,
                                        columnGap: '2rem',
                                        width: 'fit-content',
                                        cursor: 'pointer',
                                        borderRadius: '1rem',
                                        border: '0.1rem solid #6F6F6F',
                                        background: 'linear-gradient(45deg, #222222, #3D3D3D 61%, #222222 100%)',
                                        color: 'white',
                                        textDecoration: 'none',
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="p-3"
                                        style={{ aspectRatio: '1/1', width: '5rem' }}
                                        src="https://cdn-icons-png.flaticon.com/512/300/300218.png"
                                        alt="App Icon"
                                    />
                                    <h3 className="m-0 p-0">Teach Me Tech</h3>
                                    <img
                                        className="p-3"
                                        style={{ aspectRatio: '1/1', width: '5rem', filter: 'invert()' }}
                                        src="https://cdn-icons-png.flaticon.com/512/8584/8584964.png"
                                        alt="Google Play Icon"
                                    />
                                </a>
                                <p className="mt-2" style={{ fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 200 }}>
                                    “The education platform with addiction triggering tricks”
                                </p>
                            </div>
                            <p className="mt-2" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                                By Pankers Community for Everyone © 2024
                            </p>
                        </div>
                    </div>
                    <div className="w-50 h-100 d-flex" style={{ right: 0, top: 0 }}>
                        <div
                            className="w-75 overflow-hidden"
                            style={{
                                background: `url(${Img_Courses.src}) center / contain no-repeat`,
                                transform: 'rotateZ(-10deg)',
                            }}
                        />
                    </div>
                </div>
                <div className="d-flex mt-5" style={{ height: '100vh' }}>
                    <div className="w-50 d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                        <div
                            className="w-75 h-75"
                            style={{
                                background: `url(${Img_Chat.src}) center / contain no-repeat`,
                                transform: 'rotateZ(10deg)',
                            }}
                        />
                    </div>
                    <div className="w-75 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <div
                            className="d-flex flex-column p-4"
                            style={{
                                borderRadius: '2rem',
                                border: '0.3rem solid #333333',
                                background: 'linear-gradient(to bottom right, #292929 0%, #1a1a1a 48%)',
                                width: '70%',
                            }}
                        >
                            <h3
                                className="text-decoration-none text-center"
                                style={{ fontWeight: 200, fontSize: '1.8rem' }}
                            >
                                Chat on public rooms and get new friends
                            </h3>
                            <p style={{ fontWeight: 100, fontSize: '1.3rem' }}>
                                If you are bored studying, try chatting with other users
                            </p>
                            <div className="mt-3 d-flex flex-column">
                                <div className="w-100 d-flex">
                                    <div
                                        className="w-25"
                                        style={{
                                            aspectRatio: '1',
                                            filter: 'invert(100%)',
                                            background: 'url(https://cdn-icons-png.flaticon.com/512/2438/2438078.png) center / 60% no-repeat',
                                        }}
                                    />
                                    <div className="w-75">
                                        <h3 className="text-decoration-none text-center" style={{ fontWeight: 200, fontSize: '1.8rem' }}>
                                            Data Privacy
                                        </h3>
                                        <p className="p-2" style={{ fontWeight: 100, fontSize: '1.3rem' }}>
                                            Do not share your private data while chatting.
                                            <br />
                                            We have moderators to manage chat but users also have to be careful.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-100 d-flex">
                                    <div
                                        className="w-25"
                                        style={{
                                            aspectRatio: '1',
                                            filter: 'invert(100%)',
                                            background: 'url(https://cdn-icons-png.flaticon.com/512/9319/9319051.png) center / 60% no-repeat',
                                        }}
                                    />
                                    <div className="w-75">
                                        <h3 className="text-decoration-none text-center" style={{ fontWeight: 200, fontSize: '1.8rem' }}>
                                            Chatting Gift
                                        </h3>
                                        <p className="p-2" style={{ fontWeight: 100, fontSize: '1.3rem' }}>
                                            You will get 5 rank score for every 5 message
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
