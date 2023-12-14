import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./App.css";


import Header1 from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Home from "./Page/Home";

import Bisection from "./Page/Bisection";
import FalsePosition from "./Page/False-position"
import OnePoint from "./Page/One-point"
import NewtonRaphson from "./Page/Newton-Raphson"
import Secant from "./Page/Secant"
import Cramer from "./Page/Cramer-rule"
import Conjugate from "./Page/Conjugate"
import Guassjordan from "./Page/GuassJordan"
import GuassEliminate from "./Page/Guass-eliminate"
import GuassSeidel from "./Page/Guass-seidel"
import Jacobi from "./Page/Jacobi"
import LU from "./Page/LU"
import Lagrange from "./Page/Lagrange"
import Linear from "./Page/Linear-Regression"
import Polynomial from './Page/Polynomial-Regression'
import Multiple from './Page/Multiple-Regression'
import NewtonDivide from './Page/Newton-Divide'
import Splines from './Page/Spline'


const { Content } = Layout;

export default function App() {
  return (

    <Router>   
      <Layout>
        <Header1 />
        <Sidebar />
        <Layout style={{ padding: '10px 24px 15px 24px' }}>
          <Content
            style={{ margin: '16px 0 10px 250px' }}
            className="site-layout-background content"
          >
            <Switch>              
              <Route exact path="/" component={Home} />
              <Route path="/Root-of-equation/Bisection-Method" component={Bisection} />
              <Route path="/Root-of-equation/False-position-Method" component={FalsePosition} />
              <Route path="/Root-of-equation/One-Point-Method" component={OnePoint} />
              <Route path="/Linear Equation/Newton-Raphson-Method" component={NewtonRaphson} />
              <Route path="/Root-of-equation/Secant-Method" component={Secant} />
              <Route path="/Linear Equation/Cramer-Rule-Method" component={Cramer} />
              <Route path="/Linear Equation/Conjugate-Gradient-Method" component={Conjugate} />
              <Route path="/Linear Equation/Gauss-Jordan-Method" component={Guassjordan} />
              <Route path="/Linear Equation/Gauss-Eliminatio-Method" component={GuassEliminate} />
              <Route path="/Linear Equation/Gauss-Seidel-Method" component={GuassSeidel} />
              <Route path="/Linear Equation/Jacobi-Method" component={Jacobi} />
              <Route path="/Linear Equation/LU-Decomposition-Method" component={LU} />
              <Route path="/Interpolation/Lagrange" component={Lagrange} />
              <Route path="/Least Squares Regression/Linear Regression" component={Linear} />
              <Route path="/Least Squares Regression/Polynomial Regressionn" component={Polynomial} />
              <Route path="/Least Squares Regression/Multiple Linear Regression" component={Multiple} />
              <Route path="/Interpolation/Newton-Divide Difference Method" component={NewtonDivide} />
              <Route path="/Interpolation/Spline Method" component={Splines} />
            </Switch>            
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
