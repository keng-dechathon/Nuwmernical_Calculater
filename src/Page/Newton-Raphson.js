import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import Graph from '../Components/Graph';
import { GraphBox, InputBox, ButtonLayout, Answer, ShowGraph, random_bg_color, Topic, ButtonLayout0 } from '../Components/Style-Component';
import { compile } from 'mathjs';
import axios from 'axios';

const columns = [
    {
        title: "step",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
let data = [], random = 0;

export default function NewtonRaphson() {
    random_bg_color();
    const initial = {
        fx: '',
        x0: '',
        err: '0.000001',
        showGraph: false,
        showTable: false
    };
    const [Error, setError] = useState(false);
    const [{ fx, x0, err, showGraph, showTable }, setState] = useState(initial);

    function diff(x) {
        let h = 0.00001;
        return ((f(x + h) - f(x)) / h);
    }
    function f(x) {
        return compile(fx).evaluate({ x: x });
    }
    function Newton(x, eps, ct) {
        if (!Error) {
            if (eps > err || eps === null) {
                data.push({
                    key: ct,
                    iteration: ct,
                    x: x,
                    error: eps
                })
                if (ct === 0) {
                    data[0].error = 'none';
                }
                let delta_x = (-(f(x))) / diff(x);
                let x_k = x + delta_x;
                eps = Math.abs((x_k - x) / x_k);
                ct++;
                return Newton(x_k, eps, ct);
            } else {
                return;
            }
        }
    }
    function onChange(e) {
        const { name, value } = e.target;
        if (name === 'fx') setState(prev => ({ ...prev, [name]: value, showGraph: false, showTable: false }));
        else setState(prev => ({ ...prev, [name]: value, showTable: false }));
        setError(false);
        data = [];
    }
    function Process() {
        try {
            if (isNaN(parseFloat(x0))) setError('Wrong input !!!');
            else {
                data = [];
                setState(prev => ({ ...prev, showGraph: true, showTable: true }));
                Newton(parseFloat(x0), null, 0);
            }

        }
        catch (e) {

            setError(e.name)
        }

    }
    function clear() {
        setState({ ...initial });
        setError(false);
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
        await setState(prev => ({ ...prev, fx: api.fx, x0: api.x }));

    }
    return (
        <>
            <Topic>
                NEWTON-RAPHSON METHOD
            </Topic>
            <GraphBox>
                <InputBox>
                    <h3>Fill in a form</h3>
                    <Input addonBefore="fx" name="fx" placeholder='Enter Function ( f(x) )' value={fx} onChange={onChange} />
                    <Input addonBefore="X0" name="x0" placeholder='Guess 1 (x0)' value={x0} onChange={onChange} />
                    <Input addonBefore="Error" name="err" placeholder='Error (e)' value={err} onChange={onChange} />
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
                            onClick={clear}
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
                        {(!Error && data[0] && showGraph) ? ' root is ' + data[data.length - 1].x : Error}
                    </Answer >
                </InputBox>
                <ShowGraph >
                    {showGraph && <Graph fx={fx} root={data[data.length - 1].x} title="Newton-Raphson Method" id='showGraph' />}
                </ShowGraph>
            </GraphBox>
            {showTable && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}

        </>
    );

}

