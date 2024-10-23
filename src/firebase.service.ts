import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
import axios from 'axios';

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
const FCM_URL = 'https://fcm.googleapis.com/v1/projects/flutter-notificaciones-ebd00/messages:send';

@Injectable()
export class FirebaseService {
    private readonly serviceAccount = require('../firebase-admin.json');

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
        });
    }

    async getAccessToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            const jwtClient = new google.auth.JWT(
                this.serviceAccount.client_email,
                undefined,
                this.serviceAccount.private_key,
                SCOPES,
                undefined,
            );

            jwtClient.authorize((err, tokens) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(tokens.access_token);
            });
        });
    }

    async sendPushNotification(accessToken: string, payload: any): Promise<any> {
        try {
            const response = await axios.post(
                FCM_URL,
                {
                    message: payload.message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error('Error sending notification', error.response?.data || error.message);
            throw new Error('Failed to send push notification');
        }
    }
}
