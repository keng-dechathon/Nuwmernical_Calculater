import React from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { Link } from 'react-router-dom';


const { Header } = Layout;

export default function Header1() {
    return (
        <>
            <Header
                className="header"
                style={{ position: "fixed", zIndex: 1, width: "100%" }}
            >
                <Link to="/">
                    <button className='tablink' style={{ lineHeight: 'normal', width: '100vw', height: '100%', margin: '0' }} >
                        NUWMERNICAL METHOD CALCULATER
                    </button>
                </Link>
            </Header>
        </>
    );
}
