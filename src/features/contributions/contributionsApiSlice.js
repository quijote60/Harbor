import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const contributionsAdapter = createEntityAdapter({})

const initialState = contributionsAdapter.getInitialState()

export const contributionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContributions: builder.query({
            query: () => ({
                url: '/contributions',
                validateStatus: (response, result) =>{
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => {
                const loadedContributions = responseData.map(contribution => {
                    contribution.id = contribution._id
                    return contribution
                });
                return contributionsAdapter.setAll(initialState, loadedContributions)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Contribution', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Contribution', id }))
                    ]
                } else return [{ type: 'Contribution', id: 'LIST' }]
            }
        }),
        
        addNewContribution: builder.mutation({
            query: initialContribution => ({
                url: '/contributions',
                method: 'POST',
                body: {
                    ...initialContribution,
                }
            }),
            invalidatesTags: [
                { type: 'Contribution', id: "LIST" }
            ]
        }),
        updateContribution: builder.mutation({
            query: initialContribution => ({
                url: '/contributions',
                method: 'PATCH',
                body: {
                    ...initialContribution,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Contribution', id: arg.id }
            ]
        }),
        deleteContribution: builder.mutation({
            query: ({ id }) => ({
                url: `/contributions`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Contribution', id: arg.id }
            ]
        }),
        searchContributions: builder.mutation({
            query: searchParams => ({
                url: '/contributions/search',
                method: 'POST',
                body: {
                    ...searchParams
                }
            }),
            invalidatesTags: [{ type: 'Contribution', id: 'LIST' }]
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
})


export const {
    useGetContributionsQuery,
    useSearchContributionsMutation,
    useAddNewContributionMutation,
    useUpdateContributionMutation,
    useDeleteContributionMutation,
    useGetAllContributionsByMonthYearQuery,
} = contributionsApiSlice

// returns the query result object
export const selectContributionsResult = contributionsApiSlice.endpoints.getContributions.select()

// creates memoized selector
const selectContributionsData = createSelector(
    selectContributionsResult,
    contributionsResult => contributionsResult.data // normalized state object with ids & entities
)

const selectContributionsByMonthYearResult = contributionsApiSlice.endpoints.getAllContributionsByMonthYear.select();

export const selectContributionsByMonthYear = createSelector(
    selectContributionsByMonthYearResult,
    (contributionsByMonthYearResult) => contributionsByMonthYearResult.data ?? []
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllContributions,
    selectById: selectContributionById,
    selectIds: selectContributionIds
    // Pass in a selector that returns the notes slice of state
} = contributionsAdapter.getSelectors(state => selectContributionsData(state) ?? initialState)