export const recursionExamples = {
  factorial: {
    max: 8,
    code: `static long factorial(int n) {
    if (n <= 1) return 1;
    long child = factorial(n - 1);
    return n * child;
}`,
  },
  fibonacci: {
    max: 6,
    code: `static long fibonacci(int n) {
    if (n <= 1) return n;
    long left = fibonacci(n - 1);
    long right = fibonacci(n - 2);
    return left + right;
}`,
  },
}

export const recursionQuestions = [
  { id: 'value', code: recursionExamples.factorial.code, choices: ['4', '10', '24', '16'], correctIndex: 2 },
  { id: 'first-return', code: recursionExamples.factorial.code, choices: ['factorial(4)', 'factorial(1)', 'factorial(3)', 'all'], correctIndex: 1 },
  { id: 'base', code: recursionExamples.factorial.code, choices: ['n <= 1', 'n > 1', 'n * n', 'n * child'], correctIndex: 0 },
  { id: 'calls', code: recursionExamples.fibonacci.code, choices: ['5', '7', '9', '16'], correctIndex: 2 },
  { id: 'bug', code: `static int bad(int n) {
    return bad(n);
}`, choices: ['linear', 'zero', 'n', 'overflow'], correctIndex: 3 },
]
