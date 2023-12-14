import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import Graph from '../Components/Graph';
import { GraphBox, InputBox, ButtonLayout, Answer, ShowGraph, random_bg_color, Topic,ButtonLayout0 } from '../Components/Style-Component';
import { compile } from 'mathjs';
import axios from 'axios'

const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "XL",
        dataIndex: "xl",
        key: "xl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "xr"
    },
    {
        title: "X1",
        dataIndex: "x1",
        key: "x1"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
let data = [],random=0;

export default function FalsePosition() {
    random_bg_color();
    const [Error, setError] = useState(false);
    const [Value, setValue] = useState({
        fx: '',
        xl: '',
        xr: '',
        err: '0.000001',
        showGraph: false,
        showTable: false
    });

    function False_position(xl, xr, err, xi, ct) {
        if (xi != null && ct >= 1) {
            data.push({
                key: ct,
                iteration: ct - 1,
                xl: xl,
                xr: xr,
                x1: xi,
                error: err.toFixed(16),
            })
            if (ct === 1) {
                data[0].error = 'none';
            }
        }
        if (err > Value.err) {
            ct += 1;
            let f_xl = compile(Value.fx).evaluate({ x: xl });
            let f_xr = compile(Value.fx).evaluate({ x: xr });
            let x1_now = ((xl * (f_xr)) - (xr * (f_xl))) / (f_xr - f_xl);
            let f_x1 = compile(Value.fx).evaluate({ x: x1_now });
            err = Math.abs((x1_now - xi) / x1_now);
            if (f_x1 * f_xr < 0) return False_position(x1_now, xr, err, x1_now, ct);
            else if (f_x1 * f_xr > 0) return False_position(xl, x1_now, err, x1_now, ct);
            else return;

        } else return;

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
            if (isNaN(parseFloat(Value.xl)) || isNaN(parseFloat(Value.xr))) setError('Wrong input !!!');
            else {
                data = [];
                setValue({ ...Value, showGraph: true, showTable: true });
                False_position(parseFloat(Value.xl), parseFloat(Value.xr), 9999, null, 0);
            }

        }
        catch (e) {
            setError(e.name)
        }
    }
    function clearInput() {
        setValue({
            fx: '',
            xl: '',
            xr: '',
            xi: '',
            err: '0.000001',
            showGraph: false,
            showTable: false
        });
        setError(false)
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
        await setValue({
            ...Value,
            fx: api.fx,
            xl: api.xl,
            xr: api.xr,
        });     
    }
    return (
        <>
            <Topic>
                FALSE POSITION METHOD
            </Topic>
            <GraphBox>
                <InputBox>
                <h3>Fill in a form</h3>
                    <Input addonBefore="fx" name="fx" placeholder='Enter Function ( f(x) )' value={Value.fx} onChange={(e) => handleChange('fx', e)} />
                    <Input addonBefore="Xl" name="xl" placeholder='Guess 1 (xl)' value={Value.xl} onChange={(e) => handleChange('xl', e)} />
                    <Input addonBefore="Xr" name="xr" placeholder='Guess 1 (xr)' value={Value.xr} onChange={(e) => handleChange('xr', e)} />
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
                    {Value.showGraph && <Graph fx={Value.fx} xl={Value.xl} xr={Value.xr} root={data[data.length - 1].x1 } title="False-Position Method" id='showGraph' />}
                </ShowGraph>
            </GraphBox>

            {Value.showTable && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}


        </>
    );

}

