import { TestBed, inject } from '@angular/core/testing';

import { ChannelManagerService } from './channel-manager.service';

describe('ChannelManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelManagerService]
    });
  });

  it('should be created', inject([ChannelManagerService], (service: ChannelManagerService) => {
    expect(service).toBeTruthy();
  }));
});
