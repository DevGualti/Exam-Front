import { IfNotAuthenticatedDirective } from './if-not-authenticated.directive';

describe('IfNotAuthenticatedDirective', () => {
  it('should create an instance', () => {
    const directive = new IfNotAuthenticatedDirective();
    expect(directive).toBeTruthy();
  });
});
