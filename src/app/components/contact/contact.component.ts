import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MailService} from "../../services/mail/mail.service";
import {RouterModule} from "@angular/router";
import {IconComponent} from '../../shared/icon.component';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: 'contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private mailService = inject(MailService);

  contactForm: FormGroup;
  submitted = false;
  error = '';
  messageSent = false;
  messageFailed = false;
  fromErrorMessage = 'Une adresse email est obligatoire';
  subjectErrorMessage = 'Un sujet est obligatoire';
  messageErrorMessage = 'Un message est obligatoire';

  constructor() {
    this.contactForm = this.fb.group({
      from: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.messageSent = false;
    this.messageFailed = false;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.contactForm.valid) {
      const { from, subject, message } = this.contactForm.value;
      this.mailService.contact(from, subject, message).subscribe({
        next: () => {
          this.messageSent = true;
          this.contactForm.reset();
        },
        error: (err) => {
          this.messageFailed = true;
          this.error = "Erreur lors de l'envoi de l'e-mail";
          console.error("Erreur lors de l'envoi de l'e-mail:", err.error);
        },
      });
    }
  }
}
