import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  errorRes = signal('');
  //private httpClient = inject(HttpClient);
  private placesServices = inject(PlacesService);
  private destroyRef = inject(DestroyRef); 

  ngOnInit(): void {
    this.isFetching.set(true);
    // this.httpClient.get<{places:Place[]}>('http://localhost:3000/places')
    // .pipe(
    //   map( (resData) => resData.places )
    // )
    // .subscribe( (places) => {
    //   this.places.set(places);
    //   this.isFetching.set(false)
    // },
    // (error:HttpErrorResponse) => {
    //   this.errorRes.set(error.message)
    // });

    const subscription = this.placesServices.loadAvailablePlaces()
    .subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (error:HttpErrorResponse) => {
        this.errorRes.set(error.message)
      },
      complete: () => {
        this.isFetching.set(false)
      }
    });

    this.destroyRef.onDestroy( () => {
      subscription.unsubscribe();
    });

  }

  onSelectPlace(selectedPlace:Place){
    const subscription = this.placesServices.addPlaceToUserPlaces(selectedPlace).subscribe();

    this.destroyRef.onDestroy( () => {
      subscription.unsubscribe();
    });

  }

}
