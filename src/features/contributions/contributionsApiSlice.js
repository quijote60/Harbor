import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const contributionsAdapter = createEntityAdapter({});

const initialState = contributionsAdapter.getInitialState();

export const contributionsApiSlice = apiSlice.injectEndpoints({
  // Declare tag types used in this API slice
  tagTypes: ['Contribution', 'ContributionsByMonthYear'],

  endpoints: (builder) => ({
    getContributions: builder.query({
      query: () => ({
        url: '/contributions',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedContributions = responseData.map((contribution) => {
          contribution.id = contribution._id;
          return contribution;
        });
        return contributionsAdapter.setAll(initialState, loadedContributions);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Contribution', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Contribution', id })),
          ];
        } else {
          return [{ type: 'Contribution', id: 'LIST' }];
        }
      },
    }),

    addNewContribution: builder.mutation({
      query: (initialContribution) => ({
        url: '/contributions',
        method: 'POST',
        body: {
          ...initialContribution,
        },
      }),
      invalidatesTags: [{ type: 'Contribution', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(initialContribution, { dispatch, queryFulfilled }) {
        // Create a temporary ID for the new contribution
        const tempId = Date.now().toString();
        const patchResult = dispatch(
          contributionsApiSlice.util.updateQueryData('getContributions', 'contributionsList', (draft) => {
            const newContribution = {
              ...initialContribution,
              id: tempId,
              _id: tempId, // Match the backend's expected field
              createdAt: new Date().toISOString(), // Add createdAt to match filtering logic
              updatedAt: new Date().toISOString(),
              member_id: initialContribution.member_id || '', // Ensure these fields are present
              member_last_name: initialContribution.member_last_name || '',
              category_name: initialContribution.category_name || '',
            };
            contributionsAdapter.addOne(draft, newContribution);
          })
        );
        try {
          const { data } = await queryFulfilled;
          // After the mutation succeeds, update the cache with the actual data from the server
          dispatch(
            contributionsApiSlice.util.updateQueryData('getContributions', 'contributionsList', (draft) => {
              contributionsAdapter.removeOne(draft, tempId); // Remove the temporary entry
              const finalContribution = {
                ...data,
                id: data._id, // Ensure the ID is set correctly
              };
              contributionsAdapter.addOne(draft, finalContribution); // Add the actual contribution
            })
          );
        } catch {
          patchResult.undo(); // Revert the optimistic update on failure
        }
      },
    }),

    updateContribution: builder.mutation({
      query: (initialContribution) => ({
        url: '/contributions',
        method: 'PATCH',
        body: {
          ...initialContribution,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Contribution', id: arg.id },
        { type: 'Contribution', id: 'LIST' }, // Also invalidate the list to ensure the table updates
      ],
    }),

    deleteContribution: builder.mutation({
      query: ({ id }) => ({
        url: `/contributions`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Contribution', id: arg.id },
        { type: 'Contribution', id: 'LIST' }, // Also invalidate the list
      ],
    }),

    searchContributions: builder.mutation({
      query: (searchParams) => ({
        url: '/contributions/search',
        method: 'POST',
        body: {
          ...searchParams,
        },
      }),
      invalidatesTags: [{ type: 'Contribution', id: 'LIST' }],
    }),

    getAllContributionsByMonthYear: builder.query({
      query: () => ({
        url: '/contributions/by-month-year',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => responseData,
      providesTags: (result) => [
        { type: 'ContributionsByMonthYear', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetContributionsQuery,
  useSearchContributionsMutation,
  useAddNewContributionMutation,
  useUpdateContributionMutation,
  useDeleteContributionMutation,
  useGetAllContributionsByMonthYearQuery,
} = contributionsApiSlice;

// Returns the query result object
export const selectContributionsResult = contributionsApiSlice.endpoints.getContributions.select();

// Creates memoized selector
const selectContributionsData = createSelector(
  selectContributionsResult,
  (contributionsResult) => contributionsResult.data // Normalized state object with ids & entities
);

const selectContributionsByMonthYearResult = contributionsApiSlice.endpoints.getAllContributionsByMonthYear.select();

export const selectContributionsByMonthYear = createSelector(
  selectContributionsByMonthYearResult,
  (contributionsByMonthYearResult) => contributionsByMonthYearResult.data ?? []
);

// GetSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllContributions,
  selectById: selectContributionById,
  selectIds: selectContributionIds,
} = contributionsAdapter.getSelectors((state) => selectContributionsData(state) ?? initialState);