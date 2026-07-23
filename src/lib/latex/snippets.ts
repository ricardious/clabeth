export type SnippetMode = 'inline' | 'block';

export interface LatexSnippet {
  id: string;
  label: string;
  latex: string;
  mode: SnippetMode;
  category: string;
}

export const LATEX_CATEGORIES = [
  'Estructuras',
  'Cálculo',
  'Sumatorias y productos',
  'Matrices y vectores',
  'Sistemas',
  'Trigonometría',
  'Griegas',
  'Símbolos',
] as const;

const s = (id: string, label: string, latex: string, category: string, mode: SnippetMode = 'inline'): LatexSnippet => ({
  id,
  label,
  latex,
  mode,
  category,
});

export const LATEX_SNIPPETS: LatexSnippet[] = [
  // ——— Estructuras ———
  s('frac', 'Fracción', '\\frac{a}{b}', 'Estructuras'),
  s('sqrt', 'Raíz cuadrada', '\\sqrt{x}', 'Estructuras'),
  s('sqrtn', 'Raíz n-ésima', '\\sqrt[n]{x}', 'Estructuras'),
  s('pow', 'Exponente', 'x^{n}', 'Estructuras'),
  s('sub', 'Subíndice', 'x_{i}', 'Estructuras'),
  s('subsup', 'Sub y superíndice', 'x_{i}^{2}', 'Estructuras'),
  s('binom', 'Coeficiente binomial', '\\binom{n}{k}', 'Estructuras'),
  s('text', 'Texto en fórmula', '\\text{tal que}', 'Estructuras'),

  // ——— Cálculo ———
  s('lim', 'Límite', '\\lim_{x \\to 0} f(x)', 'Cálculo'),
  s('deriv', 'Derivada', '\\frac{dy}{dx}', 'Cálculo'),
  s('deriv-p', 'Derivada parcial', '\\frac{\\partial f}{\\partial x}', 'Cálculo'),
  s('deriv-def', 'Derivada (definición)', "f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}", 'Cálculo', 'block'),
  s('int', 'Integral definida', '\\int_{a}^{b} f(x)\\,dx', 'Cálculo'),
  s('int-indef', 'Integral indefinida', '\\int f(x)\\,dx', 'Cálculo'),
  s('iint', 'Integral doble', '\\iint_{D} f(x,y)\\,dA', 'Cálculo'),
  s('oint', 'Integral de contorno', '\\oint_{C} F\\cdot dr', 'Cálculo'),

  // ——— Sumatorias y productos ———
  s('sum', 'Sumatoria', '\\sum_{i=1}^{n} a_{i}', 'Sumatorias y productos'),
  s('sum-inf', 'Serie infinita', '\\sum_{n=0}^{\\infty} \\frac{1}{n^{2}}', 'Sumatorias y productos', 'block'),
  s('prod', 'Productoria', '\\prod_{i=1}^{n} i', 'Sumatorias y productos'),
  s('bigcup', 'Unión', '\\bigcup_{i=1}^{n} A_{i}', 'Sumatorias y productos'),
  s('bigcap', 'Intersección', '\\bigcap_{i=1}^{n} A_{i}', 'Sumatorias y productos'),

  // ——— Matrices y vectores ———
  s('mat2', 'Matriz 2×2', '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', 'Matrices y vectores', 'block'),
  s('mat3', 'Matriz 3×3', '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', 'Matrices y vectores', 'block'),
  s('bmat', 'Matriz con corchetes', '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}', 'Matrices y vectores', 'block'),
  s('det', 'Determinante', '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', 'Matrices y vectores', 'block'),
  s('vec', 'Vector', '\\vec{v} = (v_{1}, v_{2}, v_{3})', 'Matrices y vectores'),
  s('hat', 'Vector unitario', '\\hat{\\imath}, \\hat{\\jmath}, \\hat{k}', 'Matrices y vectores'),

  // ——— Sistemas ———
  s('cases', 'Sistema de ecuaciones', '\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}', 'Sistemas', 'block'),
  s('piecewise', 'Función a trozos', 'f(x) = \\begin{cases} x^{2} & x \\geq 0 \\\\ -x & x < 0 \\end{cases}', 'Sistemas', 'block'),
  s('aligned', 'Ecuaciones alineadas', '\\begin{aligned} a &= b + c \\\\ &= d + e \\end{aligned}', 'Sistemas', 'block'),

  // ——— Trigonometría ———
  s('sin', 'Seno', '\\sin(\\theta)', 'Trigonometría'),
  s('cos', 'Coseno', '\\cos(\\theta)', 'Trigonometría'),
  s('tan', 'Tangente', '\\tan(\\theta)', 'Trigonometría'),
  s('arcsin', 'Arcoseno', '\\arcsin(x)', 'Trigonometría'),
  s('pitagoras', 'Identidad pitagórica', '\\sin^{2}(\\theta) + \\cos^{2}(\\theta) = 1', 'Trigonometría'),

  // ——— Griegas ———
  s('alpha', 'alfa', '\\alpha', 'Griegas'),
  s('beta', 'beta', '\\beta', 'Griegas'),
  s('gamma', 'gamma', '\\gamma', 'Griegas'),
  s('delta', 'delta', '\\delta', 'Griegas'),
  s('epsilon', 'épsilon', '\\epsilon', 'Griegas'),
  s('theta', 'theta', '\\theta', 'Griegas'),
  s('lambda', 'lambda', '\\lambda', 'Griegas'),
  s('mu', 'mu', '\\mu', 'Griegas'),
  s('pi', 'pi', '\\pi', 'Griegas'),
  s('rho', 'rho', '\\rho', 'Griegas'),
  s('sigma', 'sigma', '\\sigma', 'Griegas'),
  s('tau', 'tau', '\\tau', 'Griegas'),
  s('phi', 'phi', '\\phi', 'Griegas'),
  s('chi', 'chi', '\\chi', 'Griegas'),
  s('psi', 'psi', '\\psi', 'Griegas'),
  s('omega', 'omega', '\\omega', 'Griegas'),
  s('Delta', 'Delta mayúscula', '\\Delta', 'Griegas'),
  s('Sigma', 'Sigma mayúscula', '\\Sigma', 'Griegas'),
  s('Omega', 'Omega mayúscula', '\\Omega', 'Griegas'),
  s('nabla', 'nabla', '\\nabla', 'Griegas'),

  // ——— Símbolos ———
  s('leq', 'Menor o igual', '\\leq', 'Símbolos'),
  s('geq', 'Mayor o igual', '\\geq', 'Símbolos'),
  s('neq', 'Distinto', '\\neq', 'Símbolos'),
  s('approx', 'Aproximado', '\\approx', 'Símbolos'),
  s('pm', 'Más/menos', '\\pm', 'Símbolos'),
  s('infty', 'Infinito', '\\infty', 'Símbolos'),
  s('in', 'Pertenece', '\\in', 'Símbolos'),
  s('subset', 'Subconjunto', '\\subseteq', 'Símbolos'),
  s('forall', 'Para todo', '\\forall', 'Símbolos'),
  s('exists', 'Existe', '\\exists', 'Símbolos'),
  s('implies', 'Implica', '\\Rightarrow', 'Símbolos'),
  s('iff', 'Si y solo si', '\\Leftrightarrow', 'Símbolos'),
  s('times', 'Producto', '\\times', 'Símbolos'),
  s('cdot', 'Punto', '\\cdot', 'Símbolos'),
  s('partial', 'Parcial', '\\partial', 'Símbolos'),
  s('propto', 'Proporcional', '\\propto', 'Símbolos'),
];
