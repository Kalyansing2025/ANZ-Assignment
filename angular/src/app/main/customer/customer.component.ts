import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AddUserInput, CustomerListDto, CustomerServiceProxy, User, UserViewDto } from '@shared/service-proxies/service-proxies';
import { remove as _remove } from 'lodash-es';
import * as _ from 'lodash';


@Component({
    templateUrl: './customer.component.html',
    styleUrls:['./customer.component.css'],
    animations: [appModuleAnimation()]
})
export class CustomerComponent extends AppComponentBase implements OnInit {

    customer: CustomerListDto[] = [];
    filter: string = '';
    filter2: string = '';
    editingCustomer: CustomerListDto = null;
    newUser: AddUserInput = null;
    user: User[] = [];
    custUser: UserViewDto[] = [];
    isDeleted = [];
    check = false;
    parentSelect: boolean = false;


    constructor(
        injector: Injector,
        private _customerService: CustomerServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getCustomer();
        this.getUser();
    }

    getCustomer(): void {
        this._customerService.getCustomer(this.filter).subscribe((result) => {
            this.customer = result.items;
        });
    }

    deleteCustomer(customer: CustomerListDto): void {
        this.message.confirm(
            this.l('AreYouSureToDeleteThePerson', customer.customerName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._customerService.deleteCustomer(customer.id).subscribe(() => {
                        this.notify.info(this.l('SuccessfullyDeleted'));
                        _remove(this.customer, customer);
                    });
                }
            }
        );
    }

    editCustomer(customer: CustomerListDto): void {
        if (customer === this.editingCustomer) {
            this.editingCustomer = null;
        } else {
            this.editingCustomer = new CustomerListDto();
            this.editingCustomer.custUsers = [];
            this.editingCustomer = customer;

            this.newUser = new AddUserInput();

            this.newUser.customerRefId = customer.id;
        }
    };

    deleteUser(user, customer): void {
        this._customerService.deleteUser(user.id).subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            _.remove(customer.custUsers, user);
        });
    };

    saveUser(): void {
        if (!this.newUser.customerRefId && !this.newUser.userRefId) {
            this.message.warn('Please enter a number!');
            return;
        }
        this._customerService.addUser(this.newUser).subscribe((result) => {
            this.editingCustomer.custUsers.push(result);
            console.log(result);
            this.notify.success(this.l('SavedSuccessfully'));
        });
    };
    getUser() {
        this._customerService.getUsers(this.filter2).subscribe((result) => {
            this.user = result.items;
            console.log("user=", this.user);
        });
    }
    viewUser(customerId) {
        this._customerService.getUserView(customerId).subscribe((result: any) => {
            console.log("custuser=", result);
            this.custUser = result;
        })
    }

    value($event) {
        const id = $event.target.value;
        const idChecked = $event.target.checked;
        console.log(id, idChecked);

        this.customer = this.customer.map((d) => {
            if (d.id == id) {
                d.selected = idChecked;
                this.parentSelect = false;
                this.isDeleted.push(d.id);
                return d;
            }

            if (id == -1) {
                d.selected = this.parentSelect;
                //this.isDeleted.push(d.id);
                return d;
            }
            return d;
        })
        console.log(this.customer);
    }

    deleteCustomerSelected() {
        console.log("customer=", this.customer);
        this._customerService.deleteMultipleCustomer(this.isDeleted).subscribe(() => {
            this.isDeleted.forEach(element => {
                console.log("selected", element.selected);
                if (element.selected == true) {
                    _.remove(this.customer, element);
                }
            })
        });
    }

}