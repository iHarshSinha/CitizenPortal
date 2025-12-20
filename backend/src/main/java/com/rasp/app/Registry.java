package com.rasp.app;
import platform.helper.HelperManager;
import platform.webservice.ServiceManager;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;
public class Registry {
		public static void register(){
				 HelperManager.getInstance().register(ResourceRoleHelper.getInstance());
				 HelperManager.getInstance().register(RoleResourcePermissionHelper.getInstance());
				 HelperManager.getInstance().register(RoleUserResInstanceHelper.getInstance());
				 HelperManager.getInstance().register(CitizenHelper.getInstance());
				 HelperManager.getInstance().register(UsersHelper.getInstance());
				 HelperManager.getInstance().register(TestHelper.getInstance());
				 HelperManager.getInstance().register(ComplaintHelper.getInstance());
				 HelperManager.getInstance().register(DepartmentHelper.getInstance());
				 HelperManager.getInstance().register(AdminHelper.getInstance());
				 ServiceManager.getInstance().register(new ResourceRoleService());
				 ServiceManager.getInstance().register(new RoleResourcePermissionService());
				 ServiceManager.getInstance().register(new RoleUserResInstanceService());
				 ServiceManager.getInstance().register(new CitizenService());
				 ServiceManager.getInstance().register(new UsersService());
				 ServiceManager.getInstance().register(new TestService());
				 ServiceManager.getInstance().register(new ComplaintService());
				 ServiceManager.getInstance().register(new DepartmentService());
				 ServiceManager.getInstance().register(new AdminService());
		}
}
