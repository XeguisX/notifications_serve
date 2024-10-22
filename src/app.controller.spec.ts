import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { FirebaseService } from './firebase.service';

describe('AppController', () => {
  let appController: AppController;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: FirebaseService,
          useValue: {
            getAccessToken: jest.fn().mockResolvedValue('fake_token'),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    firebaseService = app.get<FirebaseService>(FirebaseService);
  });

  describe('getToken', () => {
    it('should return an access token', async () => {
      const result = await appController.getToken();
      expect(result).toEqual({ access_token: 'fake_token' });
    });
  });
});
