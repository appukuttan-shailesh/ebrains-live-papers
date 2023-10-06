import { render, fireEvent,cleanup, getByTestId,  act} from '@testing-library/react';
import {  screen  } from '@testing-library/react';
import CreateLivePaper from "./CreateLivepaper/CreateNewLivePaper/CreateLivePaper";
import '@testing-library/jest-dom';
import React from "react";
import { SnackbarProvider } from "notistack";




  
test("renders the component with props", async () => {
   
    const rdata={}
    const {rerender} = render(
        <SnackbarProvider maxSnack={10}> <CreateLivePaper open={true}  data={rdata} /></SnackbarProvider>  
   )
   
    const hardwareList = screen.getByText('Approved By')
    expect(hardwareList).toBeInTheDocument();

   
  
    
});
