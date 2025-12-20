import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import apiConfig from "../../config/apiConfig";
import { fetchForeignResource } from "../../apis/resources";
import { fetchEnum, getCookie } from "../../apis/enum";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./DepartmentEdit.css";

const DepartmentEdit = () => {
  const { id }: any = useParams();
  const baseUrl = apiConfig.getResourceUrl("Department");
  const apiUrl = `${apiConfig.getResourceUrl("Department")}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl("Department")}?`;

  const [editedRecord, setEditedRecord] = useState<any>({});
  const [fields, setFields] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  const fetchDataById = async (id: string, resourceName: string) => {
    const params = new URLSearchParams({
      args: `id:${id}`,
      queryId: "GET_BY_ID",
    });

    const url = `${baseUrl}?${params.toString()}`;
    const accessToken = getCookie("access_token");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  };

  const useGetById = (id: string, resourceName: string) => {
    return useQuery({
      queryKey: ["getById", resourceName, id],
      queryFn: () => fetchDataById(id, resourceName),
      enabled: !!id && !!resourceName,
    });
  };

  const { data: fetchedDataById, isLoading: loadingEditComp } = useGetById(
    id,
    "Department"
  );

  useEffect(() => {
    if (fetchedDataById?.resource?.length > 0 && !loadingEditComp) {
      setEditedRecord((prevData: any) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(fetchedDataById["resource"][0]).filter(
            ([key]) => !regex.test(key)
          )
        ),
      }));
      console.log(
        "fetched data by ID",
        fetchedDataById,
        loadingEditComp,
        editedRecord
      );
    }
  }, [fetchedDataById, loadingEditComp]);

  const {
    data: metaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resMetaData", "department"],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);
      }

      const data = await res.json();

      setResMetaData(data);
      setFields(data[0].fieldValues);

      const foreignFields = data[0].fieldValues.filter(
        (field: any) => field.foreign
      );
      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);

          queryClient.prefetchQuery({
            queryKey: ["foreignData", field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });

          await fetchForeignData(
            field.foreign,
            field.name,
            field.foreign_field
          );
        }
      }

      const enumFields = data[0].fieldValues.filter(
        (field: any) => field.isEnum === true
      );
      for (const field of enumFields) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);

          queryClient.prefetchQuery({
            queryKey: ["enum", field.possible_value],
            queryFn: () => fetchEnum(field.possible_value),
          });

          await fetchEnumData(field.possible_value);
        }
      }

      return data;
    },
  });

  const fetchEnumData = async (enumName: string) => {
    try {
      const data = await fetchEnum(enumName);
      setEnums((prev) => ({
        ...prev,
        [enumName]: data,
      }));
    } catch (err) {
      console.error(`Error fetching enum data for ${enumName}:`, err);
    }
  };

  const fetchForeignData = async (
    foreignResource: string,
    fieldName: string,
    foreignField: string
  ) => {
    try {
      const data = await fetchForeignResource(foreignResource);
      setForeignKeyData((prev) => ({
        ...prev,
        [foreignResource]: data,
      }));
    } catch (err) {
      console.error(`Error fetching foreign data for ${fieldName}:`, err);
    }
  };

  const handleEdit = (id: any, field: string, value: any) => {
    setEditedRecord((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  const base64EncodeFun = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleUpdate = async (id: any, e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(editedRecord).length === 0) return;

    const params = new FormData();

    let selectedFile = null;
    selectedFile = Object.keys(editedRecord).filter(
      (key) => editedRecord[key] instanceof File
    );
    if (selectedFile !== undefined && selectedFile.length > 0) {
      params.append("file", editedRecord[selectedFile[0]]);
      editedRecord[selectedFile[0]] = "";

      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }
    const jsonString = JSON.stringify(editedRecord);

    const base64Encoded = base64EncodeFun(jsonString);
    params.append("resource", base64Encoded);
    params.append("action", "MODIFY");
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    try {
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
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Error updating record:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  return (
    <>
      {!loadingEditComp && (
        <div className="department-edit-container">
          <form className="department-edit-form">
            <div className="edit-card">
              <div className="edit-card-header">
                <h2 className="edit-card-title">Edit Department</h2>
              </div>
              
              <div className="edit-card-body">
                <div className="form-group-edit">
                  <label className="form-label-edit">Department ID *</label>
                  <input
                    type="text"
                    className="form-control-edit"
                    name="dept_id"
                    required={true}
                    value={editedRecord["dept_id"] || ""}
                    onChange={(e) => handleEdit(id, "dept_id", e.target.value)}
                  />
                </div>
                
                <div className="form-group-edit">
                  <label className="form-label-edit">Department Name *</label>
                  <input
                    type="text"
                    className="form-control-edit"
                    name="dept_name"
                    required={true}
                    value={editedRecord["dept_name"] || ""}
                    onChange={(e) => handleEdit(id, "dept_name", e.target.value)}
                  />
                </div>
                
                <div className="form-group-edit">
                  <label className="form-label-edit">Department Email *</label>
                  <input
                    type="email"
                    className="form-control-edit"
                    name="dept_email"
                    required={true}
                    value={editedRecord["dept_email"] || ""}
                    onChange={(e) => handleEdit(id, "dept_email", e.target.value)}
                  />
                </div>
                
                <button
                  className="btn-submit-edit"
                  onClick={(e) => handleUpdate(id, e)}
                >
                  Update Department
                </button>
              </div>
            </div>
          </form>

          {showToast && (
            <div className="toast-container-edit">
              <div className="toast-edit">
                <div className="toast-header-edit">
                  <strong>Success</strong>
                  <button
                    type="button"
                    className="btn-close-edit"
                    onClick={() => setShowToast(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="toast-body-edit">
                  Department updated successfully!
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DepartmentEdit;