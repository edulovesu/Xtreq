// import { Routes, Route } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Revenue from "./Revenue Overview.jsx/Revenue";
// import Remittance from "./Remittance Report.jsx/Remittance";
// import Bus from './Bus Management/BusManagement';
// import RouteMan from './Route Management/RouteManagement';
// import StudentLookup from './Student Lookup/StudentLookup';
// // import ComingSoon from "./ComingSoon/ComingSoon";
// {/* <Route path="/fraudmonitoring" element={<ComingSoon title="Fraud Monitoring" />} /> */}

// function App() {
//   return (
//     <div className="app-shell">
//       <Sidebar />
//       <Routes>
//         <Route path="/" element={<Revenue />} />
//         <Route path="/remittance" element={<Remittance />} />
//         <Route path="/busmanagement" element={<Bus />} />
//         <Route path="/routemanagement" element={<RouteMan />} />
//         <Route path="/studentlookup" element={<StudentLookup />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
// Navigate, useLocation 
// useAuth

import { Routes, Route, } from "react-router-dom";
import { AuthProvider,  } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Login from "./Login/Login";
import Revenue from "./Revenue Overview.jsx/Revenue";
import Remittance from "./Remittance Report.jsx/Remittance";
import Bus from "./Bus Management/BusManagement";
import RouteMan from "./Route Management/RouteManagement";
import StudentLookup from "./Student Lookup/StudentLookup";
import Profile from "./Profile/Profile";

// Every admin screen needs a valid session. While AuthContext is still
// checking a stored token (GET /admins/me) we render nothing rather than
// flashing the login screen; once that settles, no user -> bounce to
// /login and remember where we were trying to go.
function ProtectedLayout() {
  // const { isAuthenticated, loading } = useAuth();
  // const location = useLocation();

  // if (loading) return null;
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return (
    <div className="app-shell">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Revenue />} />
        <Route path="/remittance" element={<Remittance />} />
        <Route path="/busmanagement" element={<Bus />} />
        <Route path="/routemanagement" element={<RouteMan />} />
        <Route path="/studentlookup" element={<StudentLookup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;