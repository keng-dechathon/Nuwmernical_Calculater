import React, { Component } from 'react'
import { range, compile } from 'mathjs';
import Plot from 'react-plotly.js';

export default class Graph extends Component {
    render() {
        let { fx, xl, xr, title,root} = this.props;
        xl = parseFloat(xl);
        xr = parseFloat(xr);
        let max = 0, min = 0;

        // let config = {responsive: true,scrollZoom:false, useResizeHandler:true}
        return (
            // <Plot
            //     data={[
            //         {
            //             x: range(-10, 10, 0.1).toArray(),
            //             y: range(-10, 10, 0.1).toArray().map(function (x) {                           
            //                 return compile(fx).evaluate({ x:x })
            //             }),
            //             type: 'scatter',
            //             marker: { color: 'red' },
            //         },
            //     ]}
            //     layout={{ title: title ,  dragmode: 'pan',xaxis: { fixedrange: true },yaxis: { fixedrange: true }}}
            //     config={config}                

            // />
            <Plot
                data={[
                    {
                        x: range(-10, 10, 0.1).toArray(),
                        y: range(-10, 10, 0.1).toArray().map(function (x) {                            
                            if (x === -10) {
                                min = compile(fx).evaluate({ x: x });
                                max = compile(fx).evaluate({ x: x });
                            } else {
                                if (compile(fx).evaluate({ x: x }) > max) {
                                    max = compile(fx).evaluate({ x: x });
                                }
                                if (compile(fx).evaluate({ x: x }) < min) {
                                    min = compile(fx).evaluate({ x: x });
                                }
                            }
                            console.log(max, ":", min);
                            return compile(fx).evaluate({ x: x })
                        }),
                        name: fx,
                        marker: { color: 'red' },
                        mode: 'lines',
                    },
                    {
                        x: [xl, xl],
                        y: [min, max],
                        name: "x0",
                        type: 'scatter',
                        mode: 'lines',
                        line: {
                            dash: 'dot',
                            width: 2
                        }

                    },
                    {
                        x: [xr, xr],
                        y: [min, max],
                        name: "x1",
                        type: 'scatter',
                        mode: 'lines',
                        line: {
                            dash: 'dot',
                            width: 2
                        }

                    },
                    {
                        x: [root],
                        y: [0],
                        name: "ROOT",
                        type: 'scatter',
                        mode: 'makers',
                        marker: { color: 'black' },

                    },
                    // {
                    //     x: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                    //     y: range(-10, 10, 1).toArray(),                                
                    //     marker: { color: 'black' },
                    //     mode: 'lines',                 
                    // },
                ]}
                layout={{ title: title }}

            // config={config}                

            />
        )
    }
}

