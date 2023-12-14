
import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import { MatrixBox, random_bg_color, Topic,Outputbox,Flexbox,MatrixInputBox,Matrix1,Matrix2,Matrix3,MatrixButtonBox } from '../Components/Style-Component';
import axios from 'axios';

const math = require("mathjs");

let inputA = [], inputB = [], inputC = [], MatrixA = [], MatrixB = [], MatrixC = [], A = [], data = [], random = 0;
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },

    {
        title: "[x]",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error"
    }

];
export default function GuassSeidel() {
    random_bg_color();
    const initial = {
        size: '',
        showInput: false,
        showAns: false,
        err: 0.000001
    };
    const [Error, setError] = useState(false);
    const [{ size, showInput, showAns, err }, setState] = useState(initial);

    function inputForm(n = '2') {
        inputA = [];
        inputB = [];
        inputC = [];
        setError(false);
        if (n >= 2 && n <= 6) {
            for (let i = 1; i <= n; i++) {
                for (let j = 1; j <= n; j++) {
                    inputA.push(<Input style={{ width: '70px', margin: '0 5px 5px 0' }} id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} onChange={() => setState(prev => ({ ...prev }))} />);
                }
                inputB.push(<Input style={{ width: '70px', margin: '0 5px 5px 0' }} id={"b" + i} key={"b" + i} placeholder={"b" + i} onChange={() => setState(prev => ({ ...prev }))} />);
                inputC.push(<Input style={{ width: '70px', margin: '0 5px 5px 0' }} id={"c" + i} key={"c" + i} placeholder={"x" + i} onChange={() => setState(prev => ({ ...prev }))} />);
                inputA.push(<br />);
                inputB.push(<br />);
                inputC.push(<br />);
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
                MatrixC[i] = [];
                for (let j = 0; j < size; j++) {
                    let a = parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value);
                    if (isNaN(a)) {
                        setError('wrong input!!!');
                        return;
                    }
                    MatrixA[i][j] = a;
                }
                let b = parseFloat(document.getElementById("b" + (i + 1)).value);
                let c = parseFloat(document.getElementById("c" + (i + 1)).value);
                if (isNaN(b) || isNaN(c)) {
                    setError('wrong input!!!');
                    return;
                }
                MatrixB[i] = b;
                MatrixC[i] = c;
            }
            A = math.matrix(MatrixA);
        }
        catch (e) {
            setError(e.name)
        }
    }

    function Guass() {
        createMatrix();
        let check = [], r = 0, row = [], ee = [], a = [], b = [];
        const allEqual = arr => arr.every(val => val === arr[0]);
        for (let i = 0; i < MatrixB.length; i++) {
            row[i] = i;
        }
        //console.log(row);
        while (true) {
            let i = 0, eps = 9999999999;
            while (i < MatrixB.length) {
                let xnew = 0;
                let mii = A.subset(math.index(i, i));
                let mul = math.multiply((A.subset(math.index(i, row))), MatrixC);
                mul = math.squeeze(mul);
                xnew = (MatrixB[i] + (mii * MatrixC[i]) - mul) / mii;
                eps = Math.abs((xnew - MatrixC[i]) / xnew);
                if (eps <= err) check[i] = 1;
                MatrixC[i] = xnew.toFixed(7);
                ee[i] = eps;
                i++;
            }
            a = '[';
            for(let j=0;j<MatrixC.length;j++){
                a += MatrixC[j] + ", "
            }           
            a += "]";
            b = '[';
            for(let j=0;j<ee.length;j++){
                b += ee[j] + ", "
            }            
            b += "]"
            data.push({
                key: r,
                iteration: r,
                x: a,
                error: b
            })
            console.log("round : " + r + " -> " + MatrixC);

            if (check.length === MatrixB.length && check[0] === 1 && allEqual(check)) break;
            r++
        }
    }
    function Process() {
        try {
            MatrixA = [];
            MatrixB = [];
            MatrixC = [];
            A = [];
            data = [];
            if (!Error) {
                setError(false);
                setState(prev => ({ ...prev, showAns: true }));
                Guass();
            }

        } catch (e) {
            setError("wrong input!!!");
        }
    }
    function onChange(e) {
        data = [];
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value, showInput: true, showAns: false }));
    }
    function Clear() {
        setState({ ...initial });
        setError(false);
        data = [];
        inputA = [];
        inputB = [];
        inputC = [];
        MatrixA = [];
        MatrixB = [];
        MatrixC = [];
        A = [];
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
        setError(false);
        setState(prev => ({ ...prev, showAns: false }));
        try {
            await axios({
                method: "get",
                url: `http://localhost:3000/api/data/Linear${random}`,
            }).then((reply) => {
                api = reply.data;
                console.log("reply: ", api);
            });
            await setState(prev => ({ ...prev, size: api.size }));
            await inputForm(api.size);
            for (let i = 0; i < api.size; i++) {
                for (let j = 0; j < api.size; j++) {
                    document.getElementById("a" + (i + 1) + "" + (j + 1)).value = api.arrayA[i][j]
                }
                document.getElementById("b" + (i + 1)).value = api.arrayB[i];
                document.getElementById("c" + (i + 1)).value = api.arrayC[i];
            }
        } catch (e) {
            setError(e.name)
        }

    }
    return (
        <>
        <Topic>
            GUASS-SEIDEL METHOD
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
                            <h3 >Matrix A</h3>
                            {showInput ? inputA : Error}
                        </Matrix1>
                        <Matrix2>
                            <h3 >Matrix B</h3>
                            {showInput && inputB}
                        </Matrix2>
                        <Matrix3>
                            <h3>Matrix x0</h3>
                            {showInput && inputC}
                        </Matrix3>
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
                    {(!Error && showAns) ? <h2>SOLUTION</h2>: Error}
                </Outputbox>
            </MatrixBox>
            {(showAns&&!Error) && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}
        </>
    );

}

