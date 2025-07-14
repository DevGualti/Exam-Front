import { Component, OnInit } from '@angular/core';
import { BikeModel, BikeModelService } from '../../services/bike-model.service';

@Component({
    selector: 'app-bike-list',
    templateUrl: './bike-list.component.html',
    styleUrls: ['./bike-list.component.scss', '../../app.component.scss']
})
export class BikeListComponent implements OnInit {
    bikes: BikeModel[] = [];

    constructor(protected bikeModelSrv: BikeModelService) { }

    ngOnInit(): void {
        this.bikeModelSrv.getBikeModels().subscribe(bikes => {
            this.bikes = bikes
        });
    }

    currentIndex = 0;
    visibleCount = 3;

    get visibleBikes() {
        return this.bikes.slice(this.currentIndex, this.currentIndex + this.visibleCount);
    }

    prev() {
        if (this.currentIndex > 0) this.currentIndex--;
    }

    next() {
        if (this.currentIndex < this.bikes.length - this.visibleCount) this.currentIndex++;
    }
}