import React, { useState, useEffect, useRef } from 'react';
import apiConfig from '../config/apiConfig';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchForeignResource } from '../apis/resources';
import { fetchEnum } from '../apis/enum';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DepartmentModel from '../models/DepartmentModel';
import { useNavigate } from 'react-router-dom';
import './ManageDepartments.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

interface ColumnDef {
  field: string;
  headerName: string;
  editable: boolean;
  resizable: boolean;
  sortable: boolean;
  filter: boolean;
  cellRenderer?: (params: any) => React.ReactNode;
}

// Define the custom cell renderer for the action column
const ActionCellRenderer = (props: any) => {
  const handleEdit = () => {
    props.context.handleUpdate(props.data.id);
  };

  return (
    <button onClick={handleEdit} className="btn btn-primary btn-sm">
      Edit
    </button>
  );
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const ManageDepartments = () => {
  // State for Create Department
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<boolean>(false);
  const [foreignKeyData, setForeignKeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});
  
  // State for Read Department
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'create' | 'view' | 'update'>('view');
  
  const navigate = useNavigate();
  
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("department");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("department");
  
  const fetchedResources = useRef(new Set<string>());
  const fetchedEnum = useRef(new Set<string>());
  const queryClient = useQueryClient();

  // Fetch foreign data
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

  // Fetch enum data
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

  // Fetch metadata
  const { data: metaData, isLoading: isLoadingMeta, error: errorMeta } = useQuery({
    queryKey: ['resMetaData', 'department'],
    queryFn: async () => {
      const res = await fetch(metadataUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch metadata: ${res.statusText}`);
      }

      const data = await res.json();
      setResMetaData(data);
      setFields(data[0].fieldValues);
      
      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);
      setRequiredFields(required || []);

      const foreignFields = data[0].fieldValues.filter((field: any) => field.foreign);
      for (const field of foreignFields) {
        if (!fetchedResources.current.has(field.foreign)) {
          fetchedResources.current.add(field.foreign);
          queryClient.prefetchQuery({
            queryKey: ['foreignData', field.foreign],
            queryFn: () => fetchForeignResource(field.foreign),
          });
          await fetchForeignData(field.foreign, field.name, field.foreign_field);
        }
      }

      const enumFields = data[0].fieldValues.filter((field: any) => field.isEnum === true);
      for (const field of enumFields) {
        if (!fetchedEnum.current.has(field.possible_value)) {
          fetchedEnum.current.add(field.possible_value);
          queryClient.prefetchQuery({
            queryKey: ['enum', field.possible_value],
            queryFn: () => fetchEnum(field.possible_value),
          });
          await fetchEnumData(field.possible_value);
        }
      }

      return data;
    },
  });

  // Fetch resource data
  const { data: dataRes, isLoading: isLoadingDataRes, error: errorDataRes, refetch } = useQuery({
    queryKey: ['resourceData', 'department'],
    queryFn: async () => {
      const params = new URLSearchParams();
      const queryId: any = "GET_ALL";
      params.append("queryId", queryId);

      const accessToken = getCookie("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      const data = await response.json();
      setFetchedData(data.resource || []);
      return data;
    },
  });

  // Transform data for grid
  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      const modelObjects = fetchData.map((obj: any) => DepartmentModel.fromJson(obj));
      const jsonObjects = modelObjects.map((model: any) => model.toJson());
      setRowData(jsonObjects);
    }
  }, [fetchData]);

  // Setup grid columns
  useEffect(() => {
    const data = fetchData || [];
    const fields = requiredFields.filter((field: any) => field !== 'id') || [];
    
    const columns = fields.map((field: any) => ({
      field: field,
      headerName: field,
      editable: false,
      resizable: true,
      sortable: true,
      filter: true
    }));
    
    // Add Action column for update tab
    if (activeTab === 'update') {
      columns.push({
        headerName: 'Action',
        field: 'Action',
        cellRenderer: ActionCellRenderer,
        editable: false,
        resizable: true,
        sortable: false,
        filter: false,
        width: 120
      } as ColumnDef);
    }
    
    setColDef1(columns);
  }, [fetchData, requiredFields, activeTab]);

  // Handle create
  const handleCreate = async () => {
    const accessToken = getCookie("access_token");
    
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    
    const params = new FormData();
    let selectedFile = null;
    selectedFile = Object.keys(dataToSave).filter((key) => dataToSave[key] instanceof File);
    
    if (selectedFile !== undefined && selectedFile.length > 0) {
      params.append("file", dataToSave[selectedFile[0]]);
      dataToSave[selectedFile[0]] = "";
      params.append("description", "my description");
      params.append("appId", "hostel_management_system");
      params.append("dmsRole", "admin");
      params.append("user_id", "admin@rasp.com");
      params.append("tags", "t1,t2,attend");
    }
    
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: params
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
      // Refetch data to update the table
      refetch();
    }
  };

  // Handle update navigation
  const handleUpdate = async (id: any) => {
    navigate(`/edit/department/${id}`);
  };

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  };

  return (
    <div className="manage-departments-container">
      <div className="manage-departments-header">
        <h2>Manage Departments</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Departments
        </button>
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Department
        </button>
        <button 
          className={`tab-button ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Update Department
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'view' && (
          <div className="view-departments-section">
            <h3>All Departments</h3>
            {isLoadingDataRes ? (
              <div className="loading">Loading departments...</div>
            ) : rowData.length === 0 && colDef1.length === 0 ? (
              <div className="no-data">No departments available. Please create a department.</div>
            ) : (
              <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDef1}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={10}
                  animateRows={true}
                  rowSelection="multiple"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-department-section">
            <h3>Create New Department</h3>
            <div className="form-container">
              <div className="form-group">
                <label className="form-label">Department ID *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="dept_id" 
                  required={true} 
                  value={dataToSave["dept_id"] || ""} 
                  onChange={(e) => setDataToSave({ ...dataToSave, dept_id: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="dept_name" 
                  required={true} 
                  value={dataToSave["dept_name"] || ""} 
                  onChange={(e) => setDataToSave({ ...dataToSave, dept_name: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Department Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="dept_email" 
                  required={true} 
                  value={dataToSave["dept_email"] || ""} 
                  onChange={(e) => setDataToSave({ ...dataToSave, dept_email: e.target.value })}
                />
              </div>

                <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                        type="password"
                        className="form-control"
                        name="dept_password"
                        required={true}
                        value={dataToSave["dept_password"] || ""}
                        onChange={(e) =>
                            setDataToSave({ ...dataToSave, dept_password: e.target.value })
                        }
                    />
                </div>

                <button className="btn btn-success submit-button" onClick={handleCreate}>
                Create Department
              </button>
            </div>
          </div>
        )}

        {activeTab === 'update' && (
          <div className="update-department-section">
            <h3>Update Department</h3>
            {isLoadingDataRes ? (
              <div className="loading">Loading departments...</div>
            ) : rowData.length === 0 && colDef1.length === 0 ? (
              <div className="no-data">No departments available to update.</div>
            ) : (
              <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={colDef1}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={10}
                  animateRows={true}
                  rowSelection="multiple"
                  context={{
                    handleUpdate: handleUpdate
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">Department created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;