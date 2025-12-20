import React, { useState, useEffect } from 'react';
import apiConfig from '../config/apiConfig';
import { useQuery } from '@tanstack/react-query';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import CitizenModel from '../models/CitizenModel';
import './ViewCitizens.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const ViewCitizens = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDef1, setColDef1] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl('citizen');
  const metadataUrl = apiConfig.getResourceMetaDataUrl('citizen');

  // Fetch resource data
  const { data: dataRes, isLoading: isLoadingDataRes, error: errorDataRes } = useQuery({
    queryKey: ['resourceData', 'citizen'],
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

  // Fetch metadata
  const { data: dataResMeta, isLoading: isLoadingDataResMeta, error: errorDataResMeta } = useQuery({
    queryKey: ['resourceMetaData', 'citizen'],
    queryFn: async () => {
      const response = await fetch(`${metadataUrl}?`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      const data = await response.json();
      setResMetaData(data);
      setFields(data[0]?.fieldValues || []);
      const required = data[0]?.fieldValues
        .filter((field: any) => !regex.test(field.name))
        .map((field: any) => field.name);
      setRequiredFields(required || []);
      return data;
    },
  });

  // Transform API data into model objects and then JSON
  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      const modelObjects = fetchData.map((obj: any) => CitizenModel.fromJson(obj));
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

    setColDef1(columns);
  }, [fetchData, requiredFields]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  };

  return (
    <div className="view-citizens-container">
      <div className="view-citizens-header">
        <h2>View Citizens</h2>
      </div>

      <div className="view-citizens-content">
        <div className="citizens-section">
          <h3>All Registered Citizens</h3>
          {isLoadingDataRes ? (
            <div className="loading">Loading citizens...</div>
          ) : rowData.length === 0 && colDef1.length === 0 ? (
            <div className="no-data">No citizens available. Please register citizens.</div>
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
      </div>
    </div>
  );
};

export default ViewCitizens;