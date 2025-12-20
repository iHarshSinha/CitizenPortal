

import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import "./Create_Citizens.css";


import CreateCitizen from './Resource/CreateCitizen';

import Calendar from "./Calendar/Calendar"; export default function Create_Citizens() {
  const navigate = useNavigate();


  return (

    <>

      <div id="id-87" className="d-flex flex-column border border-2 p-2  gap-2 mb-2"><CreateCitizen /></div>

    </>

  );

}