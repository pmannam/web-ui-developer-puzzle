import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap
} from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { okReadsConstant } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(`${okReadsConstant.API.READING_LIST_API}`).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, showSnackBar }) => {
        const addedBook = {
          ...book,
          isAdded: true
        };
        return this.http.post(`${okReadsConstant.API.READING_LIST_API}`, addedBook).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList({
              book: addedBook,
              showSnackBar
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        );
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) =>
        this.http.delete(`${okReadsConstant.API.READING_LIST_API}/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({
              item,
              showSnackBar
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType: okReadsConstant.SNACKBAR_CONSTANTS.ADD,
          item: { bookId: action.book.id, ...action.book }
        })
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType:  okReadsConstant.SNACKBAR_CONSTANTS.REMOVE,
          item: action.item
        })
      )
    )
  );

  openSnackBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.showSnackBar),
      switchMap((action) => {
        const title = action.item.title;
        const { actionType, item } = action;
        return this.snackBar
          .open(
            actionType ===  okReadsConstant.SNACKBAR_CONSTANTS.ADD
              ? `${title} - ${ okReadsConstant.SNACKBAR_CONSTANTS.BOOK_ADDED_TEXT}`
              : `${title} - ${ okReadsConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_TEXT}`,
              okReadsConstant.SNACKBAR_CONSTANTS.UNDO,
            {
              duration:  okReadsConstant.SNACKBAR_CONSTANTS.DURATION,
              panelClass:
                actionType ===  okReadsConstant.SNACKBAR_CONSTANTS.ADD ?  okReadsConstant.SNACKBAR_CONSTANTS.BOOK_ADDED_CLASS :  okReadsConstant.SNACKBAR_CONSTANTS.BOOK_REMOVED_CLASS
            }
          )
          .onAction()
          .pipe(
            map(() =>
              actionType ===  okReadsConstant.SNACKBAR_CONSTANTS.ADD
                ? ReadingListActions.removeFromReadingList({
                    item,
                    showSnackBar: false
                  })
                : ReadingListActions.addToReadingList({
                    book: { id: item.bookId, ...item },
                    showSnackBar: false
                  })
            )
          );
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}
}