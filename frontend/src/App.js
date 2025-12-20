import ComplaintEdit from "./components/Edit/ComplaintEdit";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Update_Complaint from "./components/Update_Complaint";
import Read_Department from "./components/Read_Department";
import See_Complaints from "./components/See_Complaints";
import Create_Department from "./components/Create_Department";
import Create_Complaint from "./components/Create_Complaint";
import Create_Citizens from "./components/Create_Citizens";
import Mysee from "./components/Mysee";
import Mycreate from "./components/Mycreate";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Edit from './components/Edit/ComplaintEdit';

// admin
import DepartmentEdit from "./components/Edit/DepartmentEdit";
import ViewCitizens from "./components/ViewCitizens";
import ManageDepartments from "./components/ManageDepartments";
import AssignDepartment from "./components/AssignDepartment";

import UpdateStatus from "./components/UpdateStatus";

function App() {
  return (
    <Routes>
      
      <Route path='/edit' element={<Edit/>}/>
      <Route path='/create_citizens' element={<Create_Citizens />} />
  <Route path='/create_complaint' element={<Create_Complaint />} />
  <Route path='/create_department' element={<Create_Department />} />
  <Route path='/see_complaints' element={<See_Complaints />} />
  <Route path='/read_department' element={<Read_Department />} />
  <Route path='/update_complaint' element={<Update_Complaint />} />
  <Route path='/registration' element={<Registration />}/>
  <Route path="/mycreate" element={<Mycreate />} />
  <Route path="/mysee" element={<Mysee />} />
  <Route path='/login' element={<Login />}/>
  <Route path='/edit/complaint/:id' element={<ComplaintEdit />} />

  // admin 
  <Route path='/view_citizens' element={<ViewCitizens />} />
  <Route path='/manage_departments' element={<ManageDepartments />} />
  <Route path='/edit/department/:id' element={<DepartmentEdit />} />
  <Route path='/assign_department' element={<AssignDepartment />} />

        // dept
        <Route path='/update_status' element={<UpdateStatus />} />
  </Routes>
  );
}

export default App;
