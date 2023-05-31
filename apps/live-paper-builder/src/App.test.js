import { render, screen, waitFor ,  wait, fireEvent  } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from "react";
import { SnackbarProvider } from "notistack";
import { createMemoryHistory } from "history";
//import '@testing-library/jest-dom/extend-expect';
import userEvent  from "@testing-library/user-event";
import App from "./App";
import {BrowserRouter, MemoryRouter, Router} from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import CreateLivePaperLoadPDFData from './CreateLivePaperLoadPDFData';
//import { SnackbarProvider, enqueueSnackbar } from 'notistack'


//const user = userEvent.setup({delay:null});
const Button = ({onClick, children}) => (
  <button onClick={onClick}>{children}</button>
)

test('renders learn react link', async () => {
  const mockCallBack = jest.fn();
  const user = userEvent.setup();
  jest.setTimeout(30000); 
  const userauth= [ {token:[], context:[]}] ;
  const history = createMemoryHistory(); // or createBrowserHistory
  const {rerender} =render(
        
         <CreateLivePaper />
          
   
    );
  //const user = userEvent.setup();
  const linkElement = screen.getByText(/Skip/i);
  await expect (linkElement).toBeInTheDocument();
  
  //user.click(  await screen.getByRole("button", { name: /Create New/i }));
  user.click(  await screen.getByRole("button", { name: /Skip/i }));
  //user.click(  await screen.getByRole("button", { name: /ReferenceError: debug is not defined/i }));
  //await fireEvent.click(  await screen.getByText(/Open Documentation/i));
 
  //screen.debug();
  await waitFor(async () => {   
    
    expect(  await screen.getByText(/Where to find underlying data/i)).toBeInTheDocument();
  }
  , 100000
  
  );
  
  
 

 });
