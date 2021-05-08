import React from 'react';
import { render, fireEvent, logDOM } from '@testing-library/react';

import ProjectSubmissionContext from '../../ProjectSubmissionContext';
import Submission from '../submission';

const constructSubmission = (submissionInfo) => ({
  user_name: 'Example User',
  repo_url: 'http://example.com/repo',
  live_preview_url: submissionInfo.live_preview_url || '',
  is_public: true,
  lesson_has_live_preview: submissionInfo.lesson_has_live_preview || false,
  user_id: submissionInfo.userId || 1,
});

const renderSubmissionComponentWithSubmissionContext = (userId, submissionInfo = {}) => render(
  <ProjectSubmissionContext.Provider value={{
    userId,
  }}
  >
    <Submission
      submission={constructSubmission(submissionInfo)}
      handleUpdate={() => jest.fn()}
      handleDelete={() => jest.fn()}
      handleLikeToggle={() => jest.fn()}
    />
    ,
  </ProjectSubmissionContext.Provider>,
);

describe('Submission: Current User', () => {
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId } = renderSubmissionComponentWithSubmissionContext(1));
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('should render edit button', () => {
    const editButton = queryByTestId('edit-button');
    expect(editButton).toBeInTheDocument();
  });

  test('edit button should trigger edit modal', () => {
    fireEvent.mouseDown(queryByTestId('edit-button'));

    const editForm = queryByTestId('edit-form');
    expect(editForm).toBeInTheDocument();
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

  afterAll(() => {
    jest.resetModules();
  });

  test("shouldn't render edit button", () => {
    const editButton = queryByTestId('edit-button');
    expect(editButton).not.toBeInTheDocument();
  });

  test('Clicking report button should render report form', () => {
    fireEvent.click(queryByTestId('report-button'));

    expect(queryByTestId('report-form')).toBeInTheDocument();
  });

  test('Should render report button', () => {
    const reportButton = queryByTestId('report-button');
    expect(reportButton).toBeInTheDocument();
  });
});

describe('Submission: Live Preview', () => {
  let queryByText;

  afterAll(() => {
    jest.resetModules();
  });

  test('Should render live preivew', () => {
    ({ queryByText } = renderSubmissionComponentWithSubmissionContext(null, {
      live_preview_url: 'https://google.com',
    }));

    const livePreivewLink = queryByText('Live Preview');
    expect(livePreivewLink).toBeInTheDocument();
    expect(livePreivewLink).toHaveAttribute('target', '_blank');
  });

  test('Should not render live preivew', () => {
    ({ queryByText } = renderSubmissionComponentWithSubmissionContext(null, {
      userId: 2,
      // this is sent for the readability of the test even though it's unnecessary.
      live_preview_url: '',
    }));

    const livePreviewLink = queryByText('Live Preview');
    expect(livePreviewLink).not.toBeInTheDocument();
  });
});

describe('Submission: View Code', () => {
  let queryByText;

  afterAll(() => {
    jest.resetModules();
  });

  test('should render view code link', () => {
    ({ queryByText } = renderSubmissionComponentWithSubmissionContext());

    const viewCodeLink = queryByText('View Code');
    expect(viewCodeLink).toBeInTheDocument();
    expect(viewCodeLink).toHaveAttribute('target', '_blank');
  });
});
