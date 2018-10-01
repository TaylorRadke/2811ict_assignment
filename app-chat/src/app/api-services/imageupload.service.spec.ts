import { TestBed, inject } from '@angular/core/testing';

import { ImageuploadService } from '../api-services/imageupload.service';

describe('ImageuploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageuploadService]
    });
  });

  it('should be created', inject([ImageuploadService], (service: ImageuploadService) => {
    expect(service).toBeTruthy();
  }));
});
