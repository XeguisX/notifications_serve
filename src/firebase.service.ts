import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

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
}
