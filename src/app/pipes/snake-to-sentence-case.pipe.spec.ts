import { SnakeToSentenceCasePipe } from './snake-to-sentence-case.pipe';

describe('SnakeToSentenceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeToSentenceCasePipe();
    expect(pipe).toBeTruthy();
  });
});
