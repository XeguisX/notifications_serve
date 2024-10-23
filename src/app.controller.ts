import { Controller, Post, Query, Body } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class AppController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Post('send-notification')
  async sendNotification(
    @Query('token') token: string,
    @Query('title') title: string,
    @Query('body') body: string,
    @Query('image') image: string,
    @Body('data') data: Record<string, string>,
  ) {
    const payload = {
      message: {
        token: token,
        data: data,
        notification: { title, body },
        android: {
          notification: { image }
        },
        apns: {
          payload: {
            aps: { 'mutable-content': 1 }
          },
          fcm_options: { image }
        }
      }
    };

    const accessToken = await this.firebaseService.getAccessToken();
    const result = await this.firebaseService.sendPushNotification(accessToken, payload);
    return { success: result };
  }
}
