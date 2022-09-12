import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  departments: any[] = [];
  employees: any[] = [];

  modalTitle = '';
  employeeId = 0;
  employeeName = '';
  department = '';
  dateOfJoining = '';
  photoFileName = 'anonymous.jpg';
  photoPath = environment.PHOTO_URL;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this._http.get<any[]>(environment.API_URL + 'employee').subscribe((res) => {
      this.employees = res;
    });

    this._http.get<any[]>(environment.API_URL + 'department')
      .subscribe((res) => {
        this.departments = res;
      });
  }

  addClick() {
    this.modalTitle = 'Add Employee';
    this.employeeId = 0;
    this.employeeName = '';
    this.department = '';
    this.dateOfJoining = '';
    this.photoFileName = 'anonymous.jpg';
  }

  editClick(emp: any) {
    this.modalTitle = 'Edit Employee';
    this.employeeId = emp.EmployeeId;
    this.employeeName = emp.EmployeeName;
    this.department = emp.Department;
    this.dateOfJoining = emp.DateOfJoining;
    this.photoFileName = emp.PhotoFileName;
  }

  createClick() {
    let dep = {
      EmployeeName: this.employeeName,
      Department: this.department,
      DateOfJoining: this.dateOfJoining,
      PhotoFileName: this.photoFileName,
    };

    this._http.post(environment.API_URL + 'employee', dep).subscribe((res) => {
      this.refreshList();
    });
  }

  updateClick() {
    let dep = {
      EmployeeId: this.employeeId,
      EmployeeName: this.employeeName,
      Department: this.department,
      DateOfJoining: this.dateOfJoining,
      PhotoFileName: this.photoFileName,
    };
    
    this._http.put(environment.API_URL + 'employee', dep).subscribe((res) => {
      this.refreshList();
    });
  }

  deleteClick(id: any) {
    if (confirm('Are you sure?')) {
      this._http
        .delete(environment.API_URL + 'employee/' + id)
        .subscribe((res) => {
          this.refreshList();
        });
    }
  }

  imageUpload(event: any) {
    let file = event.target.files[0];
    const formData: FormData = new FormData();

    formData.append('file', file, file.filename);

    this._http
      .post(environment.API_URL + 'employee/savefile', formData)
      .subscribe((res: any) => {
        this.photoFileName = res.file_name;
      });
  }
}
