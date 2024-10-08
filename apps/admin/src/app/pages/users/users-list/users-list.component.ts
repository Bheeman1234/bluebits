import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
    ) { }

  ngOnInit(): void {
   this._getUsers();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(() => {
          this._getUsers();
          this.messageService.add({severity:'success', summary:'Success', detail:'User is deleted'});
        },
        () => {
          this.messageService.add({severity:'error', summary:'Error', detail:'User is not deleted'});
         }
        )
      },
      reject: (type) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
  });

  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }


  private _getUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    })
  }

  getCountryName(countryKey: string) {
    if(countryKey) return this.usersService.getCountry(countryKey);
  }


}
