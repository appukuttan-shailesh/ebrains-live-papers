import React from 'react';
import { render, screen } from '@testing-library/react';

import LoadKGProjects from "./CreateLivepaper/CreateNewLivePaper/LoadKGProjects";
// Mock any props that are required for the component
const defaultProps = {
  kg_project_list: [],
  open: false,
  onClose: jest.fn(),
};

test('test if we can load projects', () => {
  render(<LoadKGProjects {...defaultProps} />);
  
  
  expect(screen.getByText('To have edit permissions on a live paper')).toBeInTheDocument();
});

// You can write more test cases for different component behaviors
