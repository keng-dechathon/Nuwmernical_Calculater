import React from 'react'
import 'antd/dist/antd.css';
import { random_bg_color } from '../Components/Style-Component';

export default function Home() {
    random_bg_color();

    return (
        <>       
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='videoBox'>               
                <video loop autoPlay muted >
                    <source src={"https://v.pinimg.com/videos/mc/720p/af/a3/06/afa306401897690941024fcddb25edb8.mp4"} type="video/mp4" />
                </video>
                <video loop autoPlay muted >
                    <source src={"https://v.pinimg.com/videos/mc/720p/96/a5/95/96a5952e547fa3f06d3e0c71152f5c57.mp4"} type="video/mp4" />
                </video>
                <video loop autoPlay muted >
                    <source src={"https://v.pinimg.com/videos/mc/720p/ba/5f/ec/ba5fecda6cf11f7dfbe91bb6c64730e1.mp4"} type="video/mp4" />
                </video>
                <video loop autoPlay muted >
                    <source src={"https://v.pinimg.com/videos/mc/720p/41/6f/af/416faff64a547e4ebe4a2d7fe39f6ede.mp4"} type="video/mp4" />
                </video>
            </div>


        </>
    )
}