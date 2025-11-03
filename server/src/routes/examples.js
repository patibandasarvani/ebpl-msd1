import { Router } from 'express';

const router = Router();

const examples = [
  { id: 'hello', title: 'Hello World', code: 'print "Hello, EBPL World!"', description: 'Simple hello world program' },
  { id: 'sum', title: 'Sum 1..5', code: 'sum = 0\nfor i in 1..5: sum = sum + i\nprint sum', description: 'Loop and arithmetic' },
  { id: 'fizzbuzz', title: 'FizzBuzz', code: 'for i in 1..20: \n  if i % 15 == 0: print "FizzBuzz"\n  elif i % 3 == 0: print "Fizz"\n  elif i % 5 == 0: print "Buzz"\n  else: print i', description: 'Conditionals and modulo' },
  { id: 'factorial', title: 'Factorial (iterative)', code: 'n = 5\nres = 1\nfor i in 1..n: res = res * i\nprint res', description: 'Multiplication loop' },
  { id: 'reverse', title: 'Reverse String', code: 'text = "ebpl"\nrev = ""\nfor ch in text: rev = ch + rev\nprint rev', description: 'String processing' },
  { id: 'array-avg', title: 'Array Average', code: 'arr = [2,4,6,8]\nsum = 0\nfor x in arr: sum = sum + x\nprint sum / len(arr)', description: 'Arrays and aggregate' }
];

router.get('/', (_req, res) => {
  res.json(examples.map(({ id, title }) => ({ id, title })));
});

router.get('/:id', (req, res) => {
  const ex = examples.find(e => e.id === req.params.id);
  if (!ex) return res.status(404).json({ error: 'Not found' });
  res.json(ex);
});

export default router;
