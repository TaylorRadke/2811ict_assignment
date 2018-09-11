import { TestBed, inject } from '@angular/core/testing';

import { GroupManagerService } from './group-manager.service';

describe('GroupManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupManagerService]
    });
  });

  it('should be created', inject([GroupManagerService], (service: GroupManagerService) => {
    expect(service).toBeTruthy();
  }));
});
