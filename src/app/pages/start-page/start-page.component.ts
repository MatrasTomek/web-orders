import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  actualTime = new Date();
  // userName: string;

  constructor(public fbAuth: AngularFireAuth, public auth: AuthService) {
    // this.userName = fbAuth.currentUser;
  }
}
