import { CountdownPipe } from './countdown.pipe';

describe('CountdownPipe', () => {
  let pipe: CountdownPipe;

  beforeEach(() => {
    pipe = new CountdownPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
