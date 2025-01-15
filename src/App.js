import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import MembersList from './features/members/MembersList'
import UsersList from './features/users/UsersList'
import CategoriesList from './features/categories/CategoriesList';
import ContributionsList from './features/contributions/ContributionsList';
import NewUserForm from './features/users/NewUserForm';
import EditUser from './features/users/EditUser';
import Prefetch from './features/auth/Prefetch';
import NewCategoryForm from './features/categories/NewCategoryForm';
import EditCategory from './features/categories/EditCategory';
import NewMemberForm from './features/members/NewMemberForm'; 
import EditMember from './features/members/EditMember';
import useTitle from './hooks/useTitle';
import NewContribution from './features/contributions/newContribution';
import SearchContribution from './features/contributions/SearchContribution';
import NewCategoryForm2 from './features/categories/NewCategoryForm2';
import NewUserForm2 from './features/users/NewUserForm2';
import NewMemberForm2 from './features/members/NewMemberForm2';
import NewContributionForm2 from './features/contributions/NewContributionForm2';
import ContributionsByMonthChart from './features/contributions/ContributionsByMonthChart';
import EditContribution from './features/contributions/EditContribution';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth'
import ReportsList from './features/contributions/ReportsList';
import ContributionsTable from './features/contributions/ContributionsTable';
import ContributionsPage from './features/contributions/ContributionsPage';
import ContributionSearch from './features/contributions/ConstributionSearch';
import { ROLES } from './config/roles'
import SimpleTable from './features/contributions/SimpleTable';

function App() {
  useTitle('Harbor Bible')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        
        <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
        <Route element={<Prefetch />}>

        <Route path="dash" element={<DashLayout />}>
        

          <Route index element={<Welcome />} />

          <Route path="members">
            <Route index element={<MembersList />} />
            <Route path=":id" element={<EditMember />} />
            <Route path="new" element={<NewMemberForm2 />} />
          </Route>

          <Route path="categories">
            <Route index element={<CategoriesList />} />
            <Route path=":id" element={<EditCategory />} />
            <Route path="new" element={<NewCategoryForm2 />} />
          </Route>

          <Route path="contributions">
            <Route index element={<ContributionsList />} />
            <Route path="new" element={<NewContribution />} />
            <Route path=":id" element={<EditContribution />} />
            <Route path='report' element ={<ContributionsPage/>} />
            <Route path="search" element={<SearchContribution/>} />
            <Route path='chart' element={<ContributionsByMonthChart/>} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
            <Route path=":id" element={<EditUser />} />
            <Route path="new" element={<NewUserForm2 />} />
          </Route>
          
          <Route path='reports'>
            <Route index element={<ContributionsTable/>} />
          </Route>

        </Route>{/* End Dash */}
        </Route>
        </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;