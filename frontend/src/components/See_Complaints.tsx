

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./See_Complaints.css";

          
            import ReadComplaint from './Resource/ReadComplaint';

            import Calendar from "./Calendar/Calendar";export default function See_Complaints() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-C1" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><ReadComplaint/></div>

              </>

            );

          }