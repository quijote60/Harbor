// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

jest.mock('harborreactclient/src/features/contributions/contributionsApiSlice.js', () => ({
  useAddNewContributionMutation: jest.fn(() => [
    jest.fn(),
    {
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    },
  ]),
  useGetContributionsQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
    isSuccess: true,
    isError: false,
    status: 'fulfilled',
  })),
}));