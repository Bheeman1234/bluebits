import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';
import { LocalStorageService } from '../services/localstorage.service';
import { UsersService } from '../services/users.service';

import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {

  buildUserSession$ = createEffect(() => this.actions$.pipe(
    ofType(UsersActions.buildUserSession),
    concatMap(() => {
      if(this.localStorageService.isValidToken()) {
        const userId = this.localStorageService.getUserIdFromToken();
        if(userId) {
          return this.userService.getUser(userId).pipe(
            map((user) => {
              return UsersActions.buildUserSessionSuccess({user: user});
            }),
            catchError(() => of(UsersActions.buildUserSessionFailed()))
          )
        } else {
          return of(UsersActions.buildUserSessionFailed())
        }
      }
      else {
        return of(UsersActions.buildUserSessionFailed())
      }
    })
  ))

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private userService: UsersService
    ) {}
}
