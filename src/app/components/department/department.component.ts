import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];

  modalTitle = '';
  departmentId = 0;
  departmentName = '';

  departmentIdFilter = "";
  departmentNameFilter ="";
  departmentWitOutFilter: any[] = [];

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this._http
      .get<any[]>(environment.API_URL + 'department')
      .subscribe((res) => {
        this.departments = res;
        this.departmentWitOutFilter = res;
      });
  }

  addClick() {
    this.modalTitle = 'Add Department';
    this.departmentId = 0;
    this.departmentName = '';
  }

  editClick(dep: any) {
    this.modalTitle = 'Edit Department';
    this.departmentId = dep.DepartmentId;
    this.departmentName = dep.DepartmentName;
  }

  createClick() {
    let dep = {
      DepartmentName: this.departmentName,
    };

    this._http
      .post(environment.API_URL + 'department', dep)
      .subscribe((res) => {
        console.log(res);
        this.refreshList();
      });
  }

  updateClick() {
    let dep = {
      DepartmentId: this.departmentId,
      DepartmentName: this.departmentName,
    };

    this._http.put(environment.API_URL + 'department', dep).subscribe((res) => {
      console.log(res);
      this.refreshList();
    });
  }

  deleteClick(id: any) {
    if (confirm('Are you sure?')) {
      this._http
        .delete(environment.API_URL + 'department/' + id)
        .subscribe((res) => {
          console.log(res);
          this.refreshList();
        });
    }
  }

  filterFn() {
    let departmentIdFilter = this.departmentIdFilter;
    let departmentNameFilter = this.departmentNameFilter;

    this.departments = this.departmentWitOutFilter.filter((el: any) => {
      return el.DepartmentId.toString().toLowerCase().includes(
        departmentIdFilter.toString().trim().toLowerCase()
      ) &&
      el.DepartmentName.toString().toLowerCase().includes(
        departmentNameFilter.toString().trim().toLowerCase()
      );
    });
  }

  sortResult(prop: any, asc: any) {
    this.departments = this.departmentWitOutFilter.sort((a: any, b: any) =>{
      if (asc) {
        return (a[prop]>b[prop]) ? 1 : ((a[prop]<b[prop]) ? -1 : 0);
      } else {
        return (b[prop]>a[prop]) ? 1 : ((b[prop]<a[prop]) ? -1 : 0);;
      }
    });
  }
}
