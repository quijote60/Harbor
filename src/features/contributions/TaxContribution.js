import { useGetMembersQuery } from '../members/membersApiSlice'
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice'
import { useGetContributionsQuery } from './contributionsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import NewContributionForm from './NewContributionForm'
import useTitle from '../../hooks/useTitle'
import NewContributionForm2 from './NewContributionForm2'
import ContributionTax from './ContributionTax'
const TaxContribution = () => {
    //const members = useSelector(selectAllMembers)
    useTitle('Harbor Bible: New Contribution')

    const {members} = useGetMembersQuery('membersList', {
        selectFromResult: ({data}) => ({
            members: data?.ids.map(id => data?.entities[id])
        }),
   })

    console.log(members)

    //const categories = useSelector(selectAllCategories)

    const {categories} = useGetCategoriesQuery('categoriesList', {
        selectFromResult: ({data}) => ({
            categories: data?.ids.map(id => data?.entities[id])
        }),
   })

    //console.log(contributions)

    if (!members?.length || !categories?.length) return <PulseLoader color = {'#FFF'}  />

    const content = <ContributionTax members={members} categories={categories} />

    

    return content
}
export default TaxContribution