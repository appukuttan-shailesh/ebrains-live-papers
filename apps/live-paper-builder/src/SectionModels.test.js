import { render, screen, waitFor, wait } from '@testing-library/react';
import fireEvent from '@testing-library/react';
import  SectionModels from "./CreateLivepaper/AddResources/section/SectionModels";
test('test if we can create model resources', async () => {

 
  const MockCallBack = jest.fn();
  const Subject = (<button onClick={MockCallBack}>testButton</button>);
  const userauth= [ {token:5000 , context:[]}] ;
 
 
 
 
 
  const { getByTestId } = render(
   

      <SectionModels key={{ }}  storeSectionInfo={() => {}}  data={{}}
                          numResources={{}}
                          handleDelete={() => {} }
                          handleMoveDown={() => {} }
                          handleMoveUp={() => {} }
                          enqueueSnackbar={ () => {}}
                          closeSnackbar={() => {}} />
    
  );
  
  
  await expect(   screen.getByText(/Section: Model Collection/i)).toBeInTheDocument();
  
  
  });
