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

const renderSubmissionComponent = (userId, submissionInfo = {}) => render(
  <ProjectSubmissionContext.Provider value={{
    userId,
  }}
  >
    <Submission
      submission={constructSubmission(submissionInfo)}
      handleUpdate={jest.fn()}
      onFlag={jest.fn()}
      handleDelete={jest.fn()}
      handleLikeToggle={jest.fn()}
    />
    ,
  </ProjectSubmissionContext.Provider>,
);

describe('Submission: Current User', () => {
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId } = renderSubmissionComponent(1));
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('Renders edit button', () => {
    const editButton = queryByTestId('edit-submission-btn');
    expect(editButton).toBeInTheDocument();
  });

  test('Displays edit modal when edit button is clicked.', () => {
    fireEvent.mouseDown(queryByTestId('edit-submission-btn'));

    const editForm = queryByTestId('edit-form');
    expect(editForm).toBeInTheDocument();
  });

  test("Doesn't render report button", () => {
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

  test('Renders edit button', () => {
    const editButton = queryByTestId('edit-submission-btn');
    expect(editButton).not.toBeInTheDocument();
  });

  test('Renders report button', () => {
    const reportButton = queryByTestId('flag-btn');
    expect(reportButton).toBeInTheDocument();
  });
});

describe('Submission: Live Preview', () => {
  let queryByTestId;

  afterAll(() => {
    jest.resetModules();
  });

  test('Renders live preivew with valid live_preview_url', () => {
    ({ queryByTestId } = renderSubmissionComponent(null, {
      live_preview_url: 'https://google.com',
    }));

    const livePreivewLink = queryByTestId('live-preview-btn');
    expect(livePreivewLink).toBeInTheDocument();
    expect(livePreivewLink).toHaveAttribute('target', '_blank');
  });

  test("Doesn't render live preivew without live_preview_url", () => {
    ({ queryByTestId } = renderSubmissionComponent(null, {
      userId: 2,
      // this is sent for the readability of the test even though it's unnecessary.
      live_preview_url: '',
    }));

    const livePreviewLink = queryByTestId('live-preview-btn');
    expect(livePreviewLink).not.toBeInTheDocument();
  });
});

describe('Submission: View Code', () => {
  let queryByTestId;

  afterAll(() => {
    jest.resetModules();
  });

  test('Renders view code link', () => {
    ({ queryByTestId } = renderSubmissionComponent());

    const viewCodeLink = queryByTestId('view-code-btn');
    expect(viewCodeLink).toBeInTheDocument();
    expect(viewCodeLink).toHaveAttribute('target', '_blank');
  });
});
