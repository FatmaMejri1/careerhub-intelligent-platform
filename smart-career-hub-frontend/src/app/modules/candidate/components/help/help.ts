import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './help.html',
    styleUrls: ['./help.css']
})
export class HelpComponent {
    message = {
        subject: '',
        content: ''
    };

    successMessage: string | null = null;

    sendMessage() {
        // Mock sending logic
        console.log('Sending message:', this.message);

        // Simulate API delay
        setTimeout(() => {
            this.successMessage = 'Your message has been sent successfully! We will contact you soon.';
            this.message = { subject: '', content: '' }; // Reset form

            // Hide success message after 5 seconds
            setTimeout(() => {
                this.successMessage = null;
            }, 5000);
        }, 1000);
    }
}
