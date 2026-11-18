export const recurrenceInputs = [1, 2, 4, 8]

export const recurrenceExamples = {
  chain: {
    recurrence: 'T(n) = T(n − 1) + 1',
    children: 1,
    reduction: 'subtract',
    own: 'constant',
    depth: 'n − 1',
    depthBound: 'Θ(n)',
    levels: 'n',
    width: '1',
    total: 'n',
    bound: 'Θ(n)',
    sizeAtLevel: 'n − i',
    callsAtLevel: '1',
    ownAtLevel: '1',
    workAtLevel: '1',
    code: `static long chain(int n) {
    if (n <= 1) return 1;
    return 1 + chain(n - 1);
}`,
  },
  split: {
    recurrence: 'T(n) = 2T(n/2) + 1',
    children: 2,
    reduction: 'halve',
    own: 'constant',
    depth: 'log₂ n',
    depthBound: 'Θ(log n)',
    levels: 'log₂ n + 1',
    width: 'n',
    total: '2n − 1',
    bound: 'Θ(n)',
    sizeAtLevel: 'n / 2ⁱ',
    callsAtLevel: '2ⁱ',
    ownAtLevel: '1',
    workAtLevel: '2ⁱ',
    code: `static long split(int n) {
    if (n <= 1) return 1;
    long left = split(n / 2);
    long right = split(n / 2);
    return 1 + left + right;
}`,
  },
  binary: {
    recurrence: 'T(n) = 2T(n − 1) + 1',
    children: 2,
    reduction: 'subtract',
    own: 'constant',
    depth: 'n − 1',
    depthBound: 'Θ(n)',
    levels: 'n',
    width: '2ⁿ⁻¹',
    total: '2ⁿ − 1',
    bound: 'Θ(2ⁿ)',
    sizeAtLevel: 'n − i',
    callsAtLevel: '2ⁱ',
    ownAtLevel: '1',
    workAtLevel: '2ⁱ',
    code: `static long binary(int n) {
    if (n <= 1) return 1;
    long left = binary(n - 1);
    long right = binary(n - 1);
    return 1 + left + right;
}`,
  },
  linearSplit: {
    recurrence: 'T(n) = 2T(n/2) + n',
    children: 2,
    reduction: 'halve',
    own: 'linear',
    depth: 'log₂ n',
    depthBound: 'Θ(log n)',
    levels: 'log₂ n + 1',
    width: 'n',
    total: 'n(log₂ n + 1)',
    bound: 'Θ(n log n)',
    sizeAtLevel: 'n / 2ⁱ',
    callsAtLevel: '2ⁱ',
    ownAtLevel: 'n / 2ⁱ',
    workAtLevel: 'n',
    code: `static long linearSplit(int n) {
    if (n <= 1) return 1;
    long own = 0;
    for (int i = 0; i < n; i++) own++;
    long left = linearSplit(n / 2);
    long right = linearSplit(n / 2);
    return own + left + right;
}`,
  },
}
