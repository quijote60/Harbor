import { store } from '../../app/store'

import { usersApiSlice } from '../users/usersApiSlice';
import { categoriesApiSlice} from '../categories/categoriesApiSlice';
import { contributionsApiSlice } from '../contributions/contributionsApiSlice';
import { membersApiSlice } from '../members/membersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        //console.log('subscribing')
        //const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        //const categories = store.dispatch(categoriesApiSlice.endpoints.getCategories.initiate())
        //const contributions = store.dispatch(contributionsApiSlice.endpoints.getContributions.initiate())
        //const members = store.dispatch(membersApiSlice.endpoints.getMembers.initiate())
        //const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        //const sunday = store.dispatch(contributionsApiSlice.endpoints.getContributionsSunday.initiate())

        store.dispatch(categoriesApiSlice.util.prefetch('getCategories','categoriesList', {force:true}))
        store.dispatch(contributionsApiSlice.util.prefetch('getContributions','contributionsList', {force:true}))
        store.dispatch(membersApiSlice.util.prefetch('getMembers','membersList', {force:true}))
        store.dispatch(usersApiSlice.util.prefetch('getUsers','usersList', {force:true}))
        //store.dispatch(contributionsApiSlice.util.prefetch('getContributionSunday','contributionsSundayList', {force:true}))

        
    }, [])

    return <Outlet />
}
export default Prefetch