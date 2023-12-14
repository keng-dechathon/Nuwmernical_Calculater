
import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import { MatrixBox, random_bg_color, Topic, Flexbox, Matrix1, Matrix2, MatrixButtonBox, MatrixInputBox, Outputbox } from '../Components/Style-Component';
import axios from 'axios';

const math = require("mathjs");

let inputA = [], inputB = [], MatrixA = [], MatrixB = [], m = [], ans = [], Answer = [], random = 0;
let columns = [
    {
        title: "L",
        dataIndex: "l",
        key: "l"
    },
    {
        title: "U",
        dataIndex: "u",
        key: "u"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    }

];
let data = [];
export default function LU() {
    random_bg_color();
    const initial = {
        size: '',
        showInput: false,
        showAns: false
    };
    const [Error, setError] = useState(false);
    const [{ size, showInput, showAns }, setState] = useState(initial);

    function inputForm(n = '2') {
        inputA = [];
        inputB = [];
        setError(false);
        if (n >= 2 && n <= 6) {
            for (let i = 1; i <= n; i++) {
                for (let j = 1; j <= n; j++) {
                    inputA.push(<Input style={{ width: '70px', margin: '0 5px 5px 0' }} id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} onChange={() => setState(prev => ({ ...prev }))} />);
                }
                inputB.push(<Input style={{ width: '70px', margin: '0 5px 5px 0' }} id={"b" + i} key={"b" + i} placeholder={"b" + i} onChange={() => setState(prev => ({ ...prev }))} />);
                inputA.push(<br />);
                inputB.push(<br />);
            }
            setState(prev => ({ ...prev, showInput: true }));
        }
        else setError('Input lenght must be 2-9')

    }
    function createMatrix() {
        try {
            setError(false);
            for (let i = 0; i < size; i++) {
                MatrixA[i] = [];
                MatrixB[i] = [];
                for (let j = 0; j < size; j++) {
                    let a = parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value);
                    if (isNaN(a)) {
                        setError('wrong input!!!');
                        return;
                    }
                    MatrixA[i][j] = a;
                }
                let b = parseFloat(document.getElementById("b" + (i + 1)).value);
                if (isNaN(b)) {
                    setError('wrong input!!!');
                    return;
                }
                MatrixB[i][0] = b;
            }
            m = math.matrix(MatrixA);
            ans = math.matrix(MatrixB);

        }
        catch (e) {
            setError(e.name)
        }
    }

    function lu() {
        createMatrix();
        let n = math.size(m)._data[0];
        let l = math.zeros(n, n);
        let u = math.identity(n);
        let i, j, k, row = [];
        for (i = 0; i < n; i++) {  //makeLU
            for (k = i; k < n; k++) {
                let sum = 0;
                let sum2 = 0;
                for (j = 0; j < i; j++) {
                    sum += (l._data[i][j] * u._data[j][k]);
                    sum2 += (l._data[k][j] * u._data[j][i]);
                }
                l.subset(math.index(k, i), parseFloat((m._data[k][i] - sum).toFixed(6)));
                u.subset(math.index(i, k), parseFloat(((m._data[i][k] - sum2) / l._data[i][i]).toFixed(6)));
            }
            row.push(i);
        }

        //console.log(l);
        //console.log(u);
        //LY=B
        let y = math.zeros(n);
        y.subset(math.index(0), ans._data[0] / l._data[0][0]);
        for (i = 1; i < n; i++) {
            let temp = math.clone(math.multiply(l.subset(math.index(i, row)), y));
            y.subset(math.index(i), (ans._data[i] - temp._data[0]) / l._data[i][i])
        }
        //console.log(y);
        //UX=Y
        let x = math.zeros(n);
        x.subset(math.index(n - 1), (y._data[n - 1] / u._data[n - 1][n - 1]));
        for (i = n - 2; i >= 0; i--) {
            let temp = math.clone(math.multiply(u.subset(math.index(i, row)), x));
            x.subset(math.index(i), ((y._data[i] - temp._data[0]) / u._data[i][i]));
        }
        data.push({
            key: i,
            l: l.format(),
            u: u.format(),
            x: x.format()
        })
        for (i = 0; i < n; i++) {
            Answer.push(<h1>{"x" + i + " = " + x._data[i]}</h1>);
        }
        //console.log(x.format());
    }
    function Process() {
        try {
            MatrixA = [];
            MatrixB = [];
            m = [];
            ans = [];
            Answer = [];
            data = [];
            if (!Error) {
                setState(prev => ({ ...prev, showAns: true }));
                lu();
            }
        } catch (e) {
            setError('wrong input!!!');
        }

    }
    function onChange(e) {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value, showInput: true, showAns: false }));
    }
    function Clear() {
        setState({ ...initial });
        setError(false);
        inputA = [];
        inputB = [];
        MatrixA = [];
        MatrixB = [];
        m = [];
        ans = [];
        Answer = [];
        data = [];
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

        try {
            await axios({
                method: "get",
                url: `http://localhost:3000/api/data/Linears${random}`,
            }).then((reply) => {
                api = reply.data;
                console.log("reply: ", api.size);
            });
            setState(prev => ({ ...prev, size: api.size }));
            await inputForm(api.size);
            for (let i = 0; i < api.size; i++) {
                for (let j = 0; j < api.size; j++) {
                    document.getElementById("a" + (i + 1) + "" + (j + 1)).value = api.arrayA[i][j]
                }
                document.getElementById("b" + (i + 1)).value = api.arrayB[i];
            }
        } catch (e) {
            setError(e.name)
        }

    }
    return (
        <>
            <Topic>
                LU METHOD
            </Topic>
            <MatrixBox>
                <MatrixInputBox>
                    <h3>input number for create Square matrix(n)</h3>
                    <Input addonBefore="Size" name="size" placeholder='Enter Number' value={size} onChange={(e) => { inputForm(e.target.value); onChange(e); }}
                        style={{ width: '50%' }}
                    />
                    {!showInput && inputForm()}
                    {!showInput && setState(prev => ({ ...prev, size: '2' }))}
                    <Flexbox>
                        <Matrix1>
                            <h3>Matrix A</h3>
                            {showInput ? inputA : Error}
                        </Matrix1>
                        <Matrix2>
                            <h3 >Matrix B</h3>
                            {showInput && inputB}
                        </Matrix2>
                    </Flexbox>
                    <MatrixButtonBox>
                        <Button
                            id='submit'
                            onClick={Process}
                            type="primary"
                            size="default"
                            style={{ width: '40%', marginRight: '15px', background: '#88B04B', border: '1px solid #88B04B' }}
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
                    </MatrixButtonBox>
                </MatrixInputBox>
                <Outputbox>
                    {(!Error && showAns) ? <h2>SOLUTION</h2> : Error}
                    {(!Error && showAns) && Answer}
                </Outputbox>
            </MatrixBox>
            {(!Error &&showAns) && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} pagination={{ position: ['none', 'none'] }} />}

        </>
    );

}

