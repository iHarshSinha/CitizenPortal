class CitizenModel {
  private _id: any;
  private _citizen_id: any;
  private _aadhar_id: any;
  private _name: any;
  private _dob: any;
  private _gender: any;
  private _phone_no: any;
  private _email: any;

  constructor(data: any) {
    this._id = data["id"];
    this._citizen_id = data["citizen_id"];
    this._aadhar_id = data["aadhar_id"];
    this._name = data["name"];
    this._dob = data["dob"];
    this._gender = data["gender"];
    this._phone_no = data["phone_no"];
    this._email = data["email"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getcitizen_id(): any {
    return this._citizen_id;
  }

  public setcitizen_id(value: any) {
    this._citizen_id = value;
  }

  public getaadhar_id(): any {
    return this._aadhar_id;
  }

  public setaadhar_id(value: any) {
    this._aadhar_id = value;
  }

  public getname(): any {
    return this._name;
  }

  public setname(value: any) {
    this._name = value;
  }

  public getdob(): any {
    return this._dob;
  }

  public setdob(value: any) {
    this._dob = value;
  }

  public getgender(): any {
    return this._gender;
  }

  public setgender(value: any) {
    this._gender = value;
  }

  public getphone_no(): any {
    return this._phone_no;
  }

  public setphone_no(value: any) {
    this._phone_no = value;
  }

  public getemail(): any {
    return this._email;
  }

  public setemail(value: any) {
    this._email = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "citizen_id": this._citizen_id,
      "aadhar_id": this._aadhar_id,
      "name": this._name,
      "dob": this._dob,
      "gender": this._gender,
      "phone_no": this._phone_no,
      "email": this._email,
    };
  }

  public static fromJson(json: any): CitizenModel {
    return new CitizenModel(json);
  }
}

export default CitizenModel;
