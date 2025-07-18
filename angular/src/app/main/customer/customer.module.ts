import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import { CreateCustomerModalComponent } from './customer-modal.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {CustomerComponent} from './customer.component';
import { EditCustomerModalComponent } from './edit-customer-modal.component';


@NgModule({
    declarations: [CustomerComponent,CreateCustomerModalComponent,EditCustomerModalComponent],
    imports: [AppSharedModule, CustomerRoutingModule]
})
export class CustomerModule {}
