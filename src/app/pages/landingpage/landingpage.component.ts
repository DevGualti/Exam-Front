import { Component, OnInit } from '@angular/core';
// import { Store, StoreService } from '../../services/store.service'; // RIMOSSO

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss', '../../app.component.scss'],
})
export class LandingpageComponent implements OnInit {
    // stores: Store[] = []; // RIMOSSO

    constructor() { } // RIMOSSO storeSrv
    ngOnInit(): void {
        // this.storeSrv.getStores().subscribe(stores => {
        //     this.stores = stores;
        // });
    }
}
