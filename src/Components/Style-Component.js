import styled from 'styled-components';


export const InputBox = styled.div`
width: 25%;
border: 1px solid black;
padding: 20px;
margin-right: 0;
height: 100%;
`;
export const ButtonLayout = styled.div`
display: flex;
flex-direction:row;
flex-wrap:wrap;
justify-content:center;
width: 100%;
margin-top:15px;
`;
export const ButtonLayout0 = styled.div`
display: flex;
flex-direction:row;
flex-wrap:wrap;
justify-content:center;
width: 100%;
margin-top:30px;
`;
export const ShowGraph = styled.div`
margin-left: 20px;
border: 1px solid black;
width: 75%;
padding: 10px;
justify-content: center;
`
export const GraphBox = styled.div`
display: flex;
height: 470px;
`
export const Answer = styled.div`
width:100%;
height:100%
justify-content: center;
text-align:center;
padding:13%;
`

export const MatrixBox = styled.div`
width:100%;
height:50%;
display:flex;
border: 1px solid black;
padding: 20px;
justify-content: center;   
`
export const Topic = styled.div`
width:100%;
padding: 5px;
font-size: 30px;
margin:0 0 20px 0;
text-transform: uppercase;
font-weight: 600;
`
export const Scrollable = styled.div`
max-height:400px !important;
overflow-y: auto;
margin-top:20px;
background: rgb(131,58,180);
background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
`
export const Gradient = styled.div`
max-height:400px !important;
overflow-y: hidden;
margin-top:20px;
background: rgb(131,58,180);
background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
`

export const Gradients = styled.div`
margin-top:20px;


`
export const Outputbox = styled.div`
background-color: lightgray;
width: 30%;
margin-top: 89px;
padding:30px;

`

export const ScrollforTable = styled.div`
max-height:400px !important;
width:0;
overflow-y: auto;

`

export const PreBox = styled.div`
width:'100%';
border:'1px solid black';
display: block;
align-items: center;
background: rgb(131,58,180);
background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
`

export const Sol = styled.div`
width:'100%';
border:'1px solid black';
display: block;
align-items: center;
background: rgb(131,58,180);
background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);
`
export const Flexbox = styled.div`
    display: flex;
    margin-top: 20px;
`
export const Matrix1 = styled.div`
    // width: 15%;
    // margin-left: 25px;
`
export const Matrix2 = styled.div`
    width: 12.5%;
    margin-left: 25px;
`
export const Matrix3 = styled.div`
    width: 15%;  
`
export const MatrixButtonBox = styled.div`
    margin-top: 20px;
`

export const MatrixInputBox = styled.div`
    width: 70%;
`



function randomRGB() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var a = Math.floor(Math.random() * 10) / 10.123;
    var bgColor = "rgb(" + x + "," + y + "," + z + "," + a + ")";
    //console.log(bgColor); 
    return bgColor;
}
export function random_bg_color() {

    var bgColor = "linear-gradient(90deg, " + randomRGB() + " 0%," + randomRGB() + "35%," + randomRGB() + " 100%)"

    var blocks = document.getElementsByClassName("ant-layout");
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].style.background = bgColor;
    }

}

