import { SnakeToSentenceCasePipe } from './snake-to-sentence-case.pipe';

describe('SnakeToSentenceCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeToSentenceCasePipe();
    expect(pipe).toBeTruthy();
  });

  it('SNAKE_CASE is converted to Sentence Case', () => {
    const pipe = new SnakeToSentenceCasePipe();
    
    const result = pipe.transform('TESTING_123');

    expect(result).toBe('Testing 123');
  })
});
