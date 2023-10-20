import { TestBed } from '@angular/core/testing';

import { FortressService } from './local.service';

describe('FortressService', () => {
  let service: FortressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FortressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
