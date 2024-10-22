import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class AppController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Get()
  async getToken() {
    const token = await this.firebaseService.getAccessToken();
    return { access_token: token };
  }
}
