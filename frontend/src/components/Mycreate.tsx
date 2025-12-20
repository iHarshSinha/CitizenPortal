import React, { useState, useEffect } from "react";
import apiConfig from "../config/apiConfig";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import "./Mycreate.css";

type DecodedToken = {
  email?: string;
  preferred_username?: string;
  name?: string;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const CreateComplaint = () => {
  const [dataToSave, setDataToSave] = useState<any>({
    complaint_status: "Pending",
  });

  const [citizenEmail, setCitizenEmail] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const apiUrl = apiConfig.getResourceUrl("Complaint");

  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded?.email) {
          setCitizenEmail(decoded.email);
          setDataToSave((prev: any) => ({
            ...prev,
            citizen_email: decoded.email,
          }));
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const handleCreate = async () => {
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      alert("No access token found!");
      return;
    }

    const params = new FormData();

    let fileField = Object.keys(dataToSave).find(
      (key) => dataToSave[key] instanceof File
    );

    if (fileField) {
      params.append("file", dataToSave[fileField]);
      dataToSave[fileField] = "";
      params.append("description", "Complaint Image");
      params.append("appId", "rasp_system");
      params.append("dmsRole", "citizen");
      params.append("user_id", citizenEmail);
      params.append("tags", "complaint,rasp");
    }

    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append("resource", base64Encoded);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: params,
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setDataToSave({
        complaint_status: "Pending",
        citizen_email: citizenEmail,
      });
    } else {
      alert("Error creating complaint");
    }
  };

  return (
    <div className="hs-container">
      <h2 className="hs-title">Create Complaint</h2>

      <input type="hidden" value={citizenEmail} name="citizen_email" />

      <div className="hs-form-group">
        <label className="hs-label">Complaint Text *</label>
        <input
          type="text"
          className="hs-input"
          value={dataToSave["complaint_text"] || ""}
          onChange={(e) =>
            setDataToSave({ ...dataToSave, complaint_text: e.target.value })
          }
          required
        />
      </div>

      <div className="hs-form-group">
        <label className="hs-label">Complaint Location *</label>
        <input
          type="text"
          className="hs-input"
          value={dataToSave["complaint_location"] || ""}
          onChange={(e) =>
            setDataToSave({ ...dataToSave, complaint_location: e.target.value })
          }
          required
        />
      </div>

      <div className="hs-form-group">
        <label className="hs-label">Date of Request *</label>
        <input
          type="date"
          className="hs-input"
          value={dataToSave["date_of_request"] || ""}
          onChange={(e) =>
            setDataToSave({ ...dataToSave, date_of_request: e.target.value })
          }
          required
        />
      </div>

      <div className="hs-form-group">
        <label className="hs-label">Complaint Image (Optional)</label>
        <input
          type="file"
          className="hs-file"
          onChange={(e) =>
            setDataToSave({
              ...dataToSave,
              complaint_image: e.target.files?.[0] || null,
            })
          }
        />
      </div>

      <input type="hidden" value="Pending" name="complaint_status" />

      <button className="hs-btn-submit" onClick={handleCreate}>
        Submit Complaint
      </button>

      {showToast && (
        <div className="hs-toast-container">
          <div className="hs-toast">
            <span>Complaint created successfully!</span>
            <button
              className="hs-toast-close"
              onClick={() => setShowToast(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateComplaint;