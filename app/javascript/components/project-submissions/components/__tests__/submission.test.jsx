import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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

const renderSubmissionComponent = (userId, submissionInfo = {}, customFns = {}) => render(
  <ProjectSubmissionContext.Provider value={{
    userId,
  }}
  >
    <Submission
      submission={constructSubmission(submissionInfo)}
      handleUpdate={customFns.handleUpdate || jest.fn()}
      onFlag={customFns.onFlag || jest.fn()}
      handleDelete={customFns.handleDelete || jest.fn()}
      handleLikeToggle={customFns.handleLikeToggle || jest.fn()}
    />
    ,
  </ProjectSubmissionContext.Provider>,
);

describe('Submission: Current User', () => {
  let queryByTestId;
  let queryByText;

  beforeEach(() => {
    ({ queryByTestId, queryByText } = renderSubmissionComponent(1));
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('should render edit button', () => {
    const editButton = queryByTestId('edit-submission-btn');
    expect(editButton).toBeInTheDocument();
  });

  test('edit button should trigger edit modal', () => {
    fireEvent.mouseDown(queryByTestId('edit-submission-btn'));

    const editForm = queryByText('Edit Your Project');
    expect(editForm).toBeInTheDocument();
  });

  test("shouldn't render report button", () => {
    const reportButton = queryByTestId('flag-btn');
    expect(reportButton).not.toBeInTheDocument();
  });
});

describe('Submission: Different User', () => {
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId } = renderSubmissionComponent(2));
  });

  afterAll(() => {
    jest.resetModules();
  });

  test("shouldn't render edit button", () => {
    const editButton = queryByTestId('edit-submission-btn');
    expect(editButton).not.toBeInTheDocument();
  });

  test('Should render report button', () => {
    const reportButton = queryByTestId('flag-btn');
    expect(reportButton).toBeInTheDocument();
  });
});

describe('Submission: Report Different User Submission', () => {
  test('Should fire onFlag handler', () => {
    const onFlag = jest.fn();
    const testingHelpers = renderSubmissionComponent(2, {
      live_preview_url: 'https://google.com',
    }, { onFlag });
    const { queryByTestId } = testingHelpers;

    fireEvent.click(queryByTestId('flag-btn'));

    expect(onFlag).toHaveBeenCalledTimes(1);
  });
});

describe('Submission: Live Preview', () => {
  let queryByText;

  afterAll(() => {
    jest.resetModules();
  });

  test('Should render live preivew', () => {
    ({ queryByText } = renderSubmissionComponent(null, {
      live_preview_url: 'https://google.com',
    }));

    const livePreivewLink = queryByText('Live Preview');
    expect(livePreivewLink).toBeInTheDocument();
    expect(livePreivewLink).toHaveAttribute('target', '_blank');
  });

  test('Should not render live preivew', () => {
    ({ queryByText } = renderSubmissionComponent(null, {
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
    ({ queryByText } = renderSubmissionComponent());

    const viewCodeLink = queryByText('View Code');
    expect(viewCodeLink).toBeInTheDocument();
    expect(viewCodeLink).toHaveAttribute('target', '_blank');
  });
});
