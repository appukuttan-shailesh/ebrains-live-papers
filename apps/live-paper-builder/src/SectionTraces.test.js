import { render, screen, waitFor, wait } from '@testing-library/react';
import fireEvent from '@testing-library/react';
import  SectionTraces from "../CreateLivepaper/AddResources/section/SectionTraces";
test('test if we can create trces resources', async () => {

 
  const MockCallBack = jest.fn();
  const Subject = (<button onClick={MockCallBack}>testButton</button>);
  const userauth= [ {token:5000 , context:[]}] ;
 
 
 
 
 
  const { getByTestId } = render(
   

      <SectionTraces key={{ }}  storeSectionInfo={() => {}}  data={{}}
                          numResources={{}}
                          handleDelete={() => {} }
                          handleMoveDown={() => {} }
                          handleMoveUp={() => {} }
                          enqueueSnackbar={ () => {}}
                          closeSnackbar={() => {}} />
    
  );
  
  
  await expect(   screen.getByText(/Section: Recordings/i)).toBeInTheDocument();
  
  
  });
