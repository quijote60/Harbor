import { useParams } from 'react-router-dom'

import EditContributionForm from './EditContributionForm'
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice'
import { useGetMembersQuery } from '../members/membersApiSlice'
import { useGetContributionsQuery } from './contributionsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'


const EditContribution = () => {
    useTitle('Harbor Bible: Edit Contribution ')
    const { id } = useParams()
    //const { username, isManager, isAdmin } = useAuth()
    //const contribution = useSelector(state => selectContributionById(state, id))
    const { contribution } = useGetContributionsQuery("contributionsList", {
        selectFromResult: ({ data }) => ({
            contribution: data?.entities[id]
        }),
    })
    //const members = useSelector(selectAllMembers)
    const { members } = useGetMembersQuery("membersList", {
        selectFromResult: ({ data }) => ({
            members: data?.ids.map(id => data?.entities[id])
        }),
    })
    //const categories = useSelector(selectAllCategories)

    const { categories } = useGetCategoriesQuery("categoriesList", {
        selectFromResult: ({ data }) => ({
            categories: data?.ids.map(id => data?.entities[id])
        }),
    })
    
    if (!contribution || !members?.length || !categories?.length) return <PulseLoader color={"#FFF"} />
    const content = <EditContributionForm contribution={contribution} members={members} categories={categories} /> 

    return content
}
export default EditContribution