import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import Graph from '../Components/Graph';
import { GraphBox, InputBox, ButtonLayout, Answer, ShowGraph, random_bg_color, ButtonLayout0, Topic } from '../Components/Style-Component';
import { compile } from 'mathjs';
import axios from 'axios';
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "X",
        dataIndex: "x1",
        key: "x1"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
let data = [], random = 0;
let err = 'none';
let x_next = null;
let x_now = null;
let ct = 0;
export default function OnePoint() {
    random_bg_color();
    const [Error, setError] = useState(false);
    const [Value, setValue] = useState({
        fx: '',
        x: '',
        err: '0.000001',
        showGraph: false,
        showTable: false
    });

    function onePoint(x1) {
        x_now = x1;
        data.push({
            key: ct,
            iteration: ct,
            x1: x_now,
            error: err,
        })
        ct += 1;
        while (err > Value.err || err === 'none') {
            x_next = compile(Value.fx).evaluate({ x: x_now });
            err = Math.abs((x_next - x_now) / x_next);
            x_now = x_next;
            data.push({
                key: ct,
                iteration: ct,
                x1: x_now,
                error: err,
            })
            ct += 1;

        }
    }
    function handleChange(key, evt) {
        if (key === "fx") setValue({ ...Value, [key]: evt.target.value, showGraph: false });
        else setValue({ ...Value, [key]: evt.target.value, showTable: false });
        setError(false);
        data = [];
    }
    function Process() {
        try {
            setError(false);
            err = 'none';
            x_next = null;
            x_now = null;
            ct = 0;
            if (isNaN(parseFloat(Value.x))) setError('Wrong input !!!');
            else {
                data = [];
                setValue({ ...Value, showGraph: true, showTable: true });
                onePoint(parseFloat(Value.x));
            }

        }
        catch (e) {
            setError(e.name)
        }
    }
    function clearInput() {
        setValue({
            fx: '',
            x: '',
            err: '0.000001',
            showGraph: false,
            showTable: false
        });
        setError(false)
        err = 'none';
        x_next = null;
        x_now = null;
        ct = 0;
        data = [];
    }
    async function getExample() {
        let api;

        while (true) {
            let n = Math.floor(Math.random() * 3);
            if (n !== random) {
                random = n;
                break;
            }
        }

        await axios({
            method: "get",
            url: `http://localhost:3000/api/data/One-Point${random}`,
        }).then((reply) => {
            api = reply.data;
            console.log("reply: ", api);
        });
        await setValue({
            ...Value,
            fx: api.fx,
            x: api.x,

        });
    }
    return (
        <>
            <Topic>
                ONE-POINT METHOD
            </Topic>
            <GraphBox>
                <InputBox>
                    <h3>Fill in a form</h3>
                    <Input addonBefore="fx" name="fx" placeholder='Enter Function ( f(x) )' value={Value.fx} onChange={(e) => handleChange('fx', e)} />
                    <Input addonBefore="X" name="x" placeholder='Guess (x0)' value={Value.x} onChange={(e) => handleChange('x', e)} />
                    <Input addonBefore="Error" name="err" placeholder='Error (e)' value={Value.err} onChange={(e) => handleChange('err', e)} />
                    <ButtonLayout0>
                        <Button
                            id='exam'
                            onClick={getExample}
                            type="primary"
                            size="default"
                            style={{ width: '40%', marginRight: '15px' }}
                        >
                            Example
                        </Button>
                        <Button
                            id='clear'
                            onClick={clearInput}
                            type="primary"
                            size="default"
                            style={{ width: '40%' }}
                            danger
                        >
                            Clear
                        </Button>
                    </ButtonLayout0>
                    <ButtonLayout>
                        <Button
                            id='submit'
                            onClick={Process}
                            type="primary"
                            size="default"
                            style={{ background: '#88B04B', width: '100%', border: '1px solid #88B04B' }}
                        >
                            Submit
                        </Button>
                    </ButtonLayout>
                    <Answer id="ans">
                        {(!Error && data[0] && Value.showGraph) ? ' root is ' + data[data.length - 1].x1 : Error}
                    </Answer >
                </InputBox>
                <ShowGraph >
                    {Value.showGraph && <Graph fx={Value.fx} title="One-Point Method"  root={data[data.length - 1].x1 } id='showGraph' />}
                </ShowGraph>
            </GraphBox>
            {(!Error && Value.showTable) && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}

        </>
    );

}

