import React, { useEffect, useState } from "react";
import apiConfig from "../config/apiConfig";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import ComplaintModel from "../models/ComplaintModel";
import DepartmentModel from "../models/DepartmentModel";

ModuleRegistry.registerModules([AllCommunityModule]);

// Read cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Safe Base64
const toBase64 = (obj: any) =>
  window.btoa(unescape(encodeURIComponent(JSON.stringify(obj))));

const AssignDepartment = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  const complaintUrl = `${apiConfig.getResourceUrl("complaint")}?`;
  const deptUrl = `${apiConfig.getResourceUrl("department")}?`;

  // -----------------------------------------------------------
  // FETCH COMPLAINTS (Pending Only)
  // -----------------------------------------------------------
  useQuery({
    queryKey: ["complaint-list"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const token = getCookie("access_token");

      const res = await fetch(complaintUrl + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      console.log("RAW COMPLAINTS FROM BACKEND:", data.resource);

      const list = (data.resource || []).map((c: any) =>
        ComplaintModel.fromJson(c).toJson()
      );

      console.log("MAPPED COMPLAINTS:", list);

      const pendingOnly = list.filter(
        (c: any) => c.complaint_status?.toLowerCase() === "pending"
      );

      console.log("PENDING COMPLAINTS:", pendingOnly);

      setComplaints(pendingOnly);
      return list; // avoids Tanstack warning
    },
  });

  // -----------------------------------------------------------
  // FETCH DEPARTMENTS
  // -----------------------------------------------------------
  useQuery({
    queryKey: ["department-list"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const token = getCookie("access_token");

      const res = await fetch(deptUrl + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      console.log("RAW DEPARTMENTS:", data.resource);

      const list = (data.resource || []).map((d: any) =>
        DepartmentModel.fromJson(d).toJson()
      );

      console.log("MAPPED DEPARTMENTS:", list);

      setDepartments(list);
      return list; // avoid warning
    },
  });

  // -----------------------------------------------------------
  // ASSIGN DEPARTMENT
  // -----------------------------------------------------------
  const assignDepartment = async (complaint: any) => {
    const token = getCookie("access_token");
    if (!token) return alert("No access token");

    const deptId = selectedDept[complaint.id]; // string for now

    console.log("USER SELECTED VALUE (dept_id):", deptId);

    if (!deptId) {
      alert("Please select a department.");
      return;
    }

    const updatedComplaint = {
      ...complaint,
      complaint_status: "Assigned",

      // 🟢 FIX: convert to number
      curr_dept_id: Number(deptId),
    };

    console.log("UPDATED COMPLAINT BEFORE BASE64:", updatedComplaint);

    const formData = new FormData();
    const encoded = toBase64(updatedComplaint);

    console.log("BASE64 PAYLOAD:", encoded);

    formData.append("resource", encoded);
    formData.append("action", "MODIFY");

    const res = await fetch(apiConfig.getResourceUrl("complaint"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      body: formData,
    });

    console.log("SERVER RESPONSE STATUS:", res.status);

    if (!res.ok) {
      const txt = await res.text();
      console.error("SERVER ERROR BODY:", txt);
      alert("Failed to assign department");
      return;
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));
  };

  // -----------------------------------------------------------
  // GRID COLUMNS
  // -----------------------------------------------------------
  const columns = [
    { headerName: "Complaint", field: "complaint_text" },
    { headerName: "Location", field: "complaint_location" },
    { headerName: "Status", field: "complaint_status" },

    {
      headerName: "Select Department",
      field: "curr_dept_id",
      cellRenderer: (params: any) => (
        <select
          className="form-select"
          value={selectedDept[params.data.id] || ""}
          onChange={(e) => {
            console.log(
              "DROPDOWN CHANGE – complaint.id:",
              params.data.id,
              " → selected dept(dept_id):",
              e.target.value
            );

            setSelectedDept((prev) => ({
              ...prev,
              [params.data.id]: e.target.value, // storing dept_id (NUMBER as string)
            }));
          }}
        >
          <option value="">-- Select --</option>

          {departments.map((d) => (
            <option key={d.id} value={d.dept_id}>
              {d.dept_name}
            </option>
          ))}
        </select>
      ),
    },

    {
      headerName: "Action",
      cellRenderer: (params: any) => (
        <button
          className="btn btn-primary"
          onClick={() => assignDepartment(params.data)}
        >
          Assign
        </button>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <h2 className="fw-bold mb-3">Assign Department to Pending Complaints</h2>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={complaints}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {showToast && (
        <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
          <div className="toast show">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
            </div>
            <div className="toast-body text-success text-center">
              Department Assigned Successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDepartment;