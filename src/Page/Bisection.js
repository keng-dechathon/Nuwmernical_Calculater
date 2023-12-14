import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import Graph from '../Components/Graph';
import { GraphBox, InputBox, ButtonLayout, Answer, ShowGraph, random_bg_color, Topic, ButtonLayout0 } from '../Components/Style-Component';
import { compile } from 'mathjs';
import axios from 'axios';

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

export default function Bisection() {
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

    function bisection(xl, xr, xm, err, ct) { //calculate
        var xm_now = (xl + xr) / 2;
        var f_xr = compile(Value.fx).evaluate({ x: xr });
        var f_xm = compile(Value.fx).evaluate({ x: xm_now });
        if ((f_xm * f_xr) < 0) xl = xm_now;
        else if ((f_xm * f_xr) > 0) xr = xm_now;
        else {
            if (xm !== 0) {
                data.push({
                    key: ct,
                    iteration: ct,
                    xl: xl,
                    xr: xr,
                    x: xm,
                    error: "none",
                })
            }
            return;
        }
        if (ct === 0) {
            data.push({
                key: ct,
                iteration: ct,
                xl: xl,
                xr: xr,
                x: xm,
                error: 'none',
            })
            ct++;
            return bisection(xl, xr, xm_now, err, ct);
        } else {
            err = Math.abs((xm_now - xm) / xm_now);
            if (xm !== 0) {
                data.push({
                    key: ct,
                    iteration: ct,
                    xl: xl,
                    xr: xr,
                    x: xm,
                    error: err,
                })
            }
            if (err >= Value.err) {
                ct++;
                return bisection(xl, xr, xm_now, err, ct);
            } else return;
        }

    }
    function handleChange(key, evt) {
        if (key === "fx") setValue({ ...Value, [key]: evt.target.value, showGraph: false });
        else setValue({ ...Value, [key]: evt.target.value, showTable: false });
        setError(false)
        data = [];
    }
    function Process() {
        try {
            setError(false);
            if (isNaN(parseFloat(Value.xl)) || isNaN(parseFloat(Value.xr))) setError('Wrong input !!!');//check input valid form
            else {
                data = [];
                setValue({ ...Value, showGraph: true, showTable: true });
                bisection(parseFloat(Value.xl), parseFloat(Value.xr), 0, 9999, 0);
            }
        }
        catch (e) {
            setError(e.name);
        }
    }
    function clearInput() {
        setValue({
            fx: '',
            xl: '',
            xr: '',
            err: '0.000001',
            showGraph: false,
            showTable: false
        });
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
                BISECTION METHOD
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
                        {(!Error && data[0] && Value.showGraph) ? ' root is ' + data[data.length - 1].x : Error}
                    </Answer >
                </InputBox>
                <ShowGraph>
                    {(!Error && data[0] && Value.showGraph) && <Graph fx={Value.fx} xl={Value.xl} xr={Value.xr} root={data[data.length - 1].x } title="Bisection Method" id='showGraph' />}
                </ShowGraph>
            </GraphBox>           
            {Value.showTable && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}
        </>
    );

}

