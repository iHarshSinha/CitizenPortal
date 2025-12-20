class DepartmentModel {
  private _id: any;
  private _dept_id: any;
  private _dept_name: any;
  private _dept_email: any;

  constructor(data: any) {
    this._id = data["id"];
    this._dept_id = data["dept_id"];
    this._dept_name = data["dept_name"];
    this._dept_email = data["dept_email"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getdept_id(): any {
    return this._dept_id;
  }

  public setdept_id(value: any) {
    this._dept_id = value;
  }

  public getdept_name(): any {
    return this._dept_name;
  }

  public setdept_name(value: any) {
    this._dept_name = value;
  }

  public getdept_email(): any {
    return this._dept_email;
  }

  public setdept_email(value: any) {
    this._dept_email = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "dept_id": this._dept_id,
      "dept_name": this._dept_name,
      "dept_email": this._dept_email,
    };
  }

  public static fromJson(json: any): DepartmentModel {
    return new DepartmentModel(json);
  }
}

export default DepartmentModel;
