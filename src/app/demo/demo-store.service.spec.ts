import { inject, TestBed } from '@angular/core/testing';

import { DemoStoreService } from './demo-store.service';

describe('DemoStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoStoreService]
    });
  });

  it('should be created', inject([DemoStoreService], (service: DemoStoreService) => {
    expect(service).toBeTruthy();
  }));
});
