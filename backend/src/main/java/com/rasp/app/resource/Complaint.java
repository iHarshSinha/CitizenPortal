/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import platform.exception.ExceptionEnum;
 import platform.resource.BaseResource;
import platform.util.*;
import org.springframework.stereotype.Component;
import platform.db.*;
import java.util.*;
import com.rasp.app.message.*;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
@Component
 public class Complaint extends BaseResource {
	private String id = null;
	private String g_created_by_id = null;
	private String g_created_by_name = null;
	private String g_modified_by_id = null;
	private String g_modified_by_name = null;
	private Long g_creation_time = null;
	private Long g_modify_time = null;
	private String g_soft_delete = null;
	private String g_status = null;
	private String archived = null;
	private Long archived_time = null;
	private String citizen_email = null;
	private String complaint_text = null;
	private String complaint_location = null;
	private String complaint_image = null;
	private Date date_of_request = null;
	private Date date_of_completion = null;
	private String complaint_status = null;
	private String curr_dept_id = null;
	private String remarks = null;
	private Map<String, Object> extra_data = null;

	public static String FIELD_ID = "id";
	public static String FIELD_G_CREATED_BY_ID = "g_created_by_id";
	public static String FIELD_G_CREATED_BY_NAME = "g_created_by_name";
	public static String FIELD_G_MODIFIED_BY_ID = "g_modified_by_id";
	public static String FIELD_G_MODIFIED_BY_NAME = "g_modified_by_name";
	public static String FIELD_G_CREATION_TIME = "g_creation_time";
	public static String FIELD_G_MODIFY_TIME = "g_modify_time";
	public static String FIELD_G_SOFT_DELETE = "g_soft_delete";
	public static String FIELD_G_STATUS = "g_status";
	public static String FIELD_ARCHIVED = "archived";
	public static String FIELD_ARCHIVED_TIME = "archived_time";
	public static String FIELD_CITIZEN_EMAIL = "citizen_email";
	public static String FIELD_COMPLAINT_TEXT = "complaint_text";
	public static String FIELD_COMPLAINT_LOCATION = "complaint_location";
	public static String FIELD_COMPLAINT_IMAGE = "complaint_image";
	public static String FIELD_DATE_OF_REQUEST = "date_of_request";
	public static String FIELD_DATE_OF_COMPLETION = "date_of_completion";
	public static String FIELD_COMPLAINT_STATUS = "complaint_status";
	public static String FIELD_CURR_DEPT_ID = "curr_dept_id";
	public static String FIELD_REMARKS = "remarks";
	public static String FIELD_EXTRA_DATA = "extra_data";

	private static final long serialVersionUID = 1L;
	public final static ResourceMetaData metaData = new ResourceMetaData("complaint");

	static {
		metaData.setCheckBeforeAdd(false);
		metaData.setCheckBeforeUpdate(false);

		metaData.setAllow_duplicate_name(false);
		Field idField = new Field("id", "String");
		idField.setRequired(true);
		metaData.addField(idField);

		Field g_created_by_idField = new Field("g_created_by_id", "String");
		g_created_by_idField.setLength(128);
		metaData.addField(g_created_by_idField);

		Field g_created_by_nameField = new Field("g_created_by_name", "String");
		g_created_by_nameField.setLength(128);
		metaData.addField(g_created_by_nameField);

		Field g_modified_by_idField = new Field("g_modified_by_id", "String");
		g_modified_by_idField.setLength(128);
		metaData.addField(g_modified_by_idField);

		Field g_modified_by_nameField = new Field("g_modified_by_name", "String");
		g_modified_by_nameField.setLength(128);
		metaData.addField(g_modified_by_nameField);

		Field g_creation_timeField = new Field("g_creation_time", "long");
		metaData.addField(g_creation_timeField);

		Field g_modify_timeField = new Field("g_modify_time", "long");
		metaData.addField(g_modify_timeField);

		Field g_soft_deleteField = new Field("g_soft_delete", "String");
		g_soft_deleteField.setDefaultValue("N");
		g_soft_deleteField.setLength(1);
		metaData.addField(g_soft_deleteField);

		Field g_statusField = new Field("g_status", "String");
		g_statusField.setIndexed(true);
		g_statusField.setLength(32);
		metaData.addField(g_statusField);

		Field archivedField = new Field("archived", "String");
		archivedField.setIndexed(true);
		archivedField.setDefaultValue("N");
		archivedField.setLength(1);
		metaData.addField(archivedField);

		Field archived_timeField = new Field("archived_time", "long");
		metaData.addField(archived_timeField);

		Field citizen_emailField = new Field("citizen_email", "String");
		citizen_emailField.setRequired(true);
		metaData.addField(citizen_emailField);

		Field complaint_textField = new Field("complaint_text", "String");
		complaint_textField.setRequired(true);
		metaData.addField(complaint_textField);

		Field complaint_locationField = new Field("complaint_location", "String");
		complaint_locationField.setRequired(true);
		metaData.addField(complaint_locationField);

		Field complaint_imageField = new Field("complaint_image", "String");
		complaint_imageField.setFile(true);
		metaData.addField(complaint_imageField);

		Field date_of_requestField = new Field("date_of_request", "Date");
		date_of_requestField.setRequired(true);
		metaData.addField(date_of_requestField);

		Field date_of_completionField = new Field("date_of_completion", "Date");
		metaData.addField(date_of_completionField);

		Field complaint_statusField = new Field("complaint_status", "String");
		complaint_statusField.setEnum(true);
		complaint_statusField.setPossible_value("Complaint_status");
		complaint_statusField.setRequired(true);
		metaData.addField(complaint_statusField);

		Field curr_dept_idField = new Field("curr_dept_id", "String");
		metaData.addField(curr_dept_idField);

		Field remarksField = new Field("remarks", "String");
		metaData.addField(remarksField);

		Field extra_dataField = new Field("extra_data", "Map");
		extra_dataField.setValueType("Object");
		metaData.addField(extra_dataField);


		metaData.setTableName("complaint");

		metaData.setCluster("rasp_db");
	}

	public Complaint() {this.setId(Util.getUniqueId());}
	public Complaint(String id) {this.setId(id);}

	public Complaint(Complaint obj) {
		this.id = obj.id;
		this.g_created_by_id = obj.g_created_by_id;
		this.g_created_by_name = obj.g_created_by_name;
		this.g_modified_by_id = obj.g_modified_by_id;
		this.g_modified_by_name = obj.g_modified_by_name;
		this.g_creation_time = obj.g_creation_time;
		this.g_modify_time = obj.g_modify_time;
		this.g_soft_delete = obj.g_soft_delete;
		this.g_status = obj.g_status;
		this.archived = obj.archived;
		this.archived_time = obj.archived_time;
		this.citizen_email = obj.citizen_email;
		this.complaint_text = obj.complaint_text;
		this.complaint_location = obj.complaint_location;
		this.complaint_image = obj.complaint_image;
		this.date_of_request = obj.date_of_request;
		this.date_of_completion = obj.date_of_completion;
		this.complaint_status = obj.complaint_status;
		this.curr_dept_id = obj.curr_dept_id;
		this.remarks = obj.remarks;
		this.extra_data = obj.extra_data;
	}

	public ResourceMetaData getMetaData() {
		return metaData;
	}

	private void setDefaultValues() {
		if(g_soft_delete == null)
			g_soft_delete = "N";
		if(archived == null)
			archived = "N";
	}

	public Map<String, Object> convertResourceToMap(HashMap<String, Object> map) {
		if(id != null)
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(citizen_email != null)
			map.put("citizen_email", citizen_email);
		if(complaint_text != null)
			map.put("complaint_text", complaint_text);
		if(complaint_location != null)
			map.put("complaint_location", complaint_location);
		if(complaint_image != null)
			map.put("complaint_image", complaint_image);
		if(date_of_request != null)
			map.put("date_of_request", date_of_request);
		if(date_of_completion != null)
			map.put("date_of_completion", date_of_completion);
		if(complaint_status != null)
			map.put("complaint_status", complaint_status);
		if(curr_dept_id != null)
			map.put("curr_dept_id", curr_dept_id);
		if(remarks != null)
			map.put("remarks", remarks);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> validateAndConvertResourceToMap(HashMap<String,Object> map,boolean add) throws ApplicationException {
		if(validateId(add))
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(validateCitizen_email(add))
			map.put("citizen_email", citizen_email);
		if(validateComplaint_text(add))
			map.put("complaint_text", complaint_text);
		if(validateComplaint_location(add))
			map.put("complaint_location", complaint_location);
		if(complaint_image != null)
			map.put("complaint_image", complaint_image);
		if(validateDate_of_request(add))
			map.put("date_of_request", date_of_request);
		if(date_of_completion != null)
			map.put("date_of_completion", date_of_completion);
		if(validateComplaint_status(add))
			map.put("complaint_status", complaint_status);
		if(curr_dept_id != null)
			map.put("curr_dept_id", curr_dept_id);
		if(remarks != null)
			map.put("remarks", remarks);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> convertResourceToPrimaryMap(HashMap<String, Object> map) {
		return map;
	}

	@SuppressWarnings("unchecked")
	public void convertMapToResource(Map<String, Object> map) {
		id = (String) map.get("id");
		g_created_by_id = (String) map.get("g_created_by_id");
		g_created_by_name = (String) map.get("g_created_by_name");
		g_modified_by_id = (String) map.get("g_modified_by_id");
		g_modified_by_name = (String) map.get("g_modified_by_name");
		g_creation_time = (map.get("g_creation_time") == null ? null : ((Number) map.get("g_creation_time")).longValue());
		g_modify_time = (map.get("g_modify_time") == null ? null : ((Number) map.get("g_modify_time")).longValue());
		g_soft_delete = (String) map.get("g_soft_delete");
		g_status = (String) map.get("g_status");
		archived = (String) map.get("archived");
		archived_time = (map.get("archived_time") == null ? null : ((Number) map.get("archived_time")).longValue());
		citizen_email = (String) map.get("citizen_email");
		complaint_text = (String) map.get("complaint_text");
		complaint_location = (String) map.get("complaint_location");
		complaint_image = (String) map.get("complaint_image");
		date_of_request = (Date) map.get("date_of_request");
		date_of_completion = (Date) map.get("date_of_completion");
		complaint_status = (String) map.get("complaint_status");
        curr_dept_id = (String) map.get("curr_dept_id");
        remarks = (String) map.get("remarks");
		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	@SuppressWarnings("unchecked")
	public void convertTypeUnsafeMapToResource(Map<String, Object> map) {
		Object idObj = map.get("id");
		if(idObj != null)
			id = idObj.toString();

		Object g_created_by_idObj = map.get("g_created_by_id");
		if(g_created_by_idObj != null)
			g_created_by_id = g_created_by_idObj.toString();

		Object g_created_by_nameObj = map.get("g_created_by_name");
		if(g_created_by_nameObj != null)
			g_created_by_name = g_created_by_nameObj.toString();

		Object g_modified_by_idObj = map.get("g_modified_by_id");
		if(g_modified_by_idObj != null)
			g_modified_by_id = g_modified_by_idObj.toString();

		Object g_modified_by_nameObj = map.get("g_modified_by_name");
		if(g_modified_by_nameObj != null)
			g_modified_by_name = g_modified_by_nameObj.toString();

		Object g_creation_timeObj = map.get("g_creation_time");
		if(g_creation_timeObj != null)
			g_creation_time = new Long(g_creation_timeObj.toString());

		Object g_modify_timeObj = map.get("g_modify_time");
		if(g_modify_timeObj != null)
			g_modify_time = new Long(g_modify_timeObj.toString());

		Object g_soft_deleteObj = map.get("g_soft_delete");
		if(g_soft_deleteObj != null)
			g_soft_delete = g_soft_deleteObj.toString();

		Object g_statusObj = map.get("g_status");
		if(g_statusObj != null)
			g_status = g_statusObj.toString();

		Object archivedObj = map.get("archived");
		if(archivedObj != null)
			archived = archivedObj.toString();

		Object archived_timeObj = map.get("archived_time");
		if(archived_timeObj != null)
			archived_time = new Long(archived_timeObj.toString());

		Object citizen_emailObj = map.get("citizen_email");
		if(citizen_emailObj != null)
			citizen_email = citizen_emailObj.toString();

		Object complaint_textObj = map.get("complaint_text");
		if(complaint_textObj != null)
			complaint_text = complaint_textObj.toString();

		Object complaint_locationObj = map.get("complaint_location");
		if(complaint_locationObj != null)
			complaint_location = complaint_locationObj.toString();

		Object complaint_imageObj = map.get("complaint_image");
		if(complaint_imageObj != null)
			complaint_image = complaint_imageObj.toString();

		Object date_of_requestObj = map.get("date_of_request");
		if(date_of_requestObj != null)
			date_of_request = new Date(date_of_requestObj.toString());

		Object date_of_completionObj = map.get("date_of_completion");
		if(date_of_completionObj != null)
			date_of_completion = new Date(date_of_completionObj.toString());

		Object complaint_statusObj = map.get("complaint_status");
		if(complaint_statusObj != null)
			complaint_status = complaint_statusObj.toString();

		Object curr_dept_idObj = map.get("curr_dept_id");
		if(curr_dept_idObj != null)
            curr_dept_id = curr_dept_idObj.toString();

        Object remarksObj = map.get("remarks");
		if(remarksObj != null)
			remarks = remarksObj.toString();

		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	public void convertPrimaryMapToResource(Map<String, Object> map) {
	}

	public void convertTypeUnsafePrimaryMapToResource(Map<String, Object> map) {
	}

	public String getId() {
		return id;
	}

	public String getIdEx() {
		return id != null ? id : "";
	}

	public void setId(String id) {
		this.id = id;
	}

	public void unSetId() {
		this.id = null;
	}

	public boolean validateId(boolean add) throws ApplicationException {
		if(add && id == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[id]");
		return id != null;
	}

	public String getG_created_by_id() {
		return g_created_by_id;
	}

	public String getG_created_by_idEx() {
		return g_created_by_id != null ? g_created_by_id : "";
	}

	public void setG_created_by_id(String g_created_by_id) {
		this.g_created_by_id = g_created_by_id;
	}

	public void unSetG_created_by_id() {
		this.g_created_by_id = null;
	}

	public String getG_created_by_name() {
		return g_created_by_name;
	}

	public String getG_created_by_nameEx() {
		return g_created_by_name != null ? g_created_by_name : "";
	}

	public void setG_created_by_name(String g_created_by_name) {
		this.g_created_by_name = g_created_by_name;
	}

	public void unSetG_created_by_name() {
		this.g_created_by_name = null;
	}

	public String getG_modified_by_id() {
		return g_modified_by_id;
	}

	public String getG_modified_by_idEx() {
		return g_modified_by_id != null ? g_modified_by_id : "";
	}

	public void setG_modified_by_id(String g_modified_by_id) {
		this.g_modified_by_id = g_modified_by_id;
	}

	public void unSetG_modified_by_id() {
		this.g_modified_by_id = null;
	}

	public String getG_modified_by_name() {
		return g_modified_by_name;
	}

	public String getG_modified_by_nameEx() {
		return g_modified_by_name != null ? g_modified_by_name : "";
	}

	public void setG_modified_by_name(String g_modified_by_name) {
		this.g_modified_by_name = g_modified_by_name;
	}

	public void unSetG_modified_by_name() {
		this.g_modified_by_name = null;
	}

	public Long getG_creation_time() {
		return g_creation_time;
	}

	public long getG_creation_timeEx() {
		return g_creation_time != null ? g_creation_time : 0L;
	}

	public void setG_creation_time(long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	@JsonIgnore
	public void setG_creation_time(Long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	public void unSetG_creation_time() {
		this.g_creation_time = null;
	}

	public Long getG_modify_time() {
		return g_modify_time;
	}

	public long getG_modify_timeEx() {
		return g_modify_time != null ? g_modify_time : 0L;
	}

	public void setG_modify_time(long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	@JsonIgnore
	public void setG_modify_time(Long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	public void unSetG_modify_time() {
		this.g_modify_time = null;
	}

	public String getG_soft_delete() {
		return g_soft_delete != null ? g_soft_delete : "N";
	}

	public void setG_soft_delete(String g_soft_delete) {
		this.g_soft_delete = g_soft_delete;
	}

	public void unSetG_soft_delete() {
		this.g_soft_delete = "N";
	}

	public String getG_status() {
		return g_status;
	}

	public String getG_statusEx() {
		return g_status != null ? g_status : "";
	}

	public void setG_status(String g_status) {
		this.g_status = g_status;
	}

	public void unSetG_status() {
		this.g_status = null;
	}

	public String getArchived() {
		return archived != null ? archived : "N";
	}

	public void setArchived(String archived) {
		this.archived = archived;
	}

	public void unSetArchived() {
		this.archived = "N";
	}

	public Long getArchived_time() {
		return archived_time;
	}

	public long getArchived_timeEx() {
		return archived_time != null ? archived_time : 0L;
	}

	public void setArchived_time(long archived_time) {
		this.archived_time = archived_time;
	}

	@JsonIgnore
	public void setArchived_time(Long archived_time) {
		this.archived_time = archived_time;
	}

	public void unSetArchived_time() {
		this.archived_time = null;
	}

	public String getCitizen_email() {
		return citizen_email;
	}

	public String getCitizen_emailEx() {
		return citizen_email != null ? citizen_email : "";
	}

	public void setCitizen_email(String citizen_email) {
		this.citizen_email = citizen_email;
	}

	public void unSetCitizen_email() {
		this.citizen_email = null;
	}

	public boolean validateCitizen_email(boolean add) throws ApplicationException {
		if(add && citizen_email == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[citizen_email]");
		return citizen_email != null;
	}

	public String getComplaint_text() {
		return complaint_text;
	}

	public String getComplaint_textEx() {
		return complaint_text != null ? complaint_text : "";
	}

	public void setComplaint_text(String complaint_text) {
		this.complaint_text = complaint_text;
	}

	public void unSetComplaint_text() {
		this.complaint_text = null;
	}

	public boolean validateComplaint_text(boolean add) throws ApplicationException {
		if(add && complaint_text == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[complaint_text]");
		return complaint_text != null;
	}

	public String getComplaint_location() {
		return complaint_location;
	}

	public String getComplaint_locationEx() {
		return complaint_location != null ? complaint_location : "";
	}

	public void setComplaint_location(String complaint_location) {
		this.complaint_location = complaint_location;
	}

	public void unSetComplaint_location() {
		this.complaint_location = null;
	}

	public boolean validateComplaint_location(boolean add) throws ApplicationException {
		if(add && complaint_location == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[complaint_location]");
		return complaint_location != null;
	}

	public String getComplaint_image() {
		return complaint_image;
	}

	public String getComplaint_imageEx() {
		return complaint_image != null ? complaint_image : "";
	}

	public void setComplaint_image(String complaint_image) {
		this.complaint_image = complaint_image;
	}

	public void unSetComplaint_image() {
		this.complaint_image = null;
	}

	public Date getDate_of_request() {
		return date_of_request;
	}

	public void setDate_of_request(Date date_of_request) {
		this.date_of_request = date_of_request;
	}

	public void unSetDate_of_request() {
		this.date_of_request = null;
	}

	public boolean validateDate_of_request(boolean add) throws ApplicationException {
		if(add && date_of_request == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[date_of_request]");
		return date_of_request != null;
	}

	public Date getDate_of_completion() {
		return date_of_completion;
	}

	public void setDate_of_completion(Date date_of_completion) {
		this.date_of_completion = date_of_completion;
	}

	public void unSetDate_of_completion() {
		this.date_of_completion = null;
	}

	public String getComplaint_status() {
		return complaint_status;
	}

	public String getComplaint_statusEx() {
		return complaint_status != null ? complaint_status : "";
	}

	public void setComplaint_status(String complaint_status) {
		this.complaint_status = complaint_status;
	}

	public void unSetComplaint_status() {
		this.complaint_status = null;
	}

	public boolean validateComplaint_status(boolean add) throws ApplicationException {
		if(add && complaint_status == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[complaint_status]");
		return complaint_status != null;
	}

	public String getCurr_dept_id() {
		return curr_dept_id;
	}

	public void setCurr_dept_id(String curr_dept_id) {
		this.curr_dept_id = curr_dept_id;
	}

	public void unSetCurr_dept_id() {
		this.curr_dept_id = null;
	}

	public String getRemarks() {
		return remarks;
	}

	public String getRemarksEx() {
		return remarks != null ? remarks : "";
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public void unSetRemarks() {
		this.remarks = null;
	}

	public Map<String, Object> getExtra_data() {
		return extra_data;
	}

	public Object getExtra_data(String key) {
		return extra_data == null ? null : extra_data.get(key);
	}

	public void setExtra_data(Map<String, Object> extra_data) {
		this.extra_data = extra_data;
	}

	public void setExtra_data(String key, Object value) {
		if(extra_data == null)
			extra_data = new HashMap<String, Object>();
		extra_data.put(key, value);
	}

	public void unSetExtra_data() {
		this.extra_data = null;
	}
	public String getCluster() {
		return "rasp_db";
	}
	public String getClusterType() {
		return "REPLICATED";
	}
	public  Class<?> getResultClass() {return ComplaintResult.class;};
	public  Class<?> getMessageClass() {return ComplaintMessage.class;};
	public  Class<?> getHelperClass() {return ComplaintHelper.class;};
	public  Class<?> getServiceClass() {return ComplaintService.class;};
}