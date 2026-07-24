import type { PaperStyleId } from '../types/paper';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  presetId: string;
  paperStyle: PaperStyleId;
  content: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'apuntes-clase',
    name: 'Apuntes de clase',
    description: 'Estructura con tema, ideas clave y dudas para repaso.',
    presetId: 'apuntes',
    paperStyle: 'libreta',
    content: `# Apuntes — Asignatura

**Fecha:** ___ · **Tema:** ___

## Ideas principales

- Primer concepto clave y su explicación breve.
- Segundo concepto con un ejemplo concreto.
- Relación entre ambos: observación del profesor.

## Desarrollo

Explicación con tus propias palabras. Las fórmulas importantes se escriben así: $a^2 + b^2 = c^2$.

> Frase literal que conviene recordar tal cual.

## Dudas para la próxima clase

- [ ] Preguntar por el paso final de la demostración.
- [ ] Repasar el ejemplo 3 del libro.
`,
  },
  {
    id: 'tarea-matematicas',
    name: 'Tarea de matemáticas',
    description: 'Enunciados, desarrollo paso a paso y resultado final.',
    presetId: 'escolar',
    paperStyle: 'cuadriculada',
    content: `# Tarea 4 — Cálculo diferencial

**Nombre:** ___ · **Grupo:** ___

## Problema 1

Calcula la derivada de $f(x) = x^3 - 2x^2 + 5x - 1$.

**Desarrollo:**

$$
f'(x) = \\frac{d}{dx}(x^3) - \\frac{d}{dx}(2x^2) + \\frac{d}{dx}(5x) - \\frac{d}{dx}(1)
$$

$$
f'(x) = 3x^2 - 4x + 5
$$

**Resultado:** $f'(x) = 3x^2 - 4x + 5$.

## Problema 2

Evalúa el límite:

$$
\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1
$$

*Justificación:* usando la serie de Taylor, $\\sin(x) = x - \\frac{x^3}{6} + \\cdots$, de donde el cociente tiende a $1$.
`,
  },
  {
    id: 'resumen',
    name: 'Resumen',
    description: 'Síntesis por secciones con idea final destacada.',
    presetId: 'clara',
    paperStyle: 'rayada',
    content: `# Resumen — Título del texto

**Autor:** ___ · **Fuente:** ___

## Idea central

El texto sostiene que... (una o dos frases con la tesis principal).

## Puntos clave

1. Primer argumento y la evidencia que lo sostiene.
2. Segundo argumento, con un dato relevante: *«cifra o cita»*.
3. Contraargumento que el autor anticipa y responde.

## Conceptos por revisar

| Concepto | Significado |
| --- | --- |
| Término A | Definición breve |
| Término B | Definición breve |

## Conclusión personal

Qué me llevo del texto y cómo se conecta con el curso.
`,
  },
  {
    id: 'informe',
    name: 'Informe',
    description: 'Portada, resumen, metodología, resultados y conclusiones.',
    presetId: 'tecnica',
    paperStyle: 'academica',
    content: `# Informe — Título del trabajo

**Autor:** ___ · **Fecha:** ___

## Resumen

Síntesis del objetivo, el método y el hallazgo principal en un párrafo.

## 1. Introducción

Contexto y planteamiento del problema. Qué se busca responder y por qué importa.

## 2. Metodología

- Materiales o fuentes utilizadas.
- Procedimiento seguido, paso a paso.

## 3. Resultados

| Medición | Valor | Incertidumbre |
| --- | --- | --- |
| $x_1$ | 4.21 | $\\pm 0.03$ |
| $x_2$ | 4.19 | $\\pm 0.03$ |

El promedio se calcula como $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$.

## 4. Conclusiones

Interpretación de los resultados y posibles mejoras del experimento.

\\newpage

## Referencias

1. Apellido, N. (Año). *Título de la fuente*. Editorial.
`,
  },
  {
    id: 'hoja-ejercicios',
    name: 'Hoja de ejercicios',
    description: 'Serie de problemas con espacio de resolución.',
    presetId: 'tecnica',
    paperStyle: 'cuadriculada',
    content: `# Hoja de ejercicios — Ecuaciones cuadráticas

**Instrucciones:** resuelve factorizando o con la fórmula general:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

---

## Ejercicio 1

$x^2 - 5x + 6 = 0$

*Espacio de trabajo:*

## Ejercicio 2

$2x^2 + 3x - 2 = 0$

*Espacio de trabajo:*

## Ejercicio 3

$x^2 + 4x + 5 = 0$ · ¿Qué indica el discriminante $\\Delta = b^2 - 4ac$?

*Espacio de trabajo:*

---

**Para repasar:** un ejercicio tiene soluciones reales distintas si $\\Delta > 0$, una doble si $\\Delta = 0$ y complejas si $\\Delta < 0$.
`,
  },
  {
    id: 'carta',
    name: 'Carta',
    description: 'Formato epistolar con membrete, cuerpo y despedida.',
    presetId: 'elegante',
    paperStyle: 'crema',
    content: `Ciudad, a ___ de ___ de ___

**Querida ___:**

Te escribo estas líneas para contarte que... El otro día recordé aquella tarde en la que hablamos de planes y me pareció el momento de retomar la conversación, esta vez con calma y por escrito.

Hay noticias que prefiero darte así, con la pausa que merecen. Desde entonces he estado trabajando en... y aunque el ritmo es exigente, cada avance me acerca un poco más a lo que buscamos.

Cuéntame de ti cuando puedas: cómo va todo por allá, qué estás leyendo, en qué andas metida.

Con cariño,

**___**
`,
  },
  {
    id: 'cuaderno-universitario',
    name: 'Cuaderno universitario',
    description: 'Portada de curso con índice y primera entrada.',
    presetId: 'escolar',
    paperStyle: 'libreta',
    content: `# Cuaderno — Nombre de la asignatura

**Semestre:** ___ · **Profesor(a):** ___

## Índice

1. Semana 1 — presentación del curso
2. Semana 2 — ___
3. Semana 3 — ___

\\newpage

## Semana 1 — Presentación del curso

**Temas:** panorama general, evaluación, bibliografía.

- La evaluación se divide en: parciales (40 %), proyecto (40 %) y participación (20 %).
- Bibliografía base: capítulo 1 para la próxima semana.

> Idea del día: la asignatura se entiende mejor practicando que leyendo.

**Tarea:** leer el capítulo 1 y traer tres preguntas escritas.
`,
  },
  {
    id: 'formulas-cientificas',
    name: 'Fórmulas científicas',
    description: 'Colección de ecuaciones con notas y unidades.',
    presetId: 'tecnica',
    paperStyle: 'blanca',
    content: `# Fórmulas — Física II

## Cinemática

Posición con aceleración constante:

$$
x(t) = x_0 + v_0 t + \\frac{1}{2} a t^2
$$

donde $x_0$ es la posición inicial, $v_0$ la velocidad inicial y $a$ la aceleración.

## Dinámica

Segunda ley de Newton: $\\vec{F} = m \\vec{a}$.

Trabajo de una fuerza constante:

$$
W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)
$$

## Energía

| Magnitud | Fórmula | Unidades |
| --- | --- | --- |
| Cinética | $E_k = \\frac{1}{2}mv^2$ | J |
| Potencial | $E_p = mgh$ | J |
| Conservación | $E_{k,i} + E_{p,i} = E_{k,f} + E_{p,f}$ | J |

> Nota: verificar siempre las unidades antes de sustituir valores.
`,
  },
  {
    id: 'guia-estudio',
    name: 'Guía de estudio',
    description: 'Preguntas de autoevaluación, mapa de conceptos y plan.',
    presetId: 'clara',
    paperStyle: 'rayada',
    content: `# Guía de estudio — Examen parcial

## Temas que entran

- [ ] Tema 1: definiciones y ejemplos.
- [ ] Tema 2: demostraciones clave.
- [ ] Tema 3: problemas tipo examen.

## Preguntas de autoevaluación

1. ¿Qué establece el teorema fundamental y cuándo aplica?
2. ¿Cuál es la diferencia entre $O(n)$ y $o(n)$?
3. Explica con tus palabras por qué $\\sum_{n=1}^{\\infty} \\frac{1}{n}$ diverge pero $\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$ converge.

## Plan de repaso

| Día | Bloque | Meta |
| --- | --- | --- |
| Lunes | Tema 1 | Rehacer apuntes |
| Miércoles | Tema 2 | 5 ejercicios |
| Viernes | Tema 3 | Simulacro con tiempo |

**Regla de oro:** si no sé explicarlo sin mirar, aún no lo sé.
`,
  },
  {
    id: 'lista-tareas',
    name: 'Lista de tareas',
    description: 'Pendientes por prioridad con casillas y notas.',
    presetId: 'apuntes',
    paperStyle: 'punteada',
    content: `# Pendientes — semana del ___

## Prioridad alta

- [ ] Entregar borrador del informe (martes).
- [ ] Resolver la hoja de ejercicios 4.
- [ ] Reservar sala de estudio para el grupo.

## Esta semana

- [ ] Leer el capítulo 5 y subrayar ideas clave.
- [ ] Repasar las fórmulas de la guía: $v = \\frac{d}{t}$ y $a = \\frac{\\Delta v}{\\Delta t}$.
- [ ] Responder el correo del profesor.

## Puede esperar

- [ ] Reorganizar el archivo de apuntes.
- [ ] Imprimir la bibliografía complementaria.

---

> Completado de la semana pasada: 7 de 9 pendientes. Meta: 9 de 9.
`,
  },
];

export function getTemplate(id: string): DocumentTemplate | undefined {
  return DOCUMENT_TEMPLATES.find((template) => template.id === id);
}
