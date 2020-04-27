import { MiniDatePipe } from './mini-date.pipe';

describe('MiniDatePipe', () => {
  it('create an instance', () => {
    const pipe = new MiniDatePipe();
    expect(pipe).toBeTruthy();
  });

  it('build labels returns last 7 days as string date', () => {
    const pipe = new MiniDatePipe();

    const result = pipe.transform(new Date().toString());
    const date = new Date();

    const expected = `${date.getDate()}/${(date.getMonth() + 1)}`;
    expect(result).toBe(expected);
  });
});
