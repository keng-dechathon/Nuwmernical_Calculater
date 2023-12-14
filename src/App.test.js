import React from "react";
import { render, screen } from "@testing-library/react";
import Header1 from "./Components/Header";
import "@testing-library/jest-dom";
import { BrowserRouter as Router} from "react-router-dom";

it('renders welcome message', () => {
    render(
        <Router>
            <Header1/>
        </Router>    
    );
    expect(screen.getByText('NUWMERNICAL METHOD CALCULATER')).toBeInTheDocument();
  });