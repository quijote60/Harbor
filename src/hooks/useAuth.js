import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let isEmployee = false
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isEmployee = roles.includes('Employee')

        if (isManager) status = "Manager"
        else if (isManager) status = "Manager";
        else if (isEmployee) status = "Employee";

        return { username, roles, status, isManager, isAdmin, isEmployee };
    }

    return { username: '', roles: [], isManager, isAdmin, isEmployee, status };
}
export default useAuth