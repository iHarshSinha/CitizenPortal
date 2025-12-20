

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Update_Complaint.css";

          
            import UpdateComplaint from './Resource/UpdateComplaint';

            import Calendar from "./Calendar/Calendar";export default function Update_Complaint() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-EJ" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><UpdateComplaint/></div>

              </>

            );

          }