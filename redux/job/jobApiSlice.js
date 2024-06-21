import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const jobsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.createdAt - a.createdAt
});

const initialState = jobsAdapter.getInitialState();

export const jobsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getJobs: builder.query({
            query: () => ({
                url: "/jobs",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                }
            }),

            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Job", id: "LIST" },
                        ...result.ids.map(id => ({ type: "Job", id }))
                    ];
                } else return [{ type: "Job", id: "LIST" }];
            }
        }),
        getJob: builder.query({
            query: id => ({
                url: `/jobs/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                }
            }),

            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "Job", id: "LIST" },
                        ...result.ids.map(id => ({ type: "Job", id }))
                    ];
                } else return [{ type: "Job", id: "LIST" }];
            }
        }),

        updateJob: builder.mutation({
            query: ({ jobId, value }) => ({
                url: `/jobs/${jobId}`,
                method: "PATCH",
                body: value,
                responseHandler: "text"
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Job", id: arg.id }
            ]
        }),
        addNewJob: builder.mutation({
            query: value => ({
                url: `/jobs`,
                method: "POST",
                body: value,
                responseHandler: "text"
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Job", id: arg.id }
            ]
        }),
        deleteJob: builder.mutation({
            query: id => ({
                url: "/jobs/" + id,
                method: "DELETE",
                responseHandler: "text"
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Job", id: arg.id }
            ]
        }),

        getJobApplicants: builder.query({
            query: ({ jobId }) => ({
                url: `/jobs/${jobId}/applicants`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                }
            }),

            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: "UApplicant", id: "LIST" },
                        ...result.ids.map(id => ({ type: "UApplicant", id }))
                    ];
                } else return [{ type: "UApplicant", id: "LIST" }];
            }
        }),
        addNewJobApplicant: builder.mutation({
            query: ({ jobId, applicantId }) => ({
                url: `/jobs/${jobId}/applicants/${applicantId}`,
                method: "POST",
                responseHandler: "text"
            }),

            invalidatesTags: [{ type: "UApplicant", id: "LIST" }]
        }),
        updateJobApplicant: builder.mutation({
            query: ({ jobId, applicantId }) => ({
                url: `/jobs/${jobId}/applicants/${applicantId}}`,
                method: "PATCH",
                responseHandler: "text"
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "UApplicant", id: arg.id }
            ]
        }),
        deleteJobApplicant: builder.mutation({
            query: ({ jobId, applicantId }) => ({
                url: `/jobs/${jobId}/applicants/${applicantId}`,
                method: "DELETE",
                responseHandler: "text"
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "UApplicant", id: arg.id }
            ]
        })
    })
});

export const {
    useGetJobsQuery,
    useGetJobQuery,
    useAddNewJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
    useGetJobApplicantsQuery,
    useAddNewJobApplicantMutation,
    useUpdateJobApplicantMutation,
    useDeleteJobApplicantMutation
} = jobsApiSlice;

// returns the query result object
export const selectJobsResult = jobsApiSlice.endpoints.getJobs.select();

// creates memoized selector
const selectJobsData = createSelector(
    selectJobsResult,
    jobsResult => jobsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllJobs,
    selectById: selectJobById,
    selectIds: selectJobIds
    // Pass in a selector that returns the jobs slice of state
} = jobsAdapter.getSelectors(state => selectJobsData(state) ?? initialState);
