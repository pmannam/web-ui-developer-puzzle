import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { okReadsConstant, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>(`${okReadsConstant.API.READING_LIST_API}`)
          .pipe(
            map((data) =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            ),
            catchError((error) =>
              of(ReadingListActions.loadReadingListError({ error: okReadsConstant.ERROR_TEXT }))
            )
          )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) => {
        const addedBook = {
          ...book,
          isAdded: true
        };
        return this.http
          .post(`${okReadsConstant.API.READING_LIST_API}`, addedBook)
          .pipe(
            map(() =>
              ReadingListActions.confirmedAddToReadingList({ book: addedBook })
            ),
            catchError((error) =>
              of(ReadingListActions.failedAddToReadingList({ error: okReadsConstant.ERROR_TEXT }))
            )
          );
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http
          .delete(`${okReadsConstant.API.READING_LIST_API}/${item.bookId}`)
          .pipe(
            map(() =>
              ReadingListActions.confirmedRemoveFromReadingList({ item })
            ),
            catchError((error) =>
              of(ReadingListActions.failedRemoveFromReadingList({ error: okReadsConstant.ERROR_TEXT }))
            )
          )
      )
    )
  );

  markBookAsFinished$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.markBookAsFinished),
      concatMap(({ item }) => {
        const finishedBook = {
          ...item,
          finished: true,
          finishedDate: new Date().toISOString()
        };
        return this.http
          .put(
            `${okReadsConstant.API.READING_LIST_API}/${item.bookId}/${okReadsConstant.FINISHED}`,
            finishedBook
          )
          .pipe(
            map(() =>
              ReadingListActions.confirmedMarkBookAsFinished({
                item: finishedBook
              })
            ),
            catchError(() =>
              of(
                ReadingListActions.failedMarkBookAsFinished({
                  error: okReadsConstant.ERROR_TEXT
                })
              )
            )
          );
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
