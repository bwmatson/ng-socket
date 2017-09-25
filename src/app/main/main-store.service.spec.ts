import { inject, TestBed } from '@angular/core/testing';

import { MainStoreService } from './main-store.service';

describe('MainStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainStoreService]
    });
  });

  it('should be created', inject([MainStoreService], (service: MainStoreService) => {
    expect(service).toBeTruthy();
  }));
});
