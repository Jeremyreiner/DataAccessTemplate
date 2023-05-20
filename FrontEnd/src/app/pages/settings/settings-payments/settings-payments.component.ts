import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {StripeService, StripeCardComponent} from 'ngx-stripe';
import {StripeCardElementOptions, StripeElementsOptions} from '@stripe/stripe-js';
import {MatDialog} from '@angular/material/dialog';
import {
  BankAccountDialogComponent, CardOptionsDialogComponent,
  CreditCardDialogComponent,
} from '../../../dialogs';
import {ApiService, DialogService, StorageService} from '../../../services';
import {CardModel, DialogConfig, UserModel} from '../../../models';
import {EditCardDialogComponent} from './edit-card-dialog';
import {ConnectAccountDialogComponent} from './connect-account-dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ModalController} from '@ionic/angular';
import {Platform} from '@angular/cdk/platform';
import {car} from "ionicons/icons";

@Component({
  selector: 'app-settings-payments',
  templateUrl: './settings-payments.component.html',
  styleUrls: ['./settings-payments.component.scss'],
})

export class SettingsPaymentsComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: '"nunito", sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgb(182,182,182)'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  stripeTest: FormGroup;
  paymentMethods: [];
  connected = false;
  connectedAccountUrl = '';
  cards: CardModel[] = [];
  showStatus = false;
  isLoading = true;
  user: UserModel;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private api: ApiService,
    private modalCtrl: ModalController,
    private dialogService: DialogService,
    private storageService: StorageService,
  ) {}


  async openModal() {
    const platform = Platform.name;
    console.log(platform);

    const width = window.innerWidth;

    const modalClass = width > 500? 'modal-desktop':'modal-mobile';


    const modal = await this.modalCtrl.create({
      component: CreditCardDialogComponent,
      cssClass: modalClass
    });
    modal.present();

   // const { data, role } = await modal.onWillDismiss();
  }

  async ngOnInit() {
    this.user = this.storageService.getUser();
    if(this.user.isTeacher) {
      this.connected = await this.getStripeConnectionStatus();
      if (!this.connected) {
        this.connectedAccountUrl = await this.getConnectedAccountLink();
      } else {
        await this.getCards();
      }
      this.showStatus = true;
    }
    // todo if connected is false display dialog that stripe isn't connected
    await this.getCards();
    this.isLoading = false;
  }

  async getStripeConnectionStatus(): Promise<boolean> {
    return await this.api.checkHasDetailsSubmitted();
  }

  async getConnectedAccountLink(): Promise<string> {
    return await this.api.createConnectedAccountLink();
  }

  async openCreditCardDialog() {
    const dialog = new DialogConfig(CreditCardDialogComponent);
    dialog.afterClosed = async (res) => {
      if(res.data) {
        await this.getCards();
      }
    }
    await this.dialogService.openDialog(dialog);
  }


  async getCards() {
    this.isLoading = true;
    const cards = await this.api.getAllCards();
    cards?.sort((a, b) => {
      if (a.isDefaultPaymentMethod === b.isDefaultPaymentMethod) {
        return 0;
      } else if (a.isDefaultPaymentMethod) {
        return -1;
      } else {
        return 1;
      }
    });
    this.isLoading = false;
    this.cards = cards;
  }

  createToken(): void {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, {name})
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  openEditCardDialog(card: CardModel) {
     const dialogRef =  this.dialog.open(EditCardDialogComponent,  {
        width: '500px',
        data: card,
      });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.getCards();
      }
    });
  }

  async openCardOptionsDialog(card: CardModel) {
    const index = this.cards.indexOf(card);


    let dialog = new DialogConfig(CardOptionsDialogComponent, {cards: this.cards, index: index});

    dialog.afterClosed = async (res) => {
      if(res?.data === 'deleted') {
        this.cards.splice(index, 1);
      }
      if (res?.data === 'default') {
        if(index !== -1) {
          this.cards.forEach(a => a.isDefaultPaymentMethod = false);
          this.cards[index].isDefaultPaymentMethod = true;
          this.cards.splice(index, 1);
          this.cards.unshift(card);
        }
      }
    }
    await this.dialogService.openDialog(dialog);
  }

  async openBankingDialog() {
    await this.dialogService.openDialog(new DialogConfig(BankAccountDialogComponent));
  }
}
