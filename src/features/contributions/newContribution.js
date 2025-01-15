
import { useGetMembersQuery } from '../members/membersApiSlice'
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import NewContributionForm from './NewContributionForm'
import useTitle from '../../hooks/useTitle'
import NewContributionForm2 from './NewContributionForm2'
const NewContribution = () => {
    //const members = useSelector(selectAllMembers)
    useTitle('Harbor Bible: New Contribution')

    const {members} = useGetMembersQuery('membersList', {
        selectFromResult: ({data}) => ({
            members: data?.ids.map(id => data?.entities[id])
        }),
   })

    //console.log(members)

    //const categories = useSelector(selectAllCategories)

    const {categories} = useGetCategoriesQuery('categoriesList', {
        selectFromResult: ({data}) => ({
            categories: data?.ids.map(id => data?.entities[id])
        }),
   })

    //console.log(categories)

    if (!members?.length || !categories?.length) return <PulseLoader color = {'#FFF'}  />

    const content = <NewContributionForm members={members} categories={categories} />

    

    return content
}
export default NewContribution