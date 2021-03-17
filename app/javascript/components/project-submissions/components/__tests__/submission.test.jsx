import React from 'react';
import { render } from '@testing-library/react';

import ProjectSubmissionContext from '../../ProjectSubmissionContext';
import Submission from '../submission';

const constructSubmission = (userId) => ({
  user_name: 'Example User',
  repo_url: 'http://example.com/repo',
  live_preview_url: 'http://example.com/live',
  is_public: true,
  lesson_has_live_preview: true,
  user_id: userId || 1,
});

const renderSubmissionComponentWithSubmissionContext = (userId) => render(
  <ProjectSubmissionContext.Provider value={{
    userId,
  }}
  >
    <Submission
      submission={constructSubmission()}
      handleUpdate={() => {}}
      handleDelete={() => {}}
      handleLikeToggle={() => {}}
    />
    ,
  </ProjectSubmissionContext.Provider>,
);

describe('Submission: Current User', () => {
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId } = renderSubmissionComponentWithSubmissionContext(1));
  });

  test('should render edit button', () => {
    const editButton = queryByTestId('edit-button');
    expect(editButton).toBeInTheDocument();
  });

  test("shouldn't render report button", () => {
    const reportButton = queryByTestId('report-button');
    expect(reportButton).not.toBeInTheDocument();
  });
});

describe('Submission: Different User', () => {
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId } = renderSubmissionComponentWithSubmissionContext(2));
  });

  test("shouldn't render edit button", () => {
    const editButton = queryByTestId('edit-button');
    expect(editButton).not.toBeInTheDocument();
  });

  test('Should render report button', () => {
    const reportButton = queryByTestId('report-button');
    expect(reportButton).toBeInTheDocument();
  });
});
