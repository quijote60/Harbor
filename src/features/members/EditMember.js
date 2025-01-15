import { useParams } from 'react-router-dom'
import useTitle from '../../hooks/useTitle'
import EditMemberForm from './EditMemberForm'
import { useGetMembersQuery} from './membersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const EditMember = () => {
    useTitle('Harbor Bible: Edit Member')
    const { id } = useParams()

    //const member = useSelector(state => selectMemberById(state, id))

    const { member } = useGetMembersQuery("membersList", {
        selectFromResult: ({ data }) => ({
            member: data?.entities[id]
        }),
    })

    console.log(member)

    if (!member) return <PulseLoader color={"#FFF"} />

    const content = <EditMemberForm member={member} /> 

    return content
}
export default EditMember
