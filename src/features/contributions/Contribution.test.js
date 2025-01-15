import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom';
import NewContributionForm from './NewContributionForm';

const members = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

const categories = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
];

const initialState = {
  contributions: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CONTRIBUTION':
      return {
        ...state,
        contributions: [...state.contributions, action.payload],
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

describe('NewContributionForm', () => {
  it('renders the form and submits successfully', async () => {
    const { getByLabelText, getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <Router>
          <NewContributionForm members={members} categories={categories} />
        </Router>
      </Provider>
    );

    fireEvent.change(getByLabelText('Member'), {
      target: { value: members[0].id },
    });

    fireEvent.change(getByLabelText('Category'), {
      target: { value: categories[0].id },
    });

    fireEvent.change(getByPlaceholderText('Amount'), {
      target: { value: '100' },
    });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(store.getState().contributions).toEqual([
        {
          memberId: members[0].id,
          categoryId: categories[0].id,
          amount: 100,
        },
      ]);
    });
  });
});