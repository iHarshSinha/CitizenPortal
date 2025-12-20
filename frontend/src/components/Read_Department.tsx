

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Read_Department.css";

          
            import ReadDepartment from './Resource/ReadDepartment';

            export default function Read_Department() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-DV" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><ReadDepartment/></div>

              </>

            );

          }