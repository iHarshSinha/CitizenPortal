import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Create_Complaint.css";

import CreateComplaint from "./Resource/CreateComplaint";
import Calendar from "./Calendar/Calendar";
export default function Create_Complaint() {
  const navigate = useNavigate();

  return (
    <>
      <div
        id="id-9J"
        className="d-flex flex-column border border-2 p-2  gap-2 mb-2"
      >
        <CreateComplaint />
      </div>
    </>
  );
}
