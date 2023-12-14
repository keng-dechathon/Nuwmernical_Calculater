
import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';

import { MatrixBox, random_bg_color, Topic, PreBox, ScrollforTable, Gradient } from '../Components/Style-Component';
import styled from 'styled-components';
import { } from '../Components/Style-Component';
import axios from 'axios';

const { regression } = require("multiregress");

const Outputbox = styled.div`
background-color: lightgray;
width: 50%;
margin:10px 20px 10px 10px;
padding:20px;

`
var columns = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];

let Arr = [], xiArr = [], xForm = [], yForm = [], preForm = [], ans = [], data = [], n = 2, m = 2;
export default function Multiple() {
    random_bg_color();
    const initial = {
        x: '',
        showInput: false,
        showAns: false,
    };
    const [Error, setError] = useState(false);
    const [{ showInput, showAns }, setState] = useState(initial);
    function inputForm() {
        Arr = [];
        xForm = [];
        yForm = [];
        preForm = [];
        data = [];
        preForm[1] = [];
        for (let i = 1; i <= n; i++) {
            xForm[i] = []
            for (let j = 1; j <= m; j++) {
                if (i === 1) {
                    preForm[i].push(<Input style={{ width: '120px', margin: '0 0px 20px 20px' }} addonBefore={'x' + j} id={'xi' + j} key={"xi" + j} placeholder={"x" + j} />)
                }
                xForm[i].push(<Input style={{ width: '120px', margin: '0 0 10px 10px' }} addonBefore={'x' + j} id={'x' + i + "" + j} key={"x" + i + "" + j} placeholder={"x" + i + "" + j} />)
            }
            yForm.push(<Input style={{ width: '120px', margin: '0 0 10px 10px' }} addonBefore={'y' + i} id={'y' + i} key={"y" + i} placeholder={"y" + i} />)

            data.push({
                no: i,
                x: xForm[i],
                y: yForm[i - 1]
            })


        }

        setState(prev => ({ ...prev, showInput: true }));
    }
    function createArray() {
        setError(false);
        xiArr = [];
        Arr = [];
        for (let i = 1; i <= n; i++) {
            Arr[i - 1] = [];
            for (let j = 1; j <= m; j++) {
                if (i === 1) {
                    xiArr[j - 1] = [];
                    let a =parseFloat(document.getElementById('xi' + j).value);
                    xiArr[j - 1] = a;
                    if(isNaN(a)){
                        setError("wrong input!!!");
                        return;
                    }
                    
                }
                let b=parseFloat(document.getElementById('x' + i + "" + j).value);
                if(isNaN(b)){
                    setError("wrong input!!!");
                    return;
                }
                Arr[i - 1][j - 1] = b;
            }
            let c= parseFloat(document.getElementById('y' + i).value);
            if(isNaN(c)){
                setError("wrong input!!!");
                return;
            }
            Arr[i - 1][m] = c;
        }
    }
    function multiple() {
        createArray();
        let mul = regression(Arr)
        console.log(mul);
        ans = [];
        let sum = 0;
        for (let i = 0; i < mul.length; i++) {
            ans.push(<h1>a{i} : {mul[i]}</h1>);
            if (i === 0) {
                sum += mul[i];
            } else sum += mul[i] * xiArr[i - 1];

        }
        ans.push(<h1>f(x) : {sum} </h1>)

    }
    function Process() {
        try {
            multiple();
            setState(prev => ({ ...prev, showAns: true }));
        } catch (e) {
            setError('wrong input!!!');
        }
    }

    function Clear() {
        Arr = [];
        xForm = [];
        yForm = [];
        ans = [];
        Arr = [];
        preForm = [];
        data = [];
        xiArr = [];
        n = 2;
        m = 2;
        setState({ initial });
        setError(false);
    }
    async function getExample() {
        let api;
        setError(false);
        setState(prev => ({ ...prev, showAns: false }));
        await axios({
            method: "get",
            url: `http://localhost:3000/api/data/Multiple`,
        }).then((reply) => {
            api = reply.data;
            n = api.n;
            m = api.m;
            console.log("reply: ", api);
        });       
        await inputForm();
        for (let i = 1; i <= api.n; i++) {
            for (let j = 1; j <= api.m; j++) {
                if (i === 1) {
                    document.getElementById('xi' + j).value = api.Xi[j - 1];
                }
                document.getElementById('x' + i + "" + j).value = api.XX[i - 1][j - 1];
            }
            document.getElementById('y' + i).value = api.YY[i - 1];
        }
    }
    return (
        <>
            <Topic>
                MULTIPLE-LINEAR REGRESSION METHOD
            </Topic>
            <MatrixBox style={{ padding: '20px' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex' }}>
                        <Input addonBefore="Number of point" name="pointNumber" id="pointNumber" placeholder='Enter Number' value={n} onChange={(e) => { n = e.target.value; inputForm() }} />
                        <Input style={{ marginLeft: '20px' }} addonBefore="Number of X" name="xNumber" id="xNumber" placeholder='Enter Number' value={m} onChange={(e) => { m = e.target.value; inputForm() }} />
                    </div>
                    {!showInput && inputForm()}
                    <Gradient>
                        <div style={{ width: '100%', display: 'flex', margin: '10px 0' }}>
                            <ScrollforTable style={{ width: '50%', margin: '10px 10px 10px 20px' }}>
                                <Table columns={columns} dataSource={data} style={{}} pagination={{ position: ['none', 'none'] }} />
                            </ScrollforTable>
                            <Outputbox>
                                {(!Error && showAns) ? <h2>SOLUTION</h2> : Error}
                                {(!Error && showAns) && ans}
                            </Outputbox>
                        </div>
                    </Gradient>
                    <PreBox>
                        <h3 style={{ margin: '0 0 20px 20px' }}>Predict X</h3>
                        {preForm}
                    </PreBox>
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

