
import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { MatrixBox, random_bg_color, Topic, Gradients } from '../Components/Style-Component';
import styled from 'styled-components';
import axios from 'axios';
import GraphDot from '../Components/GraphDot';

const math = require("mathjs");

const Outputbox = styled.div`
background-color: lightgray;
width: 100%;
margin-top: 20px;
padding:30px;

`


let xArr = [], yArr = [], zArr = [], xForm = [], yForm = [], ans = [], random = 0;
let xi = [],fxi = [];
export default function NewtonDivide() {
    random_bg_color();
    const initial = {
        pointNumber: '2',
        x: '',
        point: '',
        showInput: false,
        showAns: false,
    };
    const [Error, setError] = useState(false);
    const [{ pointNumber, showInput, showAns, point, x }, setState] = useState(initial);
    function inputForm(n = 2) {
        xArr = [];
        yArr = [];
        zArr = [];
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
        zArr = [];
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
            let z = document.getElementById("point").value;
            zArr = z.split(',');
            for (let i = 0; i < zArr.length; i++) {
                zArr[i] = parseFloat(zArr[i]);
            }
        }
        catch (e) {
            setError(e.name)
        }

    }
    function newton() {
        createArray();
        ans = [];             
        var push = () => {
            xi=[];
            fxi=[];
            zArr = zArr.map((value)=>value-1);            
            zArr.forEach((value)=>{
                xi.push(xArr[value])
                fxi.push(yArr[value])
            });
        }         
        var calc = (i,j)=>{
            if(i===j)return fxi[i]
            else if(math.abs(j-i) === 1)return (fxi[j]-fxi[i])/(xi[j]-xi[i])
            else return ((calc(i+1,j))-calc(i,j-1))/(xi[j]-xi[i])
        }
        var Ans = (find)=>{
            var sum = 0
            for(let i=0;i<xi.length;i++){
                let temp = calc(0,i);
                for(let j=0;j<i;j++){
                    temp *= (find-xi[j]);
                }
                sum +=  temp;
            }
            return sum;
        }     
        push();
        ans.push(<h3>{"f(x) : " +Ans(x)}</h3>);                  
    }
    function Process() {
        try {                 
            newton();
            setState(prev => ({ ...prev, showAns: true }));
        } catch (e) {
            setError('RangeError or wrong input!!!');
        }
    }
    function onChange(e) {
        xArr = [];
        yArr = [];
        zArr = [];
        ans = [];
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value, showInput: true, showAns: false }));
    }
    function Clear() {
        xArr = [];
        yArr = [];
        zArr = [];
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
        await setState(prev => ({ ...prev, pointNumber: api.pointNumber, point: api.interpolatePoint, x: api.x }));
        await inputForm(api.pointNumber);

        for (let i = 0; i < api.pointNumber; i++) {
            document.getElementById("x" + (i + 1)).value = api.Xarr[i];
            document.getElementById("y" + (i + 1)).value = api.Yarr[i];
        }



    }
    return (
        <>
            <Topic>
                NEWTON-DIVIDE DIFFERENCE METHOD
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

                                {showAns && <GraphDot title="NEWTON-DIVIDE DIFFERENCE METHOD" xArr={xArr} yArr={yArr} id='showGraph' />}
                                {showAns &&
                                    <Outputbox>
                                        {!Error ? <h2>SOLUTION</h2> : Error}
                                        {!Error && ans}
                                    </Outputbox>
                                }
                            </div>
                        </div>
                    </Gradients>
                    {showInput && <Input addonBefore="interpolate point" id="point" name="point" placeholder='1,2,3,...' value={point} onChange={(e) => { onChange(e); }} />}
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

