import { ToastContainer, toast } from 'react-toastify';
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './index.css'
import Layout from './Layout.jsx'
import UserSignUpWrapper from './Components/UserSignUp/UserSignUpWrapper.jsx'
import { Provider } from 'react-redux'
import { Store } from './Store/Store.js'
import UserLoginWrapper from './Components/Login/UserLoginWrapper.jsx';
import UserDashboard from './Components/Dashboard/UserDashboard.jsx';
import { routes } from './data/routes.js';
import NotFound from './Components/404/NotFound.jsx';
import AboutUs from './Components/screens/AboutUs.jsx';
import { Parallax, ParallaxProvider, useParallax } from 'react-scroll-parallax';
import Hero from './Components/Hero/Hero.jsx';
import OAuth from './Components/auth/OAuth.jsx';
import DepartmentSignUpWrapper from './Components/DepartmentSignUp/DepartmentSignUpWrapper.jsx';
import DepartmentSignInWrapper from './Components/DepartmentSign/DepartmentSignInWrapper.jsx';
import DepartmentDashboard from './Components/Dashboard/DepartmentDashboard.jsx';
import AllStates from './Components/AllStates/AllStates.jsx';
import AllDistricts from './Components/AllDistricts/AllDistricts.jsx';
import AllDepartment from './Components/AllDepartment/AllDepartment.jsx';
import DepartmentInfo from './Components/DepartmentInfo/DepartmentInfo.jsx';
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';
import ComplaintWrapper from './Components/complaint/ComplaintWrapper.jsx'
import AdminLogin from './Components/Admin/AdminLogin.jsx';
import AdminDashboard from './Components/Admin/AdminDashboard.jsx';
import AllComplaints from './Components/AllComplaints/AllComplaints.jsx';
import UserComplaint from './Components/userComplaint/UserComplaint.jsx';
import DepartmentComplaint from './Components/DepartmentComplaint/DepartmentComplaint.jsx';
import ActiveComplaint from './Components/DepartmentComplaint/ActiveComplaint.jsx';
import UnverifiedDepartments from './Components/Admin/UnverifiedDepartments.jsx';
import UnsolvedComplaints from './Components/Admin/UnsolvedComplaints.jsx';
import AdminDashboardHome from './Components/Admin/AdminDashboardHome.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* user */}
      <Route path={routes.userSignup} element={<UserSignUpWrapper />}></Route>
      <Route path={routes.userLogin} element={<UserLoginWrapper />}></Route>

      {/* department */}
      <Route path={routes.deptSignUp} element={<DepartmentSignUpWrapper />}></Route>
      <Route path={routes.deptLogin} element={<DepartmentSignInWrapper />}></Route>
      <Route path={routes.adminLogin} element={<AdminLogin/>}></Route>

      {/* Admin */}
      <Route path='/admin-dashboard' element={<AdminDashboardHome/>}></Route>
      <Route path={routes.unverifiedDepartments} element={<UnverifiedDepartments/>}></Route>
      <Route path={routes.unsolvedComplaints} element={<UnsolvedComplaints/>}></Route>
      
      <Route path="/" element={<Hero />}></Route>
      <Route path={routes.aboutUs} element={<><Header /><AboutUs /><Footer /></>}></Route>
      <Route path={routes.departmentInfo} element={<><Header /><AllStates /><Footer/></>}></Route>
      <Route path={`${routes.departmentInfo}/:param`} element={<><Header /><AllDistricts /><Footer/></>}></Route>
      <Route path={`${routes.departmentInfo}/:param/:district`} element={<><Header /><AllDepartment /><Footer/></>}></Route>
      <Route path={`${routes.departmentInfo}/:param/:district/:departmentName`} element={<><Header /><DepartmentInfo /><Footer/></>}></Route>

      
      <Route path='' element={<OAuth><Layout /></OAuth>}>
        <Route path={routes.userDashboard} element={<OAuth><UserDashboard /></OAuth>}></Route>
        <Route path={routes.deptDashboard} element={<OAuth><DepartmentDashboard /></OAuth>}></Route>
        <Route path={routes.raiseComplaint} element={<OAuth><ComplaintWrapper /></OAuth>}></Route>
        <Route path={routes.seeComplaints} element={<OAuth><AllComplaints/></OAuth>}></Route>
        <Route path={routes.userComplaint} element={<OAuth><UserComplaint/></OAuth>}></Route>
        <Route path={routes.deptComplaint} element={<OAuth><DepartmentComplaint/></OAuth>}></Route>
        <Route path={routes.activeComplaint} element={<OAuth><ActiveComplaint/></OAuth>}></Route>
      </Route>
      <Route path='*' element={<NotFound />}></Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <ToastContainer />
    <RouterProvider router={router} />
  </Provider>

)
