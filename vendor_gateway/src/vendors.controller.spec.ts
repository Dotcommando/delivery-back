import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { of } from 'rxjs';

import { fakeObjectId } from './mocks/vendors-controller/constants';
import { VendorServiceFake } from './mocks/vendors-controller/services';
import { AuthService, CommonService, VendorsService } from './services';
import { VendorsController } from './vendors.controller';


describe('AppController', () => {
  let vendorsController: VendorsController;
  let vendorServiceClient: ClientProxy;

  beforeEach(async () => {
    const VendorServiceClientProvider = {
      provide: 'VENDOR_SERVICE',
      useFactory: () => ({
        send: jest.fn(() => of({})),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [VendorsController],
      providers: [
        AuthService,
        ConfigService,
        CommonService,
        { provide: VendorsService, useClass: VendorServiceFake },
        VendorServiceClientProvider,
      ],
    }).compile();

    vendorsController = app.get<VendorsController>(VendorsController);
    vendorServiceClient = app.get<ClientProxy>('VENDOR_SERVICE');
  });

  describe('Read user\'s data', () => {
    it('should call method "send" of ClientProxy', async () => {
      vendorsController.readMe({ _id: fakeObjectId });
      expect(vendorServiceClient.send).toHaveBeenCalled();
    });
  });
});
