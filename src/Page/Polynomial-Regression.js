
import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { MatrixBox, random_bg_color, Topic, Gradients } from '../Components/Style-Component';
import styled from 'styled-components';
import { } from '../Components/Style-Component';
import axios from 'axios';
import Graph from '../Components/Graph';

const math = require("mathjs");
const regression = require("regression")





const Outputbox = styled.div`
background-color: lightgray;
width: 100%;
margin:20px 20px 0 0;
padding:20px;

`


let Arr = [], xForm = [], yForm = [], A = [], random = 0, strFx = '';
export default function Polynomial() {
    random_bg_color();
    const initial = {
        pointNumber: '2',
        x: '',
        order: '',
        showInput: false,
        showAns: false,
    };
    const [Error, setError] = useState(false);
    const [{ pointNumber, x, order, showInput, showAns }, setState] = useState(initial);
    function inputForm(n = 2) {
        Arr = [];
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
        setError(false);
        Arr = [];
        for (let i = 1; i <= pointNumber; i++) {
            Arr[i - 1] = [];
            let b = parseFloat(document.getElementById("x" + i).value);
            let c = parseFloat(document.getElementById("y" + i).value);
            if (isNaN(b) || isNaN(c)) {
                setError('wrong input!!!');
                return;
            }
            // xArr[i - 1] = b;
            // yArr[i - 1] = c;
            Arr[i - 1][0] = b;
            Arr[i - 1][1] = c;
        }
    }
    function polynomial() {
        createArray();
        // console.log(Arr);       
        let result = regression.polynomial(Arr, { order: order });
        // console.log(result);
        let Fx = 0;
        strFx = '';
        A = [];
        for (let i = 0; i < result.equation.length; i++) {
            A.push(<h1>a{i} : {result.equation[i]}</h1>);
            Fx += result.equation[i] * (math.pow(x, i));

            if (i !== result.equation.length - 1) {
                strFx += `${result.equation[i]}*x^${i}+`
            } else {
                strFx += `${result.equation[i]}*x^${i}`
            }

            console.log(strFx);
        }
        A.push(<h1>f({x})={Fx}</h1>);
    }
    function Process() {
        try {          
            // yArr = [];
            // xArr = [];
            polynomial();
            setState(prev => ({ ...prev, showAns: true }));
        } catch (e) {
            setError('RangeError or wrong input!!!');
        }
    }
    function onChange(e) {
        strFx = '';
        Arr = [];
        A = [];        
        // yArr = [];
        // xArr = [];
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value, showInput: true, showAns: false }));
    }
    function Clear() {
        Arr = [];
        A = [];
        xForm = [];
        yForm = [];       
        // yArr = [];
        // xArr = [];
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
        await setState(prev => ({ ...prev, pointNumber: api.pointNumber, x: api.x, order: api.ordernumber }));
        await inputForm(api.pointNumber);

        for (let i = 0; i < api.pointNumber; i++) {
            document.getElementById("x" + (i + 1)).value = api.Xarr[i];
            document.getElementById("y" + (i + 1)).value = api.Yarr[i];
        }
    }
    return (
        <>
            <Topic>
                POLYNOMIAL REGRESSION METHOD
            </Topic>
            <MatrixBox style={{ padding: '20px' }}>

                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                        <Input addonBefore="Number of point" name="pointNumber" id="pointNumber" placeholder='Enter Number' value={pointNumber} onChange={(e) => { inputForm(e.target.value); onChange(e); }} />
                        <Input style={{ marginLeft: '20px' }} addonBefore="Predict x" name="x" id="x" placeholder='Enter Number' value={x} onChange={(e) => { onChange(e); }} />
                        <Input style={{ marginLeft: '20px' }} addonBefore="Order" name="order" id="order" placeholder='Enter Number' value={order} onChange={(e) => { onChange(e); }} />
                    </div>

                    {!showInput && inputForm()}
                    {!showInput && setState(prev => ({ ...prev, pointNumber: '2' }))}
                    <Gradients>
                        <div style={{ width: '100%', display: 'flex', margin: '10px 0' }}>
                            <div style={{ width: '24%', border: '1px solid black', padding: '20px', margin: '20px 10px 20px 20px' }}>
                                <h2 >X</h2>
                                {showInput && xForm}
                            </div>
                            <div style={{ width: '24%', border: '1px solid black', padding: '20px', margin: '20px 10px 20px 10px' }}>
                                <h2 >Y</h2>
                                {showInput && yForm}
                            </div>
                            <div style={{ width: '50%', margin: '20px 20px 20px 10px', border: '1px solid black', padding: '20px' }}>

                                {showAns && <Graph fx={strFx} title="POLYNOMIAL REGRESSION METHOD" id='showGraph' />}
                                {showAns &&
                                    <Outputbox>
                                        {(!Error && showAns) ? <h2>SOLUTION</h2> : Error}
                                        {(!Error && showAns) && A}
                                   
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

