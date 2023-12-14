
import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { MatrixBox, random_bg_color, Topic, Gradients } from '../Components/Style-Component';
import styled from 'styled-components';
import axios from 'axios';
import GraphDot from '../Components/GraphDot';

const regression = require("regression");

const Outputbox = styled.div`
background-color: lightgray;
width: 100%;
margin:20px 20px 0 0;
padding:20px;

`

let Arr = [], xForm = [], yForm = [], A = [], random = 0, xArr = [], yArr = [], pointNumber=2, x='';
export default function Linear() {
    random_bg_color();
    const initial = {
        showInput: false,
        showAns: false,
    };
    const [Error, setError] = useState(false);
    const [{ showInput, showAns }, setState] = useState(initial);
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
        setState(({ showInput: true, showAns: false }));
    }
    function createArray() {
        setError(false);
        Arr = [];
        yArr = [];
        xArr = [];
        for (let i = 1; i <= pointNumber; i++) {
            Arr[i - 1] = [];
            let b = parseFloat(document.getElementById("x" + i).value);
            let c = parseFloat(document.getElementById("y" + i).value);
            if (isNaN(b) || isNaN(c)) {
                setError('wrong input!!!');
                return;
            }
            xArr[i - 1] = b
            yArr[i - 1] = c
            Arr[i - 1][0] = b;
            Arr[i - 1][1] = c;
        }
    }
    function linear() {
        createArray();
        const result = regression.linear(Arr);
        let a0 = result.equation[1];
        let a1 = result.equation[0];
        A[0] = (<h1>a0 : {a0}</h1>);
        A[1] = (<h1>a1 : {a1}</h1>);
        A[2] = (<h1>f({x})={a0}+{a1}({x})</h1>);
        A[3] = (<h1>f({x})={a0 + a1 * x}</h1>);
    }
    function Process() {
        try {
            setState({ showInput: true, showAns: true });
            linear();
        } catch (e) {
            setError(e.name);
        }
    }
    function onChange(e) {
        setState({ showInput: true, showAns: false });
    }
    function Clear() {
        Arr = [];
        A = [];
        xForm = [];
        yForm = [];
        yArr = [];
        xArr = [];
        pointNumber=2;
        x='';
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
        setState({ showInput: true, showAns: false });

        await axios({
            method: "get",
            url: `http://localhost:3000/api/data/interpolation${random}`,
        }).then((reply) => {
            api = reply.data;
            x = api.x;
            pointNumber = api.pointNumber;
            console.log("reply: ", api);
        });
        await inputForm(api.pointNumber);

        for (let i = 0; i < api.pointNumber; i++) {
            document.getElementById("x" + (i + 1)).value = api.Xarr[i];
            document.getElementById("y" + (i + 1)).value = api.Yarr[i];
        }
    }
    return (
        <>
            <Topic>
                LINEAR REGRESSION METHOD
            </Topic>
            <MatrixBox style={{ padding: '20px' }}>

                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                        <Input addonBefore="Number of point" name="pointNumber" id="pointNumber" placeholder='Enter Number' value={pointNumber} onChange={(e) => { pointNumber = e.target.value; inputForm(e.target.value); onChange(); }} />
                        <Input style={{ marginLeft: '20px' }} addonBefore="Predict x" name="x" id="x" placeholder='Enter Number' value={x} onChange={(e) => { x = e.target.value; onChange(); }} />
                    </div>
                    {!showInput && inputForm()}
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
                            <div style={{ width: '50%', margin: '20px 20px 20px 10px' ,border:'1px solid black',padding:'20px'}}>
                                {showAns && <GraphDot title="Linear Regression" xArr={xArr} yArr={yArr} id='showGraph' style={{display:'block'}} />}
                                {showAns &&
                                    <Outputbox>
                                        {!Error ? <h2>SOLUTION</h2> : Error}
                                        {!Error && A}
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

