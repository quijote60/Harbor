import { useParams } from 'react-router-dom'
import PulseLoader from 'react-spinners/PulseLoader'
import EditCategoryForm from './EditCategoryForm'
import { useGetCategoriesQuery } from './categoriesApiSlice'

const EditCategory = () => {
    const { id } = useParams()

    const { category } = useGetCategoriesQuery("categoriesList", {
        selectFromResult: ({ data }) => ({
            category: data?.entities[id]
        }),
    })

    console.log(category)

    if (!category) return <PulseLoader color={"#FFF"} />

    const content = <EditCategoryForm category={category} />
    return content
}
export default EditCategory
