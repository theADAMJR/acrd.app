import { CleanDateTimePipe } from './clean-date-time.pipe';

describe('CleanDateTimePipe', () => {
  let pipe: CleanDateTimePipe;

  beforeEach(() => {
    pipe = new CleanDateTimePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('date returns correct date string', () => {
    const date = new Date(2020, 0, 1);
    pipe = new CleanDateTimePipe();

    const result = pipe.transform(date.toString());
    
    expect(result).toEqual('January 01 2020, 00:00');
  });
});
