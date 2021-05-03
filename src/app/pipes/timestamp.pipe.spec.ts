import { TimestampPipe } from './timestamp.pipe';

describe('TimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
