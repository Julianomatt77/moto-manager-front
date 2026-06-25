import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, submit, required, email } from '@angular/forms/signals';
import { MailService } from '../../services/mail/mail.service';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-contact',
  imports: [FormField, RouterModule, IconComponent],
  templateUrl: 'contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private mailService = inject(MailService);

  readonly model = signal({ from: '', subject: '', message: '' });
  readonly form = form(this.model, (s) => {
    required(s.from, { message: 'Une adresse email est obligatoire' });
    email(s.from, { message: 'Adresse email invalide' });
    required(s.subject, { message: 'Un sujet est obligatoire' });
    required(s.message, { message: 'Un message est obligatoire' });
  });

  submitted = false;
  error = '';
  messageSent = false;
  messageFailed = false;

  ngOnInit() {
    this.messageSent = false;
    this.messageFailed = false;
  }

  onSubmit() {
    submit(this.form, async () => {
      try {
        await this.mailService.contact(this.model().from, this.model().subject, this.model().message);
        this.messageSent = true;
        this.model.set({ from: '', subject: '', message: '' });
      } catch (err) {
        this.messageFailed = true;
        this.error = "Erreur lors de l'envoi de l'e-mail";
        console.error("Erreur lors de l'envoi de l'e-mail:", err);
      }
    });
  }
}
