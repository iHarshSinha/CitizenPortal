/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import platform.webservice.BasePossibleValue;
import platform.webservice.Enum;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
public class ComplaintStatus extends BasePossibleValue {
		public static String ID_pending = "pending";
		public static String NAME_pending = "pending";
		public static String ID_assigned = "assigned";
		public static String NAME_assigned = "assigned";
		public static String ID_completed = "completed";
		public static String NAME_completed = "completed";
		public ComplaintStatus() {super("COMPLAINT_STATUS");}
		protected void populate() {
 			add(new Enum(ID_pending,NAME_pending));
 			add(new Enum(ID_assigned,NAME_assigned));
 			add(new Enum(ID_completed,NAME_completed));
		}
}