// import Topbar from "../Topbar";
// import "./ComingSoon.css";

// export default function ComingSoon({ title }) {
//   return (
//     <div className="coming-soon-page">
//       <Topbar title={title} />
//       <div className="coming-soon-page__content">
//         <p>{title} is on the way.</p>
//       </div>
//     </div>
//   );
// }



export default function Inside(){
  return(
    <>
    <div className="Register-bus">
      <div className="rnb">Register new bus</div>
      <div className="busid">Bus ID</div>
      <input type="text" placeholder="e.g OAU-051-IFE" />
      <div className="assdri">Assign Driver</div>
      <select name="Select a driver" id="">Select a driver</select>
      <div className="initial">Initial Status</div>
      <select name="" id="">Active</select>
    </div>
    </> 
  )
}