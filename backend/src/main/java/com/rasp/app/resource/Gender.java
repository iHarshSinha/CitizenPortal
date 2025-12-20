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
public class Gender extends BasePossibleValue {
		public static String ID_male = "male";
		public static String NAME_male = "male";
		public static String ID_female = "female";
		public static String NAME_female = "female";
		public static String ID_other = "other";
		public static String NAME_other = "other";
		public Gender() {super("GENDER");}
		protected void populate() {
 			add(new Enum(ID_male,NAME_male));
 			add(new Enum(ID_female,NAME_female));
 			add(new Enum(ID_other,NAME_other));
		}
}