import { useParams } from 'react-router-dom'

import SearchContributionForm from './EditContributionForm'
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice'
import { useGetMembersQuery } from '../members/membersApiSlice'
import { useGetContributionsQuery } from './contributionsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import ContributionSearch from './ConstributionSearch'
import ContributionAnnual from './ContributionAnnual'


const AnnualContribution = () => {
    useTitle('Harbor Bible: Edit Contribution ')
    console.log('I am in search');
    const { id } = useParams()
    //const { username, isManager, isAdmin } = useAuth()
    //const contribution = useSelector(state => selectContributionById(state, id))
    const { contributions } = useGetContributionsQuery("contributionsList", {
        selectFromResult: ({ data }) => ({
            contribution: data?.entities[id]
        }),
    })
    console.log('testone:',contributions)
    //const members = useSelector(selectAllMembers)
    const { members } = useGetMembersQuery("membersList", {
        selectFromResult: ({ data }) => ({
            members: data?.ids.map(id => data?.entities[id])
        }),
    })
    //const categories = useSelector(selectAllCategories)
    console.log(members);
    const { categories } = useGetCategoriesQuery("categoriesList", {
        selectFromResult: ({ data }) => ({
            categories: data?.ids.map(id => data?.entities[id])
        }),
    })
    console.log(categories);
    
   // if (!contributions || !members?.length || !categories?.length) return <PulseLoader color={"#FFF"} />
   //if (!contributions || !members?.length) return <PulseLoader color={"#FFF"} />
    //const content = <SearchContributionForm contribution={contributions} members={members} categories={categories} /> 
    const content = <ContributionAnnual contribution={contributions} members={members}  categories={categories}/> 

    return content
}
export default AnnualContribution