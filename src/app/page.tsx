"use client";
import React, { useState } from 'react';

import Img_Courses from "./assets/img/Courses_Example.png"
import Img_Chat from "./assets/img/Chat_Example.png"
import "./page.css"

export default function Home() {

    const [navState, setNavState] = useState(true);

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
                fontFamily: "'Source Sans 3', sans-serif"
            }}
        >
            <div>
                <div
                    className='shadows z-0'
                    style={{
                        right: 0,
                        top: 0,
                    }}
                />
                <div
                    className='shadows z-0'
                    style={{
                        right: 0,
                        top: '200vh',
                    }}
                />
                <div
                    className='shadows'
                    style={{
                        left: 0,
                        top: '110vh',
                    }}
                />
            </div>

            <nav className="navbar navbar-expand-md" style={{ zIndex: 6 }}>
                <div className="container-fluid">
                    <a
                        className="navbar-brand text-xl md:text-4xl"
                        href="#"
                        style={{
                            color: 'white',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            marginLeft: '2vw',
                        }}
                    >
                        Teach Me Tech
                    </a>
                    <button
                        className="block md:hidden"
                        onClick={() => { setNavState(!navState) }}
                    >
                        <i className="fa-solid fa-bars text-3xl"></i>
                    </button>
                    <div
                        className={`${navState ? "collapse" : ""} navbar-collapse justify-content-end`}>
                        <div
                            className="navbar-nav"
                            style={{
                                display: 'flex',
                                columnGap: '4vw',
                                marginRight: '2rem',
                            }}
                        >
                            <a href='#' className="text-decoration-none text-white text-xl hover:font-bold" >
                                Blog
                            </a>
                            <a href='#' className="text-decoration-none text-white text-xl hover:font-bold" >
                                About
                            </a>
                            <a href='#' className="text-decoration-none text-white text-xl hover:font-bold" >
                                Contact
                            </a>
                            <a href='account' className="text-decoration-none text-white text-xl hover:font-bold" >
                                Account
                            </a>
                        </div>
                    </div>
                </div>
            </nav>


            <div className="d-flex flex-column" style={{ zIndex: 5 }}>
                <h1
                    className="slogan pt-5 pb-3 font-bold md:font-normal"
                    style={{
                        background: 'linear-gradient(125deg, #434343 0%, white 37%, #434343 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    The New Place to Learn
                </h1>
                <div className="w-100 d-flex flex-col lg:flex-row" style={{ height: '100vh' }}>
                    <div className="w-100 h-100 d-flex flex-column align-items-center pt-5 ">
                        <div className="w-full md:w-3/4 d-flex flex-column justify-content-between" style={{ height: '60%' }}>
                            <div className="ml-8 md:ml-0 w-fit h-auto d-flex flex-column">
                                <h3 style={{ borderLeft: '0.5rem solid rgb(21,255,72)', paddingLeft: '1rem' }}>Download the app</h3>
                                <a
                                    className="d-flex align-items-center mt-3"
                                    href="https://play.google.com/store/games?hl=tr&amp;pli=1"
                                    style={{
                                        columnCount: 3,
                                        width: 'fit-content',
                                        cursor: 'pointer',
                                        borderRadius: '1rem',
                                        border: '0.1rem solid #6F6F6F',
                                        background: 'linear-gradient(45deg, #222222, #3D3D3D 61%, #222222 100%)',
                                        color: 'white',
                                        textDecoration: 'none',
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <img
                                        className="p-3 w-12 md:w-16"
                                        style={{ aspectRatio: '1/1' }}
                                        src="https://cdn-icons-png.flaticon.com/512/300/300218.png"
                                        alt="App Icon"
                                    />
                                    <h3 className="m-0 p-0">Teach Me Tech</h3>
                                    <img
                                        className="p-3 w-12 md:w-16"
                                        style={{ aspectRatio: '1/1', filter: 'invert()' }}
                                        src="https://cdn-icons-png.flaticon.com/512/8584/8584964.png"
                                        alt="Google Play Icon"
                                    />
                                </a>
                                <p className="mt-2 text-xl md:text-2xl" style={{ fontStyle: 'italic', fontWeight: 200 }}>
                                    “The education platform with addiction triggering tricks”
                                </p>
                            </div>
                            <p className="mt-2 d-flex w-100 justify-center md:justify-start" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
                                By Pankers Community for Everyone © 2024
                            </p>
                        </div>
                    </div>
                    <div className="w-100 md:w-50 h-100 d-flex" style={{ right: 0, top: 0 }}>
                        <div
                            className="w-75 overflow-hidden hidden lg:block"
                            style={{
                                background: `url(${Img_Courses.src}) center / contain no-repeat`,
                                transform: 'rotateZ(-10deg)',
                            }}
                        />
                        <div className='flex lg:hidden w-100 h-100'>
                            <div className="flex-1 flex-col h-100 w-50 justify-center align-center">
                                <h5 className="text-center m-0">Courses</h5>
                                <div
                                    className="w-100 overflow-hidden h-100"
                                    style={{
                                        background: `url(${Img_Courses.src}) center / contain no-repeat`,
                                    }}
                                />
                            </div>
                            <div className="flex-1 flex-col h-100 w-50 justify-center align-center">
                                <h5 className="text-center m-0">Chat</h5>
                                <div
                                    className="w-100 overflow-hidden h-100"
                                    style={{
                                        background: `url(${Img_Chat.src}) center / contain no-repeat`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex mt-5" style={{ height: '100vh' }}>
                    <div className="w-50 d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                        <div
                            className="w-75 h-75  hidden lg:block"
                            style={{
                                background: `url(${Img_Chat.src}) center / contain no-repeat`,
                                transform: 'rotateZ(10deg)',
                            }}
                        />
                    </div>
                    <div className="w-100 lg:w-75 absolute lg:relative d-flex justify-content-center align-items-center " style={{ height: '100vh' }}>
                        <div
                            className="d-flex flex-column p-4 w-75 md:w-60"
                            style={{
                                borderRadius: '2rem',
                                border: '0.3rem solid #333333',
                                background: 'linear-gradient(to bottom right, #292929 0%, #1a1a1a 48%)',
                            }}
                        >
                            <h3
                                className="text-decoration-none text-center text-2xl lg:text-3xl"
                                style={{ fontWeight: 200 }}
                            >
                                Chat on public rooms and get new friends
                            </h3>
                            <h5 style={{ fontWeight: 100 }}>
                                If you are bored studying, try chatting with other users
                            </h5>
                            <div className="mt-3 d-flex flex-column">
                                <div className="w-100 d-flex flex-col md:flex-row">
                                    <div
                                        className="w-16 lg:w-40 self-center"
                                        style={{
                                            aspectRatio: '1',
                                            filter: 'invert(100%)',
                                            background: 'url(https://cdn-icons-png.flaticon.com/512/2438/2438078.png) center / 60% no-repeat',
                                        }}
                                    />
                                    <div className="w-100">
                                        <h3 className="text-decoration-none text-center text-2xl lg:text-3xl m-0" style={{ fontWeight: 200 }}>
                                            Data Privacy
                                        </h3>
                                        <p className="p-2 text-xl" style={{ fontWeight: 100 }}>
                                            Do not share your private data while chatting.
                                            <br />
                                            We have moderators to manage chat but users also have to be careful.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-100 d-flex flex-col md:flex-row">
                                    <div
                                        className="w-16 lg:w-40 self-center"
                                        style={{
                                            aspectRatio: '1',
                                            filter: 'invert(100%)',
                                            background: 'url(https://cdn-icons-png.flaticon.com/512/9319/9319051.png) center / 60% no-repeat',
                                        }}
                                    />
                                    <div className="w-100">
                                        <h3 className="text-decoration-none text-center text-2xl lg:text-3xl m-0" style={{ fontWeight: 200 }}>
                                            Chatting Gift
                                        </h3>
                                        <p className="p-2 text-xl" style={{ fontWeight: 100 }}>
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
