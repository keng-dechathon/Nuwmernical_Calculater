
import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { Outputbox, MatrixBox, random_bg_color, Topic, Flexbox, MatrixInputBox, Matrix1, Matrix2, MatrixButtonBox } from '../Components/Style-Component';
import axios from 'axios';

const math = require("mathjs");

let inputA = [], inputB = [], MatrixA = [], MatrixB = [], A = [], B = [], Answer = [], random = 0;

export default function Guassjordan() {
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
        if (n >= 2 && n <= 9) {
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
            A = math.matrix(MatrixA);
            B = math.matrix(MatrixB);

        }
        catch (e) {
            setError(e.name)
        }
    }

    function guassjordan() {
        createMatrix();      
        //let final = []; 
        let i, j;
        let row = [];
        let new_matrix = math.clone(A);
        for (i = 0; i <= B._size[0]; i++) {
            row[i] = i;
            if (i < B._size[0]) {
                new_matrix.subset(math.index(i, B._size[0]), B._data[i][0]);
            }
        }
        // make triangle 1
        for (j = 0; j <= B._size[0] - 2; j++) {
            for (i = j + 1; i <= B._size[0] - 1; i++) {
                if (i !== j) {
                    let s1 = math.divide(math.subset(new_matrix, math.index(j, row)), math.subset(new_matrix, math.index(j, j)));
                    let s2 = math.multiply(s1, math.subset(new_matrix, math.index(i, j)));
                    let s4 = math.subtract(new_matrix.subset(math.index(i, row)), s2);
                    new_matrix.subset(math.index(i, row), s4._data[0]);
                }
            }
        }
        for (j = B._size[0] - 1; j > 0; j--) {
            for (i = 0; i <= B._size[0] - 2; i++) {
                if (i !== j && i < j) {
                    //console.log(i,":",j);        
                    let s1 = math.divide(math.subset(new_matrix, math.index(j, row)), math.subset(new_matrix, math.index(j, j)));
                    let s2 = math.multiply(s1, math.subset(new_matrix, math.index(i, j)));
                    let s4 = math.subtract(new_matrix.subset(math.index(i, row)), s2);
                    new_matrix.subset(math.index(i, row), s4._data[0]);

                    console.log(new_matrix);
                }
            }
        }

        for (i = 0; i < B._size[0]; i++) {
            let ii = math.divide(math.subset(new_matrix, math.index(i, row)), math.subset(new_matrix, math.index(i, i)));
            new_matrix.subset(math.index(i, row), ii._data[0]);
            //final[i]= math.ceil(math.subset(new_matrix,math.index(i,B._size[0])));
            Answer.push(<h1>{'x' + i + " = " + math.subset(new_matrix, math.index(i, B._size[0]))}</h1>)
        }

    }
    function Process() {
        try {
            MatrixA = [];
            MatrixB = [];
            Answer = [];
            A = [];
            B = [];
            Answer = []
            if (!Error) {
                setState(prev => ({ ...prev, showAns: true }));
                guassjordan();
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
        Answer = [];
        A = [];
        B = [];
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
                GUASS-JORDAN METHOD
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
        </>
    );

}

