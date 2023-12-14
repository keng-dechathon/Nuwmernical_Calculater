import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import Graph from '../Components/Graph';
import { GraphBox, InputBox, ButtonLayout, Answer, ShowGraph, random_bg_color,ButtonLayout0,Topic } from '../Components/Style-Component';
import { compile } from 'mathjs';
import axios from 'axios';

const columns = [
    {
        title: "step",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "x0",
        dataIndex: "x0",
        key: "x0"
    },
    {
        title: "x1",
        dataIndex: "x1",
        key: "x1"
    },
    {
        title: "x2",
        dataIndex: "x2",
        key: "x2"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
let data = [],random=0;

export default function Secant() {
    random_bg_color();
    const initial = {
        fx: '',
        x0: '',
        x1: '',
        err: '0.000001',
        showGraph: false,
        showTable: false
    };
    const [Error, setError] = useState(false);
    const [{ fx, x0, x1, err, showGraph, showTable }, setState] = useState(initial);


    function f(x) {
        return compile(fx).evaluate({ x: x });
    }

    function secant(g0, g1, eps, ct) {
        if (eps > err || eps == null) {

            let x2 = g0 - (f(g0) * (g1 - g0) / (f(g1) - f(g0)));
            eps = Math.abs((x2 - g1) / x2);
            data.push({
                key: ct,
                iteration: ct,
                x0: g0,
                x1: g1,
                x2: x2,
                error: eps
            })
            console.log("iteration ", ct + 1, " : ,x0 = ", g1.toFixed(6), " ,x1 = ", x2.toFixed(6), " ,ERR = ", eps.toFixed(10));
            ct++;
            return (secant(g1, x2, eps, ct));
        } else {
            return;
        }
    }
    function onChange(e) {
        const { name, value } = e.target;
        if (name === 'fx') {
            setState(prev => ({ ...prev, [name]: value, showGraph: false, showTable: false }));
        }
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
                secant(parseFloat(x0), parseFloat(x1), null, 0);
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
            let n = Math.floor(Math.random() * 4);
            if (n !== random) {
                random = n;
                break;
            }
        }
        await axios({
            method: "get",
            url: `http://localhost:3000/api/data/root${random}`,
        }).then((reply) => {
            api = reply.data;
            console.log("reply: ", api);
        });
        await  setState(prev => ({ 
            ...prev,
            fx: api.fx,
            x0:api.xl,
            x1:api.xr 
        }));
      
    }
    return (
        <>

            <Topic>
                SECANT METHOD
            </Topic>
            <GraphBox>
                <InputBox>
                    <h3>Fill in a form</h3>
                    <Input addonBefore="fx" name="fx" placeholder='Enter Function ( f(x) )' value={fx} onChange={onChange} />
                    <Input addonBefore="X0" name="x0" placeholder='Guess 1 (x0)' value={x0} onChange={onChange} />
                    <Input addonBefore="X1" name="x1" placeholder='Guess 2 (x1)' value={x1} onChange={onChange} />
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
                        {(!Error && data[0] && showGraph) ? ' root is ' + data[data.length - 1].x2 : Error}
                    </Answer >
                </InputBox>
                <ShowGraph >
                    {showGraph && <Graph fx={fx} xl={x0} xr={x1} root={data[data.length - 1].x2 } title="Secant Method" id='showGraph' />}
                </ShowGraph>
            </GraphBox>
            {showTable && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}

        </>
    );

}

