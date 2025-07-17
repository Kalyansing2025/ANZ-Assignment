import { OnInit } from '@angular/core';
import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  animations: [appModuleAnimation()]

})
export class CustomerComponent extends  AppComponentBase  {

constructor(
        injector: Injector
    ) {
        super(injector);
    }

}
