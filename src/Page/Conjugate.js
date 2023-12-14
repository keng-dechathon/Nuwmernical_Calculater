
import React, { useState } from 'react'
import { Input, Button, Table } from 'antd';
import { MatrixBox, Topic, Flexbox, Matrix1, Matrix2, Matrix3, MatrixButtonBox, MatrixInputBox, Outputbox } from '../Components/Style-Component';
import { random_bg_color } from '../Components/Style-Component';
import axios from 'axios';

const math = require("mathjs");



let inputA = [], inputB = [], inputC = [], MatrixA = [], MatrixB = [], MatrixC = [], A = [],check=false, B = [], C = [], data = [], random = 0, ANS = [], forX = '', xikey = '';
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "λ",
        dataIndex: "lampda",
        key: "lampda"
    },
    // {
    //     title: "x",
    //     dataIndex: "x",
    //     key: "x"
    // },
    {
        title: "Error",
        dataIndex: "error",
        key: "error"
    }
];
export default function Conjugate() {
    random_bg_color();
    const initial = {
        size: '',
        showInput: false,
        showAns: false,
        err: 0.00001
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
        else setError('Input lenght must be 2-6');
    }

    function createMatrix() {
        try {
            MatrixA = [];
            MatrixB = [];
            MatrixC = [];
            A = [];
            B = [];
            C = [];
            columns = [
                {
                    title: "Iteration",
                    dataIndex: "iteration",
                    key: "iteration"
                },
                {
                    title: "λ",
                    dataIndex: "lampda",
                    key: "lampda"
                },
                {
                    title: "Error",
                    dataIndex: "error",
                    key: "error"
                }
            ];
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
                let xii = "x" + (i + 1);
                xii = xii.toString();
                columns.push({
                    title: xii,
                    dataIndex: xii,
                    key: xii
                })
                let b = parseFloat(document.getElementById("b" + (i + 1)).value);
                let c = parseFloat(document.getElementById("c" + (i + 1)).value);
                if (isNaN(b) || isNaN(c)) {
                    setError('wrong input!!!');
                    return;
                }
                MatrixB[i][0] = b;
                MatrixC[i][0] = c;
            }
            A = math.matrix(MatrixA);
            B = math.matrix(MatrixB);
            C = math.matrix(MatrixC);
        }
        catch (e) {
            setError(e.name)
        }
    }
    function det(m) {
        return math.det(m);
    }
    function checkPositivedef(sizeNow) {
        // console.log(A._data[0][0]);
        // console.log(det(A._data[0][0]));
        // console.log(det(A));  
        if (sizeNow <= size) {
            let tempArr = [];
            for (let i = 0; i < sizeNow; i++) {
                tempArr[i] = [];
                for (let j = 0; j < sizeNow; j++) {
                    tempArr[i][j] = A._data[i][j];
                }
            }
            console.log(tempArr);
            console.log(det(tempArr));
            if (det(tempArr) <= 0) {
                check=true;
                setError("Input must be Positive definite");                
                return;
            } else {
                ANS.push(<h1>{'det ' + sizeNow + 'x' + sizeNow + ' : ' + det(tempArr)}</h1>);
                checkPositivedef(sizeNow + 1);
            }
        }
        else {          
            return;
        }
    }

    function conjugate() {
        createMatrix();
        ANS = [];
        check=false;
        checkPositivedef(1);
        // console.log(A);console.log(B);console.log(C);    
        if(check) {
            return;
        }    
        data = [];
        let eps = 9999, Ri, Di, a0;
        let xi = math.clone(C);
        let ct = 0;
        while (eps > err) {
            if (ct === 0) {
                Ri = math.subtract(math.multiply(A, C), B);
                Di = math.multiply(-1, Ri);
                ct++;
            }
            //show det แต่ละ site && check positive matrix
            else {
                let lampda = math.multiply(math.divide(math.multiply(math.transpose(Di), Ri), math.multiply(math.multiply(math.transpose(Di), A), Di)), -1);
                xi = math.add(xi, Di.map((index) => { return index * math.squeeze(lampda) }));
                Ri = math.subtract(math.multiply(A, xi), B);
                eps = math.squeeze(math.sqrt(math.multiply(math.transpose(Ri), Ri)));
                a0 = math.divide(math.multiply(math.multiply(math.transpose(Ri), A), Di), math.multiply(math.multiply(math.transpose(Di), A), Di));
                let a3 = math.squeeze(a0);
                let a2 = Di.map((index) => (index * a3));
                Di = math.add(math.multiply(Ri, -1), a2);
                data.push({
                    key: ct,
                    iteration: ct,
                    lampda: lampda._data,
                    error: eps
                })
                // console.log(columns);
                for (let i = 0; i < size; i++) {
                    xikey = "x" + (i + 1);
                    xikey = xikey.toString();
                    forX = (math.squeeze(xi).toArray())
                    data[ct - 1][xikey] = forX[i];
                }
                ct++;
            }
        }
    }
    function Process() {
        try {
            setState(prev => ({ ...prev, showAns: true }));
            conjugate();
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
        columns = [
            {
                title: "Iteration",
                dataIndex: "iteration",
                key: "iteration"
            },
            {
                title: "λ",
                dataIndex: "lampda",
                key: "lampda"
            },
            {
                title: "Error",
                dataIndex: "error",
                key: "error"
            }
        ];
        setState({ ...initial });
        setError(false);
        check=false;
        data = [];
        inputA = [];
        inputB = [];
        inputC = [];
        MatrixA = [];
        MatrixB = [];
        MatrixC = [];
        A = [];
        B = [];
        C = [];
        ANS = [];
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
                CONJUGATE-GRADIENT METHOD
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
                            <h3 >Matrix x0</h3>
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
                    {(!Error && showAns) ? <h2>SOLUTION</h2> : Error}
                    {(!Error && showAns) && ANS}
                </Outputbox>

            </MatrixBox>
            {(showAns && !Error) && <Table columns={columns} dataSource={data} style={{ marginTop: '20px', border: '1px solid black' }} />}


        </>
    );

}

