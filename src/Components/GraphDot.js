import React, { Component } from 'react'
import Plot from 'react-plotly.js';

export default class GraphDot extends Component {
    render() {
        let { title ,xArr,yArr} = this.props;
        let config = {responsive: true,scrollZoom:false, useResizeHandler:true}
        return (            
            <Plot
                data={[
                    {
                        x: xArr,
                        y: yArr,
                        type: 'scatter',
                        marker: { color: 'red' },
                    },
                ]}
                layout={{ title: title ,  dragmode: 'pan',xaxis: { fixedrange: true },yaxis: { fixedrange: true }}}
                config={config}                
               
            />
        )
    }
}

