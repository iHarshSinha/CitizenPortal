class ComplaintModel {
  private _id: any;
  // private _complaint_id: any;
  private _citizen_email: any;
  private _complaint_text: any;
  private _complaint_location: any;
  private _complaint_image: any;
  private _date_of_request: any;
  private _date_of_completion: any;
  private _complaint_status: any;
  private _curr_dept_id: any;
  private _remarks: any;

  constructor(data: any) {
    this._id = data["id"];
    // this._complaint_id = data["complaint_id"];
    this._citizen_email = data["citizen_email"];
    this._complaint_text = data["complaint_text"];
    this._complaint_location = data["complaint_location"];
    this._complaint_image = data["complaint_image"];
    this._date_of_request = data["date_of_request"];
    this._date_of_completion = data["date_of_completion"];
    this._complaint_status = data["complaint_status"];
    this._curr_dept_id = data["curr_dept_id"];
    this._remarks = data["remarks"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

        // public getcomplaint_id(): any {
        //   return this._complaint_id;
        // }

        // public setcomplaint_id(value: any) {
        //   this._complaint_id = value;
        // }

  public getcitizen_email(): any {
    return this._citizen_email;
  }

  public setcitizen_email(value: any) {
    this._citizen_email = value;
  }

  public getcomplaint_text(): any {
    return this._complaint_text;
  }

  public setcomplaint_text(value: any) {
    this._complaint_text = value;
  }

  public getcomplaint_location(): any {
    return this._complaint_location;
  }

  public setcomplaint_location(value: any) {
    this._complaint_location = value;
  }

  public getcomplaint_image(): any {
    return this._complaint_image;
  }

  public setcomplaint_image(value: any) {
    this._complaint_image = value;
  }

  public getdate_of_request(): any {
    return this._date_of_request;
  }

  public setdate_of_request(value: any) {
    this._date_of_request = value;
  }

  public getdate_of_completion(): any {
    return this._date_of_completion;
  }

  public setdate_of_completion(value: any) {
    this._date_of_completion = value;
  }

  public getcomplaint_status(): any {
    return this._complaint_status;
  }

  public setcomplaint_status(value: any) {
    this._complaint_status = value;
  }

  public getcurr_dept_id(): any {
    return this._curr_dept_id;
  }

  public setcurr_dept_id(value: any) {
    this._curr_dept_id = value;
  }

  public getremarks(): any {
    return this._remarks;
  }

  public setremarks(value: any) {
    this._remarks = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      // "complaint_id": this._complaint_id,
      "citizen_email": this._citizen_email,
      "complaint_text": this._complaint_text,
      "complaint_location": this._complaint_location,
      "complaint_image": this._complaint_image,
      "date_of_request": this._date_of_request,
      "date_of_completion": this._date_of_completion,
      "complaint_status": this._complaint_status,
      "curr_dept_id": this._curr_dept_id,
      "remarks": this._remarks,
    };
  }

  public static fromJson(json: any): ComplaintModel {
    return new ComplaintModel(json);
  }
}

export default ComplaintModel;
