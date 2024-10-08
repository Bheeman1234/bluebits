import { Component, OnInit } from '@angular/core';
import { UsersService } from '@bluebits/users';

@Component({
  selector: 'ng-shop-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ng-shop';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
      this.usersService.initAppSession();
  }
}
