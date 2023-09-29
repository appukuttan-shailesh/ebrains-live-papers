import { render, screen, waitFor, wait } from '@testing-library/react';
import fireEvent from '@testing-library/react';
import  SectionCustom from "../CreateLivepaper/AddResources/section/SectionCustom";
test('renders the component with props', async () => {

 
  const MockCallBack = jest.fn();
  const Subject = (<button onClick={MockCallBack}>testButton</button>);
  const userauth= [ {token:5000 , context:[]}] ;
 
 
 
 
 
  const { getByTestId } = render(
   

      <SectionCustom key={{ }}  storeSectionInfo={() => {}}  data={{}}
                          numResources={{}}
                          handleDelete={() => {} }
                          handleMoveDown={() => {} }
                          handleMoveUp={() => {} }
                          enqueueSnackbar={ () => {}}
                          closeSnackbar={() => {}} />
    
  );
  
  
  await expect(   screen.getByText(/Section: Custom HTML/i)).toBeInTheDocument();
  
  
  });
