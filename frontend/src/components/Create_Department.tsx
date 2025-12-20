

          import React, { useState, useEffect } from 'react';

           import { useNavigate } from 'react-router-dom';

          import "./Create_Department.css";

          
            import CreateDepartment from './Resource/CreateDepartment';

            export default function Create_Department() { 
            const navigate = useNavigate(); 
  

            return (

              <>

              <div id="id-BD" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><CreateDepartment/></div>

              </>

            );

          }