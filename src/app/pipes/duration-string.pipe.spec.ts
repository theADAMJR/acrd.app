import { DurationStringPipe } from './duration-string.pipe';

describe('DurationStringPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationStringPipe();
    expect(pipe).toBeTruthy();
  });
});
