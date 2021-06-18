import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ProjectSubmissionContext from '../../ProjectSubmissionContext';
import Submission from '../submission';

const defaultSubmission = {
  user_name: 'Example User',
  repo_url: 'http://example.com/repo',
  live_preview_url: 'https://google.com',
  is_public: true,
  lesson_has_live_preview: true,
  user_id: 1,
};

const renderSubmissionComponent = (submission, userId = 1) => render(
  <ProjectSubmissionContext.Provider value={{
    userId,
  }}
  >
    <Submission
      submission={submission}
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
    ({ queryByTestId } = renderSubmissionComponent(defaultSubmission));
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
    ({ queryByTestId } = renderSubmissionComponent(defaultSubmission, 2));
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

describe('Submission (both cases): Live Preview', () => {
  let queryByTestId;

  afterAll(() => {
    jest.resetModules();
  });

  test('Renders live preivew with valid live_preview_url', () => {
    ({ queryByTestId } = renderSubmissionComponent({
      ...defaultSubmission,
      live_preview_url: 'https://google.com',
    }));

    const livePreivewLink = queryByTestId('live-preview-btn');
    expect(livePreivewLink).toBeInTheDocument();
    expect(livePreivewLink).toHaveAttribute('target', '_blank');
  });

  test("Doesn't render live preivew without live_preview_url", () => {
    ({ queryByTestId } = renderSubmissionComponent({
      ...defaultSubmission,
      live_preview_url: '',
    }));

    const livePreviewLink = queryByTestId('live-preview-btn');
    expect(livePreviewLink).not.toBeInTheDocument();
  });
});

describe('Submission (both cases): View Code', () => {
  let queryByTestId;

  afterAll(() => {
    jest.resetModules();
  });

  test('Renders view code link', () => {
    ({ queryByTestId } = renderSubmissionComponent(defaultSubmission));

    const viewCodeLink = queryByTestId('view-code-btn');
    expect(viewCodeLink).toBeInTheDocument();
    expect(viewCodeLink).toHaveAttribute('target', '_blank');
  });
});
