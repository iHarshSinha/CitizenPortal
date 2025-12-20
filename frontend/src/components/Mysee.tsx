import React, { useState, useEffect } from "react";
import apiConfig from "../config/apiConfig";
import { useQuery } from "@tanstack/react-query";
import ComplaintModel from "../models/ComplaintModel";
import { jwtDecode } from "jwt-decode";
import "./Mysee.css"; // your CSS file

type DecodedToken = {
  email?: string;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const ReadComplaint = () => {
  const [fetchData, setFetchedData] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [citizenEmail, setCitizenEmail] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("all"); // NEW STATE

  const apiUrl = `${apiConfig.getResourceUrl("complaint")}?`;

  // -----------------------------
  // Decode access token to get user email
  // -----------------------------
  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded?.email) {
          setCitizenEmail(decoded.email);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  // -----------------------------
  // Fetch all complaints (GET_ALL)
  // -----------------------------
  const { isLoading, error } = useQuery({
    queryKey: ["complaint", "GET_ALL"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");

      const accessToken = getCookie("access_token");
      if (!accessToken) throw new Error("Access token not found");

      const response = await fetch(apiUrl + params.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error: " + response.status);

      const data = await response.json();
      setFetchedData(data.resource || []);
    },
  });

  // -----------------------------
  // Convert → Model → JSON → Filter by email
  // -----------------------------
  useEffect(() => {
    if (fetchData.length > 0 && citizenEmail) {
      const modelObjects = fetchData.map((obj: any) =>
        ComplaintModel.fromJson(obj)
      );

      const jsonObjects = modelObjects.map((m: any) => m.toJson());

      const filteredByEmail = jsonObjects.filter(
        (complaint: any) => complaint.citizen_email === citizenEmail
      );

      setFilteredComplaints(filteredByEmail);
    }
  }, [fetchData, citizenEmail]);

  // -----------------------------
  // Apply Status Filter
  // -----------------------------
  const getDisplayedComplaints = () => {
    if (statusFilter === "all") return filteredComplaints;

    return filteredComplaints.filter(
      (c) => c.complaint_status?.toLowerCase() === statusFilter
    );
  };

  const displayed = getDisplayedComplaints();

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="hs-read-container">
      <h2 className="hs-title">My Complaints</h2>

      {/* Filter Buttons */}
      <div className="hs-filter-container">
        <button
          className={`hs-filter-btn ${statusFilter === "all" ? "hs-active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          className={`hs-filter-btn ${
            statusFilter === "pending" ? "hs-active" : ""
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          className={`hs-filter-btn ${
            statusFilter === "assigned" ? "hs-active" : ""
          }`}
          onClick={() => setStatusFilter("assigned")}
        >
          Assigned
        </button>

        <button
          className={`hs-filter-btn ${
            statusFilter === "completed" ? "hs-active" : ""
          }`}
          onClick={() => setStatusFilter("completed")}
        >
          Completed
        </button>
      </div>

      {isLoading && <p className="hs-loading">Loading complaints...</p>}

      {error && fetchData.length === 0 && (
        <p className="hs-error">Error loading complaints.</p>
      )}

      {!isLoading && displayed.length === 0 && (
        <p className="hs-nodata">No complaints found for this filter.</p>
      )}

      {!isLoading && displayed.length > 0 && (
        <div className="hs-list">
          {displayed.map((item: any) => (
            <div key={item.id} className="hs-complaint-card">
              <h3 className="hs-complaint-title">{item.complaint_text}</h3>

              <p className="hs-text">
                <strong>Location:</strong> {item.complaint_location}
              </p>

              <p className="hs-text">
                <strong>Date of Request:</strong> {item.date_of_request}
              </p>

              <p className="hs-text">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    "hs-status-badge " +
                    (item.complaint_status?.toLowerCase() === "pending"
                      ? "hs-status-pending"
                      : item.complaint_status?.toLowerCase() === "assigned"
                      ? "hs-status-inprogress"
                      : item.complaint_status?.toLowerCase() === "completed"
                      ? "hs-status-completed"
                      : "hs-status-rejected")
                  }
                >
                  {item.complaint_status}
                </span>
              </p>

              {item.complaint_image ? (
                <p className="hs-text">
                  <strong>Image:</strong>{" "}
                  <a
                    className="hs-link"
                    href={item.complaint_image}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Image
                  </a>
                </p>
              ) : (
                <p className="hs-text">
                  <strong>Image:</strong> No Image
                </p>
              )}

              {item.remarks && (
                <p className="hs-text">
                  <strong>Remarks:</strong> {item.remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadComplaint;