import React from 'react';
import { AreaChartOutlined,DotChartOutlined ,FundOutlined,TableOutlined} from '@ant-design/icons';
export const SidebarData = [
  {
    title: 'Root of Equation',
    icon: <AreaChartOutlined />,   
    subNav: [
      {
        title: 'Bisection Method',
        path: '/Root-of-equation/Bisection-Method',        
      },
      {
        title: 'False-Position Method',
        path: '/Root-of-equation/False-position-Method', 
      },
      {
        title: 'One-Point Method',
        path: '/Root-of-equation/One-Point-Method', 
      },
      {
        title: 'Secant Method',
        path: '/Root-of-equation/Secant-Method', 
      },
      {
        title: 'Newton-Raphson Method',
        path: '/Linear Equation/Newton-Raphson-Method',        
      },   
    ]
  },
  {
    title: 'Linear Equation',
    icon: <TableOutlined />,
    
    subNav: [
      {
        title: 'Conjugate-Gradient Method',
        path: '/Linear Equation/Conjugate-Gradient-Method',        
      },
      {
        title: 'Cramer-Rule Method',
        path: '/Linear Equation/Cramer-Rule-Method',        
      },
      {
        title: 'Gauss-Jordan Method',
        path: '/Linear Equation/Gauss-Jordan-Method',        
      },
      {
        title: 'Gauss-Seidel Method',
        path: '/Linear Equation/Gauss-Seidel-Method',        
      },
      {
        title: 'Gauss-Elimination Method',
        path: '/Linear Equation/Gauss-Eliminatio-Method',        
      },
      {
        title: 'Jacobi Method',
        path: '/Linear Equation/Jacobi-Method',        
      },
      {
        title: 'LU-Decomposition Method',
        path: '/Linear Equation/LU-Decomposition-Method',        
      },
     
    ]
  },
  {
    title: 'Interpolation',
    
    icon: <FundOutlined />,  
    
    subNav: [
      {
        title: 'Newton-Divide Difference Method',
        path: '/Interpolation/Newton-Divide Difference Method',        
      },
      {
        title: 'Lagrange Method',
        path: '/Interpolation/Lagrange',        
      },
      {
        title: 'Spline Method',
        path: '/Interpolation/Spline Method',        
      },
    ]
  },
  {
    title: 'Least Squares Regression',
    
    icon: <DotChartOutlined />,  
    
    subNav: [
      {
        title: 'Linear Regression',
        path: '/Least Squares Regression/Linear Regression',        
      },
      {
        title: 'Polynomial Regression',
        path: '/Least Squares Regression/Polynomial Regressionn',        
      },
      {
        title: 'Multiple Linear Regression',
        path: '/Least Squares Regression/Multiple Linear Regression',        
      },
    ]
  },
  
];
