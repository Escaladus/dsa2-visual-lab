// One tight bound per question. The order follows reasoning difficulty.
export const complexityQuestions = [
  {
    id: 'indexed-access',
    code: `static int first(int[] values) {
    return values[0];
}`,
    choices: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    correctIndex: 1,
  },
  {
    id: 'single-pass',
    code: `static long sum(int[] values) {
    long total = 0;
    for (int value : values) {
        total += value;
    }
    return total;
}`,
    choices: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correctIndex: 2,
  },
  {
    id: 'halving',
    code: `static int halves(int n) {
    int steps = 0;
    while (n > 1) {
        n /= 2;
        steps++;
    }
    return steps;
}`,
    choices: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
    correctIndex: 0,
  },
  {
    id: 'triangular-loop',
    code: `static long pairs(int n) {
    long count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            count++;
        }
    }
    return count;
}`,
    choices: ['O(n log n)', 'O(n³)', 'O(n)', 'O(n²)'],
    correctIndex: 3,
  },
  {
    id: 'nested-doubling',
    code: `static long work(int n) {
    long count = 0;
    for (int i = 0; i < n; i++) {
        for (long width = 1; width < n; width *= 2) {
            count++;
        }
    }
    return count;
}`,
    choices: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'],
    correctIndex: 1,
  },
]
