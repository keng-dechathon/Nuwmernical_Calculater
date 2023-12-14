
import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { MatrixBox, random_bg_color, Topic, Gradients } from '../Components/Style-Component';
import styled from 'styled-components';
import axios from 'axios';
import GraphDot from '../Components/GraphDot';

const Spline = require('cubic-spline');


const Outputbox = styled.div`
background-color: lightgray;
width: 100%;
margin-top: 20px;
padding:30px;

`


let xArr = [], yArr = [], xForm = [], yForm = [], ans = [], random = 0;

export default function Splines() {
    random_bg_color();
    const initial = {
        pointNumber: '2',
        x: '',      
        showInput: false,
        showAns: false,
    };
    const [Error, setError] = useState(false);
    const [{ pointNumber, showInput, showAns, x }, setState] = useState(initial);
    function inputForm(n = 2) {
        xArr = [];
        yArr = [];       
        xForm = [];
        yForm = [];
        for (let i = 1; i <= n; i++) {
            xForm.push(<Input style={{ width: '100%' }} addonBefore={'x' + i} id={'x' + i} key={"x" + i} placeholder={"x" + i} onChange={() => setState(prev => ({ ...prev }))} />)
            yForm.push(<Input style={{ width: '100%' }} addonBefore={'y' + i} id={'y' + i} key={"y" + i} placeholder={"y" + i} onChange={() => setState(prev => ({ ...prev }))} />)
            xForm.push(<br />)
            yForm.push(<br />)
        }
        setState(prev => ({ ...prev, showInput: true }));
    }
    function createArray() {
        xArr = [];
        yArr = [];       
        try {
            setError(false);
            for (let i = 1; i <= pointNumber; i++) {
                xArr[i - 1] = [];
                yArr[i - 1] = [];
                let b = parseFloat(document.getElementById("x" + i).value);
                let c = parseFloat(document.getElementById("y" + i).value);
                if (isNaN(b) || isNaN(c)) {
                    setError('wrong input!!!');
                    return;
                }
                xArr[i - 1] = b;
                yArr[i - 1] = c;
            }           
        }
        catch (e) {
            setError(e.name)
        }
    }
    function spline() {
        createArray();
        ans=[];
        const MM = new Spline(xArr, yArr);       
        let Ans  =MM.at(x); 
        ans.push(<h1>f(x) : {Ans}</h1>)
    }
    function Process() {
        try {                 
            spline();
            setState(prev => ({ ...prev, showAns: true }));
        } catch (e) {
            setError('RangeError or wrong input!!!');
        }
    }
    function onChange(e) {
        xArr = [];
        yArr = [];
        ans = [];
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value, showInput: true, showAns: false }));
    }
    function Clear() {
        xArr = [];
        yArr = [];     
        xForm = [];
        yForm = [];
        ans = [];
        setState({ initial });
        setError(false);
    }
    async function getExample() {
        let api;

        while (true) {
            let n = Math.floor(Math.random() * 2);
            if (n !== random) {
                random = n;
                break;
            }
        }
        setError(false);
        setState(prev => ({ ...prev, showAns: false }));

        await axios({
            method: "get",
            url: `http://localhost:3000/api/data/interpolation${random}`,
        }).then((reply) => {
            api = reply.data;
            console.log("reply: ", api);
        });
        await setState(prev => ({ ...prev, pointNumber: api.pointNumber, x: api.x }));
        await inputForm(api.pointNumber);

        for (let i = 0; i < api.pointNumber; i++) {
            document.getElementById("x" + (i + 1)).value = api.Xarr[i];
            document.getElementById("y" + (i + 1)).value = api.Yarr[i];

        }



    }
    return (
        <>
            <Topic>
               SPILINE METHOD
            </Topic>
            <MatrixBox style={{ padding: '20px' }}>

                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                        <Input addonBefore="Number of point" name="pointNumber" id="pointNumber" placeholder='Enter Number' value={pointNumber} onChange={(e) => { inputForm(e.target.value); onChange(e); }} />
                        <Input style={{ marginLeft: '20px' }} addonBefore="Predict X" name="x" id="x" placeholder='Enter Number' value={x} onChange={(e) => { onChange(e); }} />
                    </div>

                    {!showInput && inputForm()}
                    {!showInput && setState(prev => ({ ...prev, pointNumber: '2' }))}
                    <Gradients>
                        <div style={{ width: '100%', display: 'flex', margin: '10px 0' }}>
                            <div style={{ width: '24%', border: '1px solid black', padding: '20px', margin: '20px 10px 20px 20px' }}>
                                <h2 >X</h2>
                                {showInput && xForm}
                            </div>
                            <div style={{ width: '24%', border: '1px solid black', padding: '20px', margin: '20px 20px 20px 10px' }}>
                                <h2 >Y</h2>
                                {showInput && yForm}
                            </div>
                            <div style={{ width: '50%', margin: '20px 20px 20px 0',border: '1px solid black', padding: '20px' }}>

                                {showAns && <GraphDot title="SPLINE METHOD" xArr={xArr} yArr={yArr} id='showGraph' />}
                                {showAns &&
                                    <Outputbox>
                                        {!Error ? <h2>SOLUTION</h2> : Error}
                                        {!Error && ans}
                                    </Outputbox>
                                }
                            </div>
                        </div>
                    </Gradients>
            
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            id='submit'
                            onClick={Process}
                            type="primary"
                            size="default"
                            style={{ width: '30%', marginRight: '15px', background: '#88B04B', border: '1px solid #88B04B' }}
                        >
                            Submit
                        </Button>
                        <Button
                            id='exam'
                            onClick={getExample}
                            type="primary"
                            size="default"
                            style={{ width: '100px', marginRight: '15px' }}
                        >
                            Example
                        </Button>

                        <Button
                            id='clear'
                            onClick={Clear}
                            type="primary"
                            size="default"
                            style={{ width: '100px' }}
                            danger
                        >
                            Clear
                        </Button>
                    </div>

                </div>

            </MatrixBox>
        </>
    );

}

