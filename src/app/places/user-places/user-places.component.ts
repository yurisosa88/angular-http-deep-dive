import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import {  HttpErrorResponse } from '@angular/common/http';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  //favoritePlaces = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  errorRes = signal('');
  //private httpClient = inject(HttpClient);
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  favoritePlaces = this.placesService.loadedUserPlaces;

  ngOnInit(): void {
    const subscription = this.placesService.loadUserPlaces()
    .subscribe({
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

  onDeleteFavorite(place:Place) {
    this.placesService.removeUserPlace(place).subscribe({
      next: (response) => console.log(response)
    })
  }

}
