import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthenticationService } from '../../../../../common/service/authentication.service';

import { map, Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  feedbackControl = new FormControl<string>('', { nonNullable: true });
  sendFeedback$: Observable<void>;
  sendingFeedback = false;
  constructor(public authenticationService: AuthenticationService, private snackbarService: MatSnackBar) { }
  sendFeedback(matTrigger: MatMenuTrigger) {
    if (this.feedbackControl.value) {
      this.sendingFeedback = true;
      this.sendFeedback$ = this.authenticationService.sendFeedback(this.feedbackControl.value).pipe(
        map(() => void 0),
        tap(() => {
          matTrigger.closeMenu();
          this.sendingFeedback = false;
          this.feedbackControl.setValue('');
          this.snackbarService.open("Feedback submitted");
        }));
    }
    else {
      matTrigger.closeMenu();
    }
  }
}