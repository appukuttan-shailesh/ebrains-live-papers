import { render, screen, waitFor, wait } from '@testing-library/react';

import  SectionGeneric from "../CreateLivepaper/AddResources/section/SectionGeneric";
test('tes if we can create generic resources', async () => {

 
  const MockCallBack = jest.fn();
  const Subject = (<button onClick={MockCallBack}>testButton</button>);
  const userauth= [ {token:5000 , context:[]}] ;
 
 
 
 
 
  const { getByTestId } = render(
   

      <SectionGeneric key={{ }}  storeSectionInfo={() => {}}  data={{}}
                          numResources={{}}
                          handleDelete={() => {} }
                          handleMoveDown={() => {} }
                          handleMoveUp={() => {} }
                          enqueueSnackbar={ () => {}}
                          closeSnackbar={() => {}} />
    
  );
  
  
  await expect(   screen.getByText(/Section: Generic Listing/i)).toBeInTheDocument();
  
  
  });
