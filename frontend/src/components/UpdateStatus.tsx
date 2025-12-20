import React, { useEffect, useState } from "react";
import apiConfig from "../config/apiConfig";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from "@tanstack/react-query";
import ComplaintModel from "../models/ComplaintModel";
import DepartmentModel from "../models/DepartmentModel";

ModuleRegistry.registerModules([AllCommunityModule]);

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

const decodeJWT = (token: string) => {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

const toBase64 = (obj: any) =>
    window.btoa(unescape(encodeURIComponent(JSON.stringify(obj))));

const UpdateStatus = () => {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
    const [showToast, setShowToast] = useState(false);
    const [deptMongoId, setDeptMongoId] = useState<string | null>(null);

    const complaintUrl = `${apiConfig.getResourceUrl("complaint")}?`;
    const departmentUrl = `${apiConfig.getResourceUrl("department")}?`;

    const token = getCookie("access_token");
    const decoded = token ? decodeJWT(token) : null;
    const deptEmail = decoded?.email;

    console.log("JWT DECODED PAYLOAD:", decoded);
    console.log("EMAIL FROM JWT:", deptEmail);

    // -----------------------------------------------------------
    // FETCH DEPARTMENT BASED ON EMAIL
    // -----------------------------------------------------------
    useQuery({
        queryKey: ["department-list"],
        queryFn: async () => {
            console.log("📡 FETCHING DEPARTMENTS...");

            const params = new URLSearchParams();
            params.append("queryId", "GET_ALL");

            const res = await fetch(departmentUrl + params.toString(), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const data = await res.json();

            console.log("RAW DEPARTMENTS FROM BACKEND:", data.resource);

            const departments = (data.resource || []).map((d: any) =>
                DepartmentModel.fromJson(d).toJson()
            );

            console.log("MAPPED DEPARTMENTS:", departments);

            const dept = departments.find(
                (d: any) => d.dept_email === deptEmail
            );

            console.log("MATCHED DEPARTMENT:", dept);

            if (dept) {
                console.log("DEPARTMENT.id BEING USED:", dept.id);
                setDeptMongoId(String(dept.id));
            } else {
                console.warn("NO DEPARTMENT FOUND WITH EMAIL:", deptEmail);
            }

            return departments;
        },
    });

    // -----------------------------------------------------------
    //FETCH COMPLAINTS AND FILTER BY curr_dept_id
    // -----------------------------------------------------------
    useQuery({
        queryKey: ["dept-complaints", deptMongoId],
        enabled: !!deptMongoId,
        queryFn: async () => {
            console.log("FETCHING COMPLAINTS...");
            console.log("deptMongoId USED FOR FILTERING:", deptMongoId);

            const params = new URLSearchParams();
            params.append("queryId", "GET_ALL");

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

            console.log("MAPPED COMPLAINT LIST:", list);

            // Compare department id vs curr_dept_id
            list.forEach((c: any) => {
                console.log(
                    `COMPARING complaint.curr_dept_id(${c.curr_dept_id}) == deptMongoId(${deptMongoId})`
                );
            });

            const filtered = list.filter(
                (c: any) => String(c.curr_dept_id) === String(deptMongoId)
            );

            console.log("FILTERED COMPLAINTS:", filtered);

            setComplaints(filtered);
            return filtered;
        },
    });

    // -----------------------------------------------------------
    //  UPDATE STATUS
    // -----------------------------------------------------------
    const updateStatus = async (complaint: any) => {
        const newStatus = selectedStatus[complaint.id];
        if (!newStatus) return alert("Select a status");

        console.log("Updating Complaint:", complaint);
        console.log("New Status:", newStatus);

        const updatedComplaint = {
            ...complaint,
            complaint_status: newStatus,
        };

        const formData = new FormData();
        formData.append("resource", toBase64(updatedComplaint));
        formData.append("action", "MODIFY");

        const res = await fetch(apiConfig.getResourceUrl("complaint"), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
            body: formData,
        });

        console.log("UPDATE STATUS RESPONSE:", res.status);

        if (!res.ok) return alert("Failed to update");

        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        setComplaints((prev) =>
            prev.map((c) =>
                c.id === complaint.id ? { ...c, complaint_status: newStatus } : c
            )
        );
    };

    // -----------------------------------------------------------
    // GRID COLUMNS
    // -----------------------------------------------------------
    const columns = [
        { headerName: "Complaint", field: "complaint_text" },
        { headerName: "Location", field: "complaint_location" },
        { headerName: "Current Status", field: "complaint_status" },

        {
            headerName: "Update Status",
            field: "complaint_status",
            cellRenderer: (params: any) => (
                <select
                    className="form-select"
                    value={selectedStatus[params.data.id] || ""}
                    onChange={(e) =>
                        setSelectedStatus((prev) => ({
                            ...prev,
                            [params.data.id]: e.target.value,
                        }))
                    }
                >
                    <option value="">-- Select --</option>
                    <option value="Complete">Complete</option>
                </select>
            ),
        },

        {
            headerName: "Action",
            cellRenderer: (params: any) => (
                <button
                    className="btn btn-success"
                    onClick={() => updateStatus(params.data)}
                >
                    Update
                </button>
            ),
        },
    ];

    return (
        <div className="container mt-3">
            <h2 className="fw-bold mb-3">Complaints Assigned to Your Department</h2>

            <div className="ag-theme-alpine" style={{ height: 500 }}>
                <AgGridReact
                    rowData={complaints}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                />
            </div>

            {showToast && (
                <div className="toast-container position-fixed top-20 start-50 translate-middle p-3">
                    <div className="toast show">
                        <div className="toast-header">
                            <strong className="me-auto">Success</strong>
                        </div>
                        <div className="toast-body text-success text-center">
                            Complaint Status Updated!
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateStatus;
