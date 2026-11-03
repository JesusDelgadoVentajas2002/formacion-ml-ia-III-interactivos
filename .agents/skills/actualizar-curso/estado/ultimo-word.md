| Formación ML/IA básica - Deep Learning y Redes Neuronales |
|---|

| Autor: Persona / Equipo: / Versión del documento: |
|---|

# Control de cambios

| Versión | Fecha | Descripción cambios | Autores |
|---|---|---|---|
| 1 | 21 sept 2026 | Versión inicial. | Carlos Garcia Silva |
| 1 | 21 sept 2026 | Versión inicial. | Jesus Delgado |
|  | Fecha |  | Persona |
|  | Fecha |  | Persona |

# Índice.

Control de cambios	1

Índice.	2

Módulo 7. Fundamentos de Redes Neuronales	4

1. Introducción a las redes neuronales	4

1.1. Inspiración biológica: el cerebro como red neuronal	4

La neurona y sus conexiones	4

Cuándo se activa una neurona	5

Cómo aprende el cerebro	5

De la neurona biológica a la artificial	5

1.2. Las redes neuronales en el contexto actual	7

¿Qué es una red neuronal?	7

De 1943 a la IA generativa	8

¿Por qué ahora?	9

Dónde encajan (y dónde no)	9

2. Perceptrón	11

2.1. Modelo de perceptrón	11

Cómo decide: la función escalón	11

Interpretación geométrica: la frontera de decisión	11

Cómo aprende: la regla del perceptrón	13

Ejemplo: aprender a conceder un préstamo	14

2.2. Limitaciones del perceptrón y sus evoluciones	14

El teorema de convergencia y su letra pequeña	14

El problema XOR	14

La solución: combinar perceptrones en capas	15

De las limitaciones a las evoluciones	17

3. Funciones de activación	18

Por qué tiene que ser no lineal	18

3.1. Sigmoide	19

La fórmula y su forma	19

Cómo se interpreta: una probabilidad	19

La pendiente de la sigmoide	19

3.2. TanH	20

Una sigmoide centrada en cero	20

Mejor pendiente, mismo problema	21

3.3. ReLU	22

La función más sencilla posible	22

Por qué es la opción por defecto	23

El riesgo: neuronas muertas y Leaky ReLU	23

3.4. Comparativa práctica: sigmoide, tanh y ReLU	23

Qué se ve en la pantalla	24

Cómo preparar el experimento	24

Prueba 1: sigmoide	24

Prueba 2: tanh	25

Prueba 3: ReLU	25

Una prueba más: una red profunda	25

Cómo leer los resultados	26

3.5. Softmax	26

De dos clases a muchas	26

Ejemplo: clasificar tickets de soporte	27

Resumen: qué función usar en cada capa	27

4. Red Neuronal Multicapa	30

4.1. Introducción: de una neurona a una red	30

Cómo se organiza: capas totalmente conectadas	30

Propagación hacia delante: un ejemplo resuelto	31

Qué hacen las capas ocultas: cambiar el punto de vista	32

¿Qué puede aprender una red? El teorema de aproximación universal	32

Profundidad frente a anchura	33

Cuántos parámetros tiene una red	33

4.2. Tipos de capa	34

Según su papel: entrada, ocultas y salida	34

Según cómo conectan: más allá de la capa densa	35

Capas auxiliares	36

5. Aplicaciones comunes	37

5.1. Clasificación y categorización	37

Evaluación de riesgo crediticio	37

Diagnóstico médico preliminar	38

Detección de spam	38

5.2. Regresión y predicción numérica	39

Valoración inmobiliaria	39

Previsión de demanda de recursos	39

Predicción de ventas	40

5.3. Visión por computador	41

Control de calidad industrial	41

Reconocimiento facial	41

Digitalización de texto (OCR)	42

5.4. Procesamiento de lenguaje natural, audio y voz	43

Traducción y corrección	43

Reconocimiento de comandos	44

Transcripción automática	44

Visión de conjunto	45

Módulo 8. Entrenamiento de Redes Neuronales	46

1. Función de coste en redes neuronales	46

Pérdida de un ejemplo y coste de todo el conjunto	46

Un ejemplo: el coste de la red de conciliación	46

1.1. Relación con lo visto en la Parte I	47

Regresión: el error cuadrático medio	47

Clasificación: la entropía cruzada	47

Métrica y función de coste no son lo mismo	49

Lo que cambia en una red: un paisaje con muchos valles	50

2. Backpropagation	52

2.1. Intuición del algoritmo	52

El problema: repartir la responsabilidad del error	52

Qué es el gradiente	53

La regla de la cadena: efectos que se encadenan	53

Por qué hacia atrás	54

2.2. Propagación del error	55

Paso 1: hacia delante	55

Paso 2: el error de la salida	55

Paso 3: propagar el error a la capa oculta	55

La regla general	56

Nadie lo programa a mano	57

# Módulo 7. Fundamentos de Redes Neuronales

## Introducción a las redes neuronales

### 1.1. Inspiración biológica: el cerebro como red neuronal

Las redes neuronales artificiales toman su nombre y su idea de partida del cerebro. El cerebro humano tiene alrededor de 86000 millones de neuronas y ninguna, por sí sola, hace nada complejo: su capacidad está en cómo se conectan entre sí.

#### La neurona y sus conexiones

Una neurona típica tiene tres partes (Figura 1, izquierda):

- Dendritas: ramificaciones que reciben señales de otras neuronas y actúan como entradas

- Soma o cuerpo celular: donde se reúnen esas señales

- Axón: fibra que transmite la señal de salida.

En su extremo, el axón se ramifica en terminales, y cada uno de ellos se une a otra neurona mediante el espacio sináptico, el punto de conexión entre ambas. Cada neurona se conecta con miles de otras, formando una red enormemente densa.

![](media/image29.png)

*Figura 1. Neurona biológica (izquierda).*

Las neuronas no llegan a tocarse. Cuando una se activa, envía por el axón un impulso eléctrico, el potencial de acción; al llegar a la sinapsis, libera neurotransmisores que cruzan un pequeño hueco, la hendidura sináptica, y activan los receptores de la neurona siguiente (Figura 2a). El impulso es siempre igual: la neurona dispara o no dispara. Lo que varía es la fuerza de cada conexión, porque hay sinapsis fuertes y sinapsis débiles.

#### Cuándo se activa una neurona

Las señales que llegan pueden ser:

- **Excitatorias,** que empujan a la neurona a disparar

- **Inhibitorias,** que la frenan.

La neurona hace balance: si la suma de todas ellas supera un umbral, dispara; si no, permanece en reposo (Figura 2b). Funciona como una votación en la que no todos los votos pesan igual y la propuesta solo sale adelante si el apoyo total supera un mínimo.

![](media/image9.png)

*Figura 2. Comunicación entre dos neuronas (a) y decisión de disparo por balance de señales (b).*

#### Cómo aprende el cerebro

El cerebro aprende cambiando la fuerza de sus conexiones. En 1949, el psicólogo Donald Hebb lo resumió en un principio: cuando una neurona contribuye repetidamente a activar otra, la conexión entre ambas se refuerza («las neuronas que se activan juntas se conectan entre sí»). Por eso lo aprendido no se guarda en un lugar concreto, sino repartido en la fuerza de millones de conexiones.

#### De la neurona biológica a la artificial

En 1943, McCulloch y Pitts propusieron el primer modelo matemático de neurona, quedándose solo con lo esencial: recibir señales, combinarlas y activarse si superan un umbral. Sumado a la idea de Hebb de que aprender es ajustar conexiones, este esquema es la base de todas las redes neuronales artificiales (parte derecha de la Figura 3 y Tabla 1).

*Tabla 1. Correspondencia entre la neurona biológica y la artificial.*

| **Neurona biológica** | **Neurona artificial** |
|---|---|
| Dendritas | Entradas $x1,…,xn$ {eq-1} |
| Fuerza de cada sinapsis (excitatoria o inhibitoria) | Pesos $wi$ {eq-2} (positivos o negativos) |
| Integración de señales en el soma | Suma ponderada |
| Umbral de disparo | Sesgo $b$ {eq-3} y función de activación |
| Axón | Salida $y$ {eq-4} |
| Refuerzo de las sinapsis | Ajuste de los pesos (entrenamiento) |

![](media/image29.png)

*Figura 3. Neurona biológica (izquierda) y su versión artificial simplificada (derecha).*

Eso sí, es una inspiración, no una copia. Igual que los aviones se inspiraron en los pájaros pero no baten las alas, las redes neuronales funcionan por sus propiedades matemáticas, no porque reproduzcan fielmente el cerebro.

*Tabla 2. Comparación de pasos Neurona Biológica vs Artificial*

| **Neurona biológica** / L*a neurona motora del brazo debe decidir si dispara para retirar la mano de una taza de café hirviendo.* | **Neurona artificial** / U*na neurona debe decidir si se activa (salida = 1) para marcar un correo electrónico como spam.* |
|---|---|
| **1. Dendritas (entradas). **Los dedos tocan la taza y los sentidos recogen tres datos del entorno: / - Dato 1: calor extremo. / - Dato 2: vapor saliendo de la taza. / - Dato 3: música relajante de fondo en la cafetería. | **1. Entradas **$x$ {eq-5}**. **El algoritmo analiza el correo y extrae tres datos numéricos (1 = sí, 0 = no): / - $x1=1$ {eq-6}: contiene la palabra «Gratis». / - $x2=1$ {eq-7}: el remitente es desconocido. / - $x3=1$ {eq-8}: incluye el nombre de pila del destinatario |
| **2. Fuerza de la sinapsis (pesos). **El cerebro prioriza la supervivencia (no todos los datos pesan igual): / - **Calor:** sinapsis muy fuerte y excitatoria (aporta mucha carga positiva). / - **Vapor:** sinapsis moderada y excitatoria (aporta algo de carga positiva). / - **Música:** sinapsis inhibitoria (aporta carga negativa, relaja y no supone una amenaza). | **2. Pesos **$w$ {eq-9}**. **Cada dato tiene asignada una importancia numérica: / - $w1=+4$ {eq-10}: «Gratis» es muy sospechoso (excitatorio alto). / - $w2=+3$ {eq-11}: un remitente desconocido también lo es (excitatorio medio). / - $w3=−2$ {eq-12}: que el correo conozca el nombre sugiere un contacto real (inhibitorio). |
| **3. Integración en el soma (suma). **El cuerpo de la neurona combina las cargas que llegan: el calor y el vapor aportan un torrente de carga positiva y la música, un poco de carga negativa. En total, la carga de la neurona sube de −70 mV a −52 mV. | **3. Suma ponderada. **La neurona multiplica cada dato por su peso y suma los resultados: / $w1x1+w2x2+w3x3=4+3−2=5$ {eq-13} |
| **4. Umbral de disparo (decisión). **La carga final (−52 mV) supera el umbral de −55 mV, así que las compuertas de sodio se abren de golpe: gana el bando excitatorio y la neurona dispara. | **4. Sesgo (umbral) y función de activación.** La neurona tiene un sesgo $b=−4$ {eq-14}, que equivale a exigir que la suma ponderada supere 4 para activarse. Se añade el sesgo a la suma: / $z=5+−4=1$ {eq-15} / Después se aplica la función de activación. En este caso es la función escalón, que devuelve 1 si $z>0$ {eq-16} y 0 en caso contrario: / $fz={1 si z>0 0 si z≤0$ {eq-17} / Como $z=1>0$ {eq-18}: / $y=f1=1$ {eq-19} |
| **5. Axón (salida). **Se produce el potencial de acción, que recorre el axón hasta el músculo del bíceps. Resultado: la mano se retira de golpe. | **5. Salida** $y$ {eq-20}**.** El valor $y=1$ {eq-21} es la salida de la neurona. Equivale al disparo, y el sistema mueve automáticamente el correo a la carpeta de correo no deseado. |
| **6. Refuerzo sináptico (aprendizaje). **Si la persona llega a quemarse, las conexiones que asocian ver vapor con peligro se refuerzan. La próxima vez, bastará con ver el vapor para actuar con más cautela antes de tocar la taza. | **6. Ajuste de pesos (entrenamiento). **Si el correo no era spam y el usuario lo marca como «No es spam», el algoritmo de entrenamiento corrige los pesos; por ejemplo, reduce $w1$ {eq-22} de +4 a +2. Con el mismo correo, la neurona ya no se activaría: / $z=2+3−2−4=−1$ {eq-23} / Como $z<0$ {eq-24}, la salida es $y=0$ {eq-25} y el correo llega a la bandeja de entrada. |

### 1.2. Las redes neuronales en el contexto actual

Hoy las redes neuronales están detrás de la IA generativa, los traductores automáticos, el reconocimiento de voz, el desbloqueo facial o la detección de fraude en pagos. Sin embargo, sus ideas de base tienen más de ochenta años.

#### ¿Qué es una red neuronal?

Una red neuronal es un conjunto de neuronas artificiales como la de la Tabla 2, conectadas entre sí y organizadas en capas. Desde el punto de vista del aprendizaje automático, es un modelo más: recibe unos datos, devuelve una predicción y tiene muchos parámetros, los pesos, cuyo valor se aprende a partir de ejemplos.

El cálculo que hacía la neurona del correo (multiplicar cada entrada por su peso, sumar los resultados y añadir el sesgo) se escribe de forma general así:

$z=∑i=1nwixi+b$ {eq-26}

En aquel ejemplo, la función de activación era de tipo «todo o nada»: si $z$ {eq-27} era positivo, la salida tenía el valor 1; si no, valía 0. Pero no es la única opción. Hay funciones de activación que dan una respuesta gradual en lugar de un simple sí o no, y se estudiarán en el apartado 3. Una de las más conocidas es la sigmoide, que transforma cualquier valor de $z$ {eq-28} en un número entre 0 y 1:

$p=11+e−z$ {eq-29}

Ese número puede interpretarse como una probabilidad. Aplicada al correo de la Tabla 2, donde $z=1$ {eq-30}:

$p=11+e−1$ {eq-31} ≈ 0.73

Es decir, en lugar de responder solo «es spam», la neurona indica que hay un 73 % de probabilidad de que lo sea.

![](media/image43.png)

*Figura 4. Una sola neurona con activación sigmoide (a) y una red multicapa que combina muchas neuronas organizadas en capas (b).*

#### De 1943 a la IA generativa

La historia de las redes neuronales ha alternado etapas de entusiasmo y de abandono (Figura 4). Tras el perceptrón de 1958, Minsky y Papert demostraron en 1969 sus limitaciones y el interés se desplomó. La retropropagación (1986) permitió entrenar redes de varias capas, pero durante los años noventa y dos mil otros métodos daban mejores resultados. El giro llegó en 2012, cuando la red AlexNet arrasó en la competición de reconocimiento de imágenes ImageNet. Desde entonces el deep learning no ha dejado de crecer, hasta los modelos de lenguaje actuales y el Nobel de Física de 2024 a Hopfield y Hinton.

![](media/image25.png)

*Figura 5. Hitos principales en la historia de las redes neuronales.*

#### ¿Por qué ahora?

Las ideas existían desde los años ochenta; lo que faltaba eran tres ingredientes (Figura 5):

- Datos masivos para ajustar millones de pesos

- Capacidad de cálculo gracias a las GPU, que hacen miles de operaciones en paralelo

- Mejoras en algoritmos y software, como la función ReLU o frameworks como TensorFlow y PyTorch (Módulo 9).

![](media/image42.png)

*Figura 5. Los tres factores que explican el despegue del deep learning.*

#### Dónde encajan (y dónde no)

Las redes neuronales son la referencia con datos no estructurados: imágenes, texto, audio o vídeo. Con datos tabulares, los de filas y columnas típicos de empresa, los modelos basados en árboles, como random forest o gradient boosting, siguen igualando o superando a menudo a las redes, con menos coste y más interpretabilidad. La recomendación práctica es empezar por un modelo clásico y recurrir a una red solo si mejora claramente (Figura 6).

![](media/image45.png)

*Figura 6. Regla práctica para elegir entre modelos clásicos y redes neuronales.*

## 2. Perceptrón

En 1958, Frank Rosenblatt propuso el perceptrón: la neurona artificial del apartado 1, completada con algo que el modelo de McCulloch y Pitts no tenía, una regla para aprender los pesos automáticamente a partir de ejemplos. Es el clasificador más sencillo posible y la pieza sobre la que se construyen las redes actuales. Este apartado estudia primero cómo decide y cómo aprende, y después por qué se queda corto y cómo se superaron sus limitaciones.

### 2.1. Modelo de perceptrón

#### Cómo decide: la función escalón

El perceptrón resuelve problemas de clasificación binaria: cada ejemplo, descrito por $n$ {eq-32} variables $x1,…,xn$ {eq-33}, pertenece a la clase 1 o a la clase 0. Para decidir, calcula la suma ponderada $z$ {eq-34} vista en el apartado 1.2 y la pasa por la función escalón, la activación «todo o nada» del ejemplo del correo (Figura 7a):

$ŷ=1$ {eq-35}     si     $z>0$ {eq-36}

$ŷ=0$ {eq-37}     si     $z≤0$ {eq-38}

Aquí $ŷ$ {eq-39} (se lee «y gorro») es la predicción del perceptrón, que así se distingue de la clase real del ejemplo, $y$ {eq-40}. Desarrollando $z$ {eq-41}, la condición para que el perceptrón responda 1 es:

$∑i=1nwixi>−b$ {eq-42}

Es decir, la suma ponderada de las entradas debe superar el valor $−b$ {eq-43}: el sesgo es el umbral con el signo cambiado. Ya se intuía en el ejemplo del correo, donde $b=−4$ {eq-44} equivalía a exigir una suma superior a 4. Tratar el umbral como un parámetro más tiene una ventaja clave: el perceptrón puede aprenderlo exactamente igual que aprende los pesos.

#### Interpretación geométrica: la frontera de decisión

Con dos variables, cada ejemplo es un punto del plano $(x1,x2)$ {eq-45}. Los puntos en los que la neurona está justo en el límite, $z=0$ {eq-46}, cumplen:

$w1x1+w2x2+b=0$ {eq-47}

que es la ecuación de una recta. Despejando $x2$ {eq-48} (con $w2≠0$ {eq-49}):

$x2=−w1w2x1−bw2$ {eq-50}

Esta recta es la frontera de decisión: a un lado $z>0$ {eq-51} y el perceptrón predice 1; al otro, predice 0 (Figura 7b). Los pesos fijan la inclinación de la recta y el sesgo la desplaza sin girarla. Además, el vector de pesos $(w1,w2)$ {eq-52} Es perpendicular a la frontera y apunta hacia la zona de la clase 1.

![](media/image28.png)

*Figura 7. Función escalón (a) y frontera de decisión aprendida por el perceptrón en el ejemplo AND (b).*

Con tres variables la frontera es un plano y, con $n$ {eq-53} variables, un hiperplano, la generalización del plano a más dimensiones. En todos los casos la frontera es plana, sin curvas: el perceptrón es un clasificador lineal.

![](media/image16.png)

*Figura 7c. Frontera de decisión de un perceptrón con tres variables: un plano que separa las dos clases (datos simulados).*

La Figura 7c lleva a tres variables la misma idea de la Figura 7b. Cada ejemplo es ahora un punto del espacio $(x1, x2, x3)$ {eq-54} y la frontera, el conjunto de puntos donde $z=0$ {eq-55}, deja de ser una recta para convertirse en un plano: la superficie gris inclinada. En la figura, el perceptrón tiene pesos 0.5, 0.3 y 1 y sesgo −2, de modo que la frontera es:

$0.5x1+0.3x2+x3-2=0$ {eq-56}

Los puntos rojos quedan por encima del plano y el perceptrón los clasifica como 1; los azules quedan por debajo y los clasifica como 0. Todo lo dicho para la recta se mantiene: los pesos fijan la inclinación del plano, el sesgo lo sube o lo baja sin girarlo, y el vector de pesos w es perpendicular al plano y apunta hacia la zona de la clase 1.

#### Cómo aprende: la regla del perceptrón

El perceptrón aprende a base de equivocarse. Se le muestran los ejemplos uno a uno y, cada vez que falla, corrige los pesos en la dirección que habría evitado el error. El error se mide como la diferencia entre la clase real y la predicción:

$e=y−ŷ$ {eq-57}

que solo puede valer 0 (acierto), +1 o −1. La regla de actualización es:

$wi←wi+η(y−ŷ)xi$ {eq-58}

$b←b+η(y−ŷ)$ {eq-59}

donde la flecha $←$ {eq-60} significa «sustituir por» y $η$ {eq-61} (eta) es la tasa de aprendizaje, un número positivo, normalmente entre 0 y 1, que controla el tamaño de cada corrección. La Tabla 3 muestra que la regla hace exactamente lo que dicta el sentido común.

*Tabla 3. Los tres casos posibles de la regla del perceptrón.*

| **Situación** | **Error** | **Corrección** | **Efecto sobre z** |
|---|---|---|---|
| Acierta | $e=0$ {eq-62} | Ninguna | Ninguno |
| Predice 0 y era 1 (se queda corto) | $e=+1$ {eq-63} | $ηxi$ {eq-64} se suma a cada peso y $η$ {eq-65} al sesgo | Aumenta: la próxima vez le cuesta menos activarse |
| Predice 1 y era 0 (se pasa) | $e=−1$ {eq-66} | $ηxi$ {eq-67} se resta de cada peso y $η$ {eq-68} del sesgo | Disminuye: la próxima vez le cuesta más activarse |

Solo cambian los pesos de las entradas activas: si $xi=0$ {eq-69}, esa entrada no intervino en la decisión y su peso queda intacto. Por eso, en el ejemplo del correo, al marcarlo como «No es spam» la regla no solo bajaría el peso de «Gratis»: como las tres entradas valían 1, reduciría los tres pesos y también el sesgo.

El algoritmo completo es sencillo: se inicializan los pesos y el sesgo con valores pequeños (o a cero), se recorren los ejemplos uno a uno aplicando la regla y, cuando se han visto todos, se dice que ha terminado una época. Se repiten épocas hasta que el perceptrón no comete ningún error en una época completa o hasta alcanzar un número máximo de épocas.

#### Ejemplo: aprender a conceder un préstamo

Un banco concede un préstamo ($y=1$ {eq-70}) solo si el solicitante tiene ingresos estables ($x1=1$ {eq-71}) y no tiene impagos previos ($x2=1$ {eq-72}). Es la función lógica AND: la salida vale 1 sólo cuando las dos entradas valen 1.

Se entrena un perceptrón con $w1$ {eq-73} = 0.1, $w2$ {eq-74} = −0.1, $b$ {eq-75} = 0.1 y $η$ {eq-76} = 0.5.

El primer ejemplo, (0, 0), es de clase 0. pero $z$ {eq-77} = 0.1 > 0. así que el perceptrón predice 1: error −1. Como las dos entradas valen 0. solo se corrige el sesgo:

$b$ {eq-78} ← 0.1 + 0.5 · (−1) = −0.4

Los dos ejemplos siguientes se clasifican bien. El cuarto, (1, 1), es de clase 1, pero da $z$ {eq-79} = 0.1 − 0.1 − 0.4 = −0.4, así que el perceptrón predice 0: error +1. Ahora se corrigen los dos pesos y el sesgo:

$w1$ {eq-80} ← 0.1 + 0.5 · 1 = 0.6       $w2$ {eq-81} ← −0.1 + 0.5 · 1 = 0.4       $b$ {eq-82} ← −0.4 + 0.5 = 0.1

La Tabla 4 resume el resto del entrenamiento. En la cuarta época el perceptrón ya no comete ningún error y el entrenamiento termina. La frontera aprendida, 0.6$x1$ {eq-83} + 0.4$x2$ {eq-84} − 0.9 = 0. es la recta de la Figura 7b. Con ella, $z$ {eq-85} vale −0.9, −0.5, −0.3 y 0.1 en los cuatro casos: solo es positivo en (1, 1), el único solicitante que cumple las dos condiciones.

*Tabla 4. Pesos y sesgos al final de cada época.*

| **Época** | **Errores** | **w₁** | **w₂** | **b** |
|---|---|---|---|---|
| Inicio | – | 0.1 | −0.1 | 0.1 |
| 1 | 2 | 0.6 | 0.4 | 0.1 |
| 2 | 3 | 0.6 | 0.9 | −0.4 |
| 3 | 1 | 0.6 | 0.4 | −0.9 |
| 4 | 0 | 0.6 | 0.4 | −0.9 |

### 2.2. Limitaciones del perceptrón y sus evoluciones

#### El teorema de convergencia y su letra pequeña

El ejemplo anterior no terminó por casualidad. El teorema de convergencia del perceptrón garantiza que, si las clases son linealmente separables (existe al menos una recta, plano o hiperplano que las separa sin errores), la regla encuentra una frontera válida en un número finito de correcciones. Pero cuidado, si las clases no son linealmente separables, el perceptrón nunca deja de corregirse, sus pesos oscilan indefinidamente y el resultado depende de la época en la que se detenga el entrenamiento.

#### El problema XOR

El ejemplo clásico de clases no separables es la función XOR («or exclusivo»): la salida vale 1 cuando exactamente una de las dos entradas vale 1. Un caso real es la conciliación de dos sistemas: si $x1$ {eq-86} indica que un pago figura en el banco y $x2$ {eq-87} que figura en contabilidad, debe saltar una alerta ($y=1$ {eq-88}) solo cuando hay descuadre, es decir, cuando el pago aparece en un sistema y no en el otro.

Como muestra la Figura 8, los puntos de la clase 1, (0, 1) y (1, 0), quedan en una diagonal, y los de la clase 0 (0, 0) y (1, 1), en la otra: ninguna recta deja a unos a un lado y a los otros al otro. Puede demostrarse con cuatro desigualdades. Para acertar los cuatro casos, un perceptrón tendría que cumplir todas las condiciones de la Tabla 5.

![](media/image23.png)

*Figura 8. En XOR, cualquier recta deja al menos un punto en el lado equivocado.*

*Tabla 5. Condiciones que debería cumplir un perceptrón para resolver XOR.*

| **Entradas** | **Clase real** | **Condición necesaria** |
|---|---|---|
| (0, 0) | 0 | $b≤0$ {eq-89} |
| (0, 1) | 1 | $w2+b>0$ {eq-90} |
| (1, 0) | 1 | $w1+b>0$ {eq-91} |
| (1, 1) | 0 | $w1+w2+b≤0$ {eq-92} |

Sumando la segunda y la tercera condición se obtiene $w1+w2+2b>0$ {eq-93}, es decir, $w1+w2+b>−b$ {eq-94}. Como la primera condición exige $b ≤ 0$ {eq-95}, el término $−b$ {eq-96} es mayor o igual que cero, así que $w1+w2+b>0$ {eq-97}, lo que contradice la cuarta. No existe ninguna combinación de pesos y sesgo que funcione. Minsky y Papert popularizaron este resultado en 1969 (apartado 1.2) y, con él, la idea de que el perceptrón era un callejón sin salida.

#### La solución: combinar perceptrones en capas

La salida es la idea de la Figura 4b: combinar varias neuronas. XOR puede descomponerse en dos condiciones que sí son lineales, «al menos una entrada vale 1» (OR) y «no valen 1 las dos a la vez» (NAND). Si una neurona $h1$ {eq-98} calcula OR y otra $h2$ {eq-99} calcula NAND, basta una tercera que compruebe que se cumplen ambas (AND) para obtener XOR (Figura 9a). La Tabla 6 verifica que la red acierta los cuatro casos.

*Tabla 6. Cálculo de XOR con la red de dos capas de la Figura 9a.*

| **x₁** | **x₂** | **h₁ (OR)** | **h₂ (NAND)** | **ŷ (AND)** | **XOR** |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 | 0 |

Geométricamente, cada neurona de la capa intermedia traza su propia recta, y la neurona de salida se queda con la franja comprendida entre ambas, justo donde están los dos puntos de la clase 1 (Figura 9b). Es la idea que desarrolla la red multicapa del apartado 4: las capas intermedias transforman el problema hasta hacerlo separable.

![](media/image32.png)

*Figura 9. Red de dos capas que resuelve XOR (a) y franja de decisión que generan sus dos rectas (b).*

Queda un problema: en este ejemplo los pesos se han elegido a mano. La regla del perceptrón sólo sabe corregir la neurona de salida, porque es la única que puede compararse con la respuesta correcta; para las neuronas intermedias no existe una «respuesta correcta» con la que medir su error. Además, la función escalón es plana en todas partes salvo en el salto, así que un pequeño cambio en un peso casi nunca cambia la salida y no indica hacia dónde conviene moverlo. Superar ambos obstáculos exigió cambiar varias piezas del perceptrón, como resume la Tabla 7.

#### De las limitaciones a las evoluciones

*Tabla 7. Limitaciones del perceptrón y evoluciones que las resuelven.*

| **Limitación** | **Evolución** | **Dónde se estudia** |
|---|---|---|
| Solo traza fronteras lineales y no resuelve XOR | Varias capas de neuronas: el perceptrón multicapa | Apartado 4 |
| La salida es todo o nada, sin grado de confianza | Funciones de activación suaves: sigmoide, tanh, ReLU y softmax | Apartado 3 |
| La función escalón no indica en qué dirección corregir los pesos | Minimizar una función de coste mediante descenso por gradiente, idea que introdujo Adaline (Widrow y Hoff, 1960) | Módulo 8 |
| Su regla solo puede corregir la capa de salida | Retropropagación del error (backpropagation) | Módulo 8 |
| No converge si las clases no son separables | Buscar la frontera con menor error total, aunque no sea perfecta, minimizando la función de coste | Módulo 8 |

En resumen, el perceptrón aporta tres ideas que siguen presentes en cualquier red moderna: la suma ponderada de las entradas, una función de activación que decide la salida y el aprendizaje por corrección de errores. Sus limitaciones no se resolvieron abandonándolo, sino mejorando cada una de esas piezas.

## 3. Funciones de activación

En el apartado 2 se vio que la función escalón tiene dos defectos: responde «todo o nada», sin ningún grado de confianza, y es plana en todas partes salvo en el salto, así que no indica hacia dónde conviene corregir los pesos (Tabla 7). La pieza que decide qué hace la neurona con su suma ponderada $z$ {eq-100} es la **función de activación** $f$ {eq-101}:

$y=f(z)$ {eq-102}

Cambiar esa función cambia por completo el comportamiento de la red. Este apartado estudia las cuatro más utilizadas: la sigmoide, la tangente hiperbólica (tanh), ReLU y softmax. Antes, conviene entender qué se les pide.

#### Por qué tiene que ser no lineal

Podría pensarse en prescindir de la activación y dejar pasar $z$ {eq-103} tal cual. El problema es que una suma ponderada de sumas ponderadas sigue siendo una suma ponderada. Con una sola entrada y dos neuronas encadenadas sin activación:

$h=w1x+b1$ {eq-104}

$ŷ=w2h+b2=(w2w1)x+(w2b1+b2)$ {eq-105}

El resultado vuelve a ser «un peso por la entrada más un sesgo»: apilar diez o cien capas sin activación equivale a una sola, y la red seguiría trazando una única frontera recta, sin poder resolver XOR (Figura 8). Es como intentar construir una curva empalmando varillas rígidas en línea: por muchas que se añadan, el resultado sigue siendo recto. La función de activación es la bisagra que permite «doblar» cada tramo y, combinando muchas dobleces, la red puede ajustar fronteras curvas (Figura 10).

![](media/image5.png)

*Figura 10. La misma red de dos capas ocultas entrenada sin activación (a) y con activación ReLU (b).*

Además, para que la red pueda aprender con los métodos que veremos en el Módulo 8, se pide a la función una pendiente útil: que un pequeño cambio en $z$ {eq-106} se pueda notar en la salida. Esa pendiente (la derivada de la función) será la protagonista de la retropropagación; aquí basta con la idea intuitiva, porque explica las ventajas y los problemas de cada función.

### 3.1. Sigmoide

#### La fórmula y su forma

La sigmoide ya apareció en el apartado 1.2. Transforma cualquier valor de $z$ {eq-107} en un número entre 0 y 1:

$σ(z)=11+e−z$ {eq-108}

*Recordemos que *$z$ {eq-109}*, es la suma de las entradas multiplicadas por sus pesos, más el sesgo.*

Su gráfica tiene forma de S (Figura 11a). Cuando $z$ {eq-110} es muy negativo, la salida se acerca a 0; en $z=0$ {eq-111} vale exactamente 0.5; y cuando $z$ {eq-112} es muy positivo, se acerca a 1. Es una versión suavizada de la función escalón: si el escalón es un interruptor de la luz, encendido o apagado, la sigmoide es un regulador de intensidad que sube poco a poco.

#### Cómo se interpreta: una probabilidad

Como su salida está entre 0 y 1, se interpreta como la probabilidad de que el ejemplo pertenezca a la clase 1. Si se decide «clase 1» cuando esa probabilidad supera 0.5, la frontera es la misma que la del perceptrón ($z>0$ {eq-113}), pero ahora la neurona informa de su seguridad. En el correo de la Tabla 2, $z=1$ {eq-114} da 0.73; un correo con $z=0.1$ {eq-115} daría 0.52 (dudoso) y otro con $z=4$ {eq-116}, 0.98 (casi seguro). En un modelo de riesgo crediticio, no es lo mismo rechazar una operación con un 52 % de probabilidad de impago que con un 98 %.

De hecho, la regresión logística, uno de los clasificadores clásicos, es exactamente una neurona con activación sigmoide. En la demo interactiva de regresión logística puede comprobarse la relación con la función escalón: al subir la pendiente (β₁, que hace el papel del peso) a valores altos, la S se estrecha hasta parecer un escalón; con valores bajos, la transición es suave y aparecen probabilidades intermedias. El intercepto (β₀) hace el papel del sesgo y desplaza la curva a izquierda o derecha.

#### La pendiente de la sigmoide

La pendiente indica cuánto cambia la salida cuando z cambia un poco. Se obtiene derivando la sigmoide:

$σ′(z) = e−z(1 + e−z)2 = σ(z)(1 − σ(z))$ {eq-117}

Si llamamos p a la salida σ(z), la pendiente es p(1 − p). Para hallar su máximo, derivamos esta expresión respecto a p e igualamos la derivada a cero:

$g(p) = p(1 − p) = p − p2$ {eq-118}

$g′(p) = 1 − 2p = 0     →     p = 0.5$ {eq-119}

Es un máximo porque g′(p) es positiva antes de 0.5 y negativa después. La pendiente máxima vale:

$p(1 − p) = 0.5(1 − 0.5) = 0.25$ {eq-120}

La sigmoide devuelve 0.5 cuando z = 0, ya que e⁰ = 1:

$σ(0) = 11 + e0 = 12 = 0.5$ {eq-121}

Por tanto, la pendiente máxima está en z = 0 y vale 0.25. No hay que confundirla con la salida, que en ese punto vale 0.5.

En los extremos, p se acerca a 0 o a 1 y el producto p(1 − p) se acerca a cero. Por ejemplo, con z = 5:

$σ(5) ≈ 0.993307     →     σ′(5) ≈ 0.993307(1 − 0.993307) ≈ 0.0066$ {eq-122}

Esta pendiente es unas 38 veces menor que 0.25. La salida apenas responde a pequeños cambios en z: la neurona está saturada, lo que puede dificultar el aprendizaje.

![](media/image33.png)

*Figura 11. Función sigmoide (a) y su pendiente (b); en las zonas sombreadas la neurona está saturada.*

El problema se agrava en redes profundas. Durante el entrenamiento, las pendientes de las distintas capas se multiplican entre sí; aunque todas estuvieran en su mejor punto, cinco capas darían $0.255≈0.001$ {eq-123}, de modo que la señal de corrección llega a las primeras capas casi apagada. Es el origen del problema del vanishing gradient que se estudiará en el Módulo 8. Por estas razones, hoy la sigmoide se usa sobre todo en la capa de salida de la clasificación binaria, donde su interpretación como probabilidad es justo lo que se necesita, y casi nunca en las capas intermedias.

### 3.2. TanH

#### Una sigmoide centrada en cero

La tangente hiperbólica, abreviada tanh, tiene forma de S como la sigmoide, pero su salida está entre −1 y 1:

$tanh(z) = ez − e−zez + e−z$ {eq-124}

Ambas funciones están relacionadas mediante esta expresión:

$tanh(z) = 2σ(2z) − 1$ {eq-125}

El 2 dentro de σ(2z) hace que la transición sea más rápida. Multiplicar la salida por 2 amplía su rango de (0, 1) a (0, 2), y restar 1 lo desplaza a (−1, 1), dejando el centro en cero (Figura 12a).

Así, tanh devuelve valores negativos si z es negativo, cero si z = 0 y valores positivos si z es positivo. Que la función esté centrada en cero no garantiza que la media de sus salidas sea cero: también depende de las entradas.

Estas salidas son las entradas de la siguiente capa. Durante el entrenamiento, la corrección de cada peso incluye su entrada multiplicada por una señal de corrección común a esa neurona. Con entradas siempre positivas, como las que produce la sigmoide, las correcciones de sus pesos tienen el mismo signo para un ejemplo. Con tanh, las entradas pueden tener ambos signos y los pesos pueden corregirse en sentidos distintos. Esto puede facilitar la optimización; no significa que las señales se compensen automáticamente.

#### Mejor pendiente, mismo problema

Ya sabemos que la pendiente indica cuánto cambia la salida cuando z cambia un poco. La obtenemos de nuevo derivando tanh:

$tanh′(z) = 1 − (tanh(z))2$ {eq-126}

Si llamamos p a la salida tanh(z), la pendiente es 1 − p². Para hallar su máximo, derivamos esta expresión respecto a p e igualamos la derivada a cero:

$g(p) = 1 − p2     →     g′(p) = −2p = 0     →     p = 0$ {eq-127}

Es un máximo porque g′(p) es positiva antes de cero y negativa después. La pendiente máxima vale:

$g(0) = 1 − 02 = 1$ {eq-128}

La salida tanh(z) vale cero únicamente en z = 0. En ese punto, e⁰ = 1 y obtenemos:

$tanh(0) = 1 − 11 + 1 = 0     →     tanh′(0) = 1 − 02 = 1$ {eq-129}

Por tanto, la pendiente máxima está en z = 0 y vale 1, cuatro veces la pendiente máxima de la sigmoide, que era 0.25 (Figura 12b). Cerca del centro, tanh responde más a pequeños cambios en z, lo que puede favorecer el aprendizaje, aunque no garantiza que toda la red aprenda más rápido.

Sin embargo, también se satura. Cuando su salida se acerca a −1 o a 1, su cuadrado se acerca a 1 y la pendiente $1-p2$ {eq-130} se acerca a cero. Por ejemplo, con $z=3$ {eq-131}:

$tanh(3) ≈ 0.995055$ {eq-132}

$tanh′(3) ≈ 1 − (0.995055)2 ≈ 0.0099$ {eq-133}

En esa zona, pequeños cambios en z apenas modifican la salida. Tanh mejora la pendiente cerca del centro, pero mantiene el problema de saturación y puede contribuir al desvanecimiento del gradiente al encadenar muchas capas.

Tanh se utiliza, por ejemplo, en componentes de redes recurrentes que procesan secuencias. En el visualizador de redes neuronales, compara «Sigmoid» y «Tanh» en «Activation Function Shape»: observa sus rangos y la pendiente en el centro. Después, entrena con la misma arquitectura y tasa de aprendizaje y compara la pérdida. Si la inicialización cambia entre pruebas, las diferencias no se deben únicamente a la activación.

![](media/image11.png)

*Figura 12. Tanh frente a la sigmoide (a) y comparación de sus pendientes (b).*

Hoy tanh se usa sobre todo en las capas internas de las redes recurrentes, que procesan secuencias como texto o series temporales. El visualizador de redes neuronales permite elegir la función de activación: basta con seleccionar primero «Sigmoid» y después «Tanh», manteniendo la misma arquitectura y la misma tasa de aprendizaje, y comparar el gráfico de la forma de la función («Activation Function Shape») y la evolución de la pérdida durante el entrenamiento.

### 3.3. ReLU

#### La función más sencilla posible

ReLU (Rectified Linear Unit) deja pasar los valores positivos tal cual y convierte los negativos en cero:

$ReLU(z)=max(0,z)$ {eq-134}

Funciona como una válvula antirretorno: el flujo pasa en un sentido y se bloquea en el otro (Figura 13a). Aunque está formada por dos tramos rectos, no es lineal, porque tiene un «codo» en cero. Y eso basta: combinando muchas neuronas con codos en distintos puntos, la red construye curvas por tramos, igual que una poligonal con muchos segmentos imita una curva. Es justo lo que ocurre en la frontera de la Figura 10b.

#### Por qué es la opción por defecto

ReLU es hoy la activación estándar en las capas ocultas por tres razones:

- **No se satura por arriba:** para $z>0$ {eq-135} su pendiente es siempre 1, así que la señal de corrección no se va encogiendo capa a capa por culpa de la activación. Fue una de las mejoras de algoritmos que permitieron el despegue del deep learning (Figura 5).

- **Es muy barata:** basta con comparar con cero, sin calcular exponenciales. Con millones de neuronas, la diferencia en tiempo de cálculo es notable.

- **Activa solo parte de la red:** para cada ejemplo, muchas neuronas devuelven 0, de modo que cada entrada «enciende» solo las neuronas relevantes para ella.

#### El riesgo: neuronas muertas y Leaky ReLU

El punto débil está en la zona negativa, donde la pendiente es 0 (Figura 13b). Si los pesos de una neurona quedan de forma que su $z$ {eq-136} es negativo para todos los ejemplos, su salida es siempre 0, no recibe ninguna corrección y ya no vuelve a aprender: es una neurona muerta. Suele ocurrir cuando la tasa de aprendizaje es demasiado alta y una corrección brusca la empuja a esa zona. La variante Leaky ReLU («ReLU con fugas») lo evita dejando una pequeña pendiente $α$ {eq-137}, por ejemplo 0.01, en la parte negativa:

$LeakyReLU(z)=max(αz,z)$ {eq-138}

En los modelos de lenguaje actuales se usan variantes suavizadas de la misma idea, como GELU, pero el principio es el mismo.

![](media/image21.png)

*Figura 13. ReLU y Leaky ReLU (a) y su pendiente (b).*

### 3.4. Comparativa práctica: sigmoide, tanh y ReLU

Hasta aquí, la sigmoide, tanh y ReLU se han estudiado sobre el papel: su fórmula, su forma y su pendiente. Este apartado propone comprobar su efecto en la práctica con TensorFlow Playground, una herramienta web de Google que entrena de verdad una red pequeña en el propio navegador y dibuja en directo cómo va aprendiendo. La idea es entrenar **la misma red tres veces, cambiando únicamente la función de activación**.

#### Qué se ve en la pantalla

La página se organiza en cuatro zonas:

- **Datos (izquierda):** el conjunto «Circle», con puntos azules en el centro y naranjas alrededor. Ninguna recta puede separarlos, igual que ocurría con XOR (apartado 2.2), así que la red necesita capas ocultas y una activación no lineal.

- **La red (centro):** cada cuadrado es una neurona y cada línea, una conexión. El grosor de la línea indica el tamaño del peso y su color, el signo: azul si es positivo y naranja si es negativo.

- **La salida (derecha):** el color de fondo muestra qué responde la red en cada punto del plano, es decir, su frontera de decisión. Encima aparecen la pérdida sobre los datos de prueba («Test loss») y sobre los de entrenamiento («Training loss»).

- **Controles (arriba):** el botón de reproducción inicia y pausa el entrenamiento, y el contador «Epoch» indica cuántas épocas lleva.

Para leer la pérdida basta una referencia: la herramienta codifica las dos clases como +1 y −1, y una red que todavía no ha aprendido nada responde siempre algo cercano a 0, lo que da una pérdida de 0.5. Por tanto, una pérdida en torno a 0.5 significa que la red no distingue las clases, y una pérdida cercana a 0 significa que acierta casi todo.

#### Cómo preparar el experimento

No hay que configurar nada: cada prueba tiene su propio enlace, que abre la página con todo ya ajustado. Las tres redes comparten la misma configuración:

- **Datos:** conjunto «Circle», sin ruido y con la mitad de los puntos para entrenar y la otra mitad para la prueba.

- **Entradas:** las dos coordenadas de cada punto, X₁ y X₂.

- **Red:** dos capas ocultas de 4 neuronas cada una.

- **Entrenamiento:** tasa de aprendizaje 0.03 y lotes de 10 ejemplos (la idea de lote se explica en el Módulo 8).

- **Semilla:** el mismo valor en las tres. La semilla es el número que fija tanto los datos como los pesos iniciales, de modo que las tres redes parten exactamente del mismo punto y todo el que abra el enlace ve lo mismo.

Lo único que cambia de un enlace a otro es la función de activación. En cada prueba se abre el enlace, se pulsa el botón de reproducción y se observa la pérdida en dos momentos: hacia la época 100 y, dejando correr el entrenamiento, hacia la época 1000. Para repetir una prueba desde cero basta con volver a abrir su enlace.

#### Prueba 1: sigmoide

**Enlace:** Abrir la red con activación sigmoide.

**Qué observar:** durante varios cientos de épocas, la pérdida se queda clavada en torno a 0.5 y el fondo de la salida apenas toma color: la red no distingue nada. Al cabo de un tiempo, la pérdida cae de golpe y aparece un círculo alrededor de los puntos azules. La red acaba aprendiendo, pero mucho más tarde que en las otras dos pruebas.

**Por qué:** la pendiente de la sigmoide vale como mucho 0.25, y durante el entrenamiento las pendientes de las capas se multiplican entre sí. Con dos capas ocultas, incluso en el mejor de los casos, la señal de corrección que llega a la primera capa queda multiplicada por $0.252=0.0625$ {eq-139}: menos de una décima parte. Las correcciones son diminutas y la red tarda mucho en salir de su punto de partida.

#### Prueba 2: tanh

**Enlace:** Abrir la red con activación tanh.

**Qué observar:** antes de la época 100, la pérdida ya está cerca de 0 y la salida muestra una frontera circular, de borde suave, que separa limpiamente las dos clases.

**Por qué:** la pendiente máxima de tanh es 1, cuatro veces la de la sigmoide, así que las correcciones llegan a las primeras capas mucho menos encogidas. Además, sus salidas pueden ser positivas o negativas, lo que permite corregir los pesos en sentidos distintos.

#### Prueba 3: ReLU

**Enlace:** Abrir la red con activación ReLU.

**Qué observar:** también aprende antes de la época 100, a un ritmo parecido al de tanh. La diferencia está en la forma de la frontera: en lugar de un círculo suave, es un polígono de lados rectos. Cada neurona aporta un «codo» y la red construye la curva por tramos, como en la Figura 10b.

**Por qué:** para valores positivos su pendiente es siempre 1 y no se satura, así que la señal de corrección no se encoge capa a capa. En una red tan pequeña como esta, tanh y ReLU quedan prácticamente empatadas; la ventaja de ReLU aparece cuando la red es más profunda, como muestra la prueba siguiente.

#### Una prueba más: una red profunda

Estos tres enlaces repiten el experimento con **seis capas ocultas de 4 neuronas**, el máximo que permite la herramienta, sin cambiar nada más:

- **Sigmoide:** Abrir la red profunda con sigmoide.

- **Tanh:** Abrir la red profunda con tanh.

- **ReLU:** Abrir la red profunda con ReLU.

Lo esperable es que la sigmoide no aprenda nada: aunque se deje correr más de mil épocas, la pérdida no se mueve de 0.5. Con seis capas, la señal de corrección se multiplica en el mejor de los casos por $0.256≈0.0002$ {eq-140} y llega a las primeras capas prácticamente apagada. Tanh suele aprender, aunque más despacio que antes y con algún riesgo de atascarse, y ReLU aprende tan rápido como en la red pequeña. Es el problema del vanishing gradient, que se estudiará en el Módulo 8, y la razón por la que ReLU es la opción por defecto en las redes profundas.

Con ReLU puede aparecer además el riesgo del apartado 3.3: alguna neurona del centro de la pantalla queda de un color uniforme, sin dibujo, porque su salida es 0 para todos los puntos. Es una neurona muerta, que ya no participa en el aprendizaje.

#### Cómo leer los resultados

Antes de sacar conclusiones conviene tener en cuenta dos precauciones:

- **El resultado depende de la semilla:** los enlaces fijan una semilla para que todos vean lo mismo. El botón «Regenerate», bajo los datos, genera otra distinta; con ella cambian las épocas exactas en las que aprende cada red, pero el patrón general se mantiene.

- **El resultado depende del problema:** el orden descrito es el habitual, pero no una ley. Con otros datos, otra arquitectura u otra tasa de aprendizaje, las diferencias pueden ser mayores, menores o incluso invertirse.

### 3.5. Softmax

#### De dos clases a muchas

La sigmoide sirve cuando hay dos clases, pero muchos problemas tienen más: clasificar un ticket de soporte como facturación, incidencia técnica o consulta comercial, o reconocer qué dígito del 0 al 9 aparece en un documento digitalizado (OCR, apartado 5). En estos casos, la capa de salida tiene una neurona por clase, cada una calcula una puntuación $zk$ {eq-141} y softmax convierte todas las puntuaciones a la vez en probabilidades que suman 1:

$softmax(z)k=ezkj=1Kezj$ {eq-142}

donde $K$ {eq-143} es el número de clases. A diferencia de las funciones anteriores, softmax no actúa neurona a neurona, sino sobre toda la capa. Trabaja en dos pasos:

- Exponencial: convierte cada puntuación en un número positivo y agranda las diferencias entre ellas.

- Normalización: divide cada resultado entre la suma de todos, de modo que el total sea 1.

Es como repartir un premio entre varios candidatos en proporción a su puntuación, pero con ventaja extra para el que va por delante: por cada punto de diferencia en $z$ {eq-144}, la probabilidad se multiplica por $e≈2.72$ {eq-145}.

#### Ejemplo: clasificar tickets de soporte

Una red recibe el texto de un ticket y su capa de salida da las puntuaciones 2.0 para facturación, 1.0 para incidencia técnica y 0.1 para consulta comercial. La Tabla 8 aplica softmax paso a paso.

*Tabla 8. Cálculo de softmax para un ticket de soporte.*

| **Clase** | **Puntuación z** | **Exponencial** | **Probabilidad** |
|---|---|---|---|
| Facturación | 2.0 | 7.39 | 0.659 (65.9 %) |
| Incidencia técnica | 1.0 | 2.72 | 0.242 (24.2 %) |
| Consulta comercial | 0.1 | 1.11 | 0.099 (9.9 %) |
| Total | – | 11.21 | 1.000 (100 %) |

La red asigna el ticket a facturación con un 65.9 % de probabilidad (Figura 14). Se cumple la regla anterior: la facturación supera en un punto a la incidencia técnica y su probabilidad es 2.72 veces mayor (0.659 / 0.242). Además, sumar la misma cantidad a todas las puntuaciones no cambia el resultado: solo importan las diferencias entre ellas.

![](media/image22.png)

*Figura 14. Puntuaciones de la capa de salida (a) y probabilidades obtenidas con softmax (b).*

Con solo dos clases, softmax da exactamente el mismo resultado que una sigmoide aplicada a la diferencia de puntuaciones, $σ(z1−z2)$ {eq-146}: la sigmoide es un caso particular de softmax. Por eso softmax se reserva para la capa de salida de la clasificación multiclase y no se usa en las capas ocultas.

#### Resumen: qué función usar en cada capa

Para ver las diferencias de un vistazo, la Tabla 9 aplica cada función a la neurona del correo de la Tabla 2, antes ($z=1$ {eq-147}) y después ($z=−1$ {eq-148}) de corregir sus pesos.

*Tabla 9. Salida de la neurona del correo con cada función de activación.*

| **Función** | **z = 1 (antes de corregir)** | **z = −1 (después de corregir)** | **Cómo se lee** |
|---|---|---|---|
| Escalón | 1 | 0 | Spam o no spam, sin matices |
| Sigmoide | 0.73 | 0.27 | Probabilidad de que sea spam |
| TanH | 0.76 | −0.76 | Señal a favor o en contra, centrada en cero |
| ReLU | 1 | 0 | Deja pasar la señal positiva y anula la negativa |

*Tabla 10. Comparativa de las funciones de activación.*

| **Función** | **Rango de salida** | **Ventaja principal** | **Inconveniente principal** | **Uso habitual** |
|---|---|---|---|---|
| Sigmoide | De 0 a 1 | Se interpreta como probabilidad | Se satura; salida siempre positiva | Salida en clasificación binaria |
| TanH | De −1 a 1 | Centrada en cero; pendiente hasta 4 veces mayor | También se satura | Capas internas de redes recurrentes |
| ReLU | De 0 a infinito | No se satura para z > 0; muy barata | Neuronas muertas si z < 0 siempre | Capas ocultas (opción por defecto) |
| Softmax | De 0 a 1, suman 1 | Probabilidades para K clases | Solo tiene sentido en la salida | Salida en clasificación multiclase |

En las capas ocultas la elección suele ser ReLU. En la capa de salida, en cambio, la función la dicta el tipo de problema, como resume la Tabla 11 con aplicaciones del apartado 5.

*Tabla 11. Activación de la capa de salida según el tipo de problema.*

| **Tipo de problema** | **Ejemplo** | **Neuronas de salida** | **Activación** | **Qué devuelve** |
|---|---|---|---|---|
| Regresión | Valoración inmobiliaria, previsión de demanda | 1 | Ninguna (identidad) | Un número cualquiera |
| Clasificación binaria | Riesgo crediticio, detección de spam | 1 | Sigmoide | Probabilidad de la clase 1 |
| Clasificación multiclase | OCR de dígitos, tipo de ticket | Una por clase | Softmax | Probabilidades que suman 1 |
| Clasificación multietiqueta | Etiquetar una foto con «coche», «persona» y «semáforo» a la vez | Una por etiqueta | Sigmoide en cada neurona | Probabilidades independientes |

En resumen, la función de activación es lo que permite a una red ir más allá de una recta, y cada una aporta algo distinto: la sigmoide, probabilidades; tanh, salidas centradas en cero; ReLU, un aprendizaje rápido en redes profundas; y softmax, probabilidades para varias clases. Sus puntos débiles, la saturación y las neuronas muertas, tienen que ver con la pendiente de la función, y cobrarán todo su sentido en el Módulo 8, al estudiar cómo aprende la red mediante backpropagation y descenso por gradiente.

## 4. Red Neuronal Multicapa

En el apartado 2.2 se resolvió XOR combinando tres perceptrones en dos capas, aunque con los pesos elegidos a mano y con la función escalón. Si el escalón se sustituye por las activaciones del apartado 3 y la idea se generaliza a muchas neuronas y muchas capas, se obtiene el **perceptrón multicapa** (MLP, *Multilayer Perceptron*), la red neuronal «clásica» y el punto de partida de todo el deep learning. Este apartado describe cómo está organizada, cómo circula la información por ella, qué puede aprender y qué tipos de capas existen.

### 4.1. Introducción: de una neurona a una red

#### Cómo se organiza: capas totalmente conectadas

Un perceptrón multicapa ordena sus neuronas en capas sucesivas (Figura 15a):

- **Capa de entrada:** recibe los datos, con una neurona por variable. No calcula nada; solo reparte los valores a la capa siguiente.

- **Capas ocultas:** una o varias capas intermedias que transforman los datos. Se llaman ocultas porque sus valores no aparecen ni en los datos ni en el resultado: son representaciones internas que la red construye por sí misma.

- **Capa de salida:** produce la predicción final, con el número de neuronas y la activación que dicte el tipo de problema (Tabla 11).

Cada neurona está conectada con todas las de la capa anterior, por eso se dice que las capas son densas o totalmente conectadas. Además, la información circula siempre hacia delante, de la entrada a la salida, sin volver atrás, y por eso este tipo de red se denomina también red feedforward («hacia delante»). La arquitectura se suele describir con el número de neuronas de cada capa: la red de la Figura 15a es una 3-4-4-1.

Cada neurona oculta hace exactamente lo mismo que la neurona del apartado 1.2: multiplica cada valor que le llega por su peso, suma los resultados, añade su sesgo y aplica su función de activación. Para la neurona $j$ {eq-149} de una capa que recibe $n$ {eq-150} valores:

$hj=f(i=1nwjixi+bj)$ {eq-151}

donde $wji$ {eq-152} es el peso de la conexión que va de la entrada $i$ {eq-153} a la neurona $j$ {eq-154}. Todos los pesos de una capa se agrupan en una tabla de números (una matriz) $W$ {eq-155} y todos sus sesgos en un vector $b$ {eq-156}; de ahí las etiquetas $W(1)$ {eq-157}, $b(1)$ {eq-158}… de la Figura 15a, donde el superíndice indica la capa. La red completa no es más que una cadena de estos cálculos, en la que la salida de cada capa es la entrada de la siguiente:

$ŷ=f(3)(f(2)(f(1)(x)))$ {eq-159}

donde cada $f(k)$ {eq-160} representa el cálculo completo de la capa $k$ {eq-161}: suma ponderada, sesgo y activación. Funciona como una cadena de montaje: cada puesto recibe la pieza del anterior, le aplica una transformación y la pasa al siguiente, y el producto final solo aparece al terminar la cadena.

![](media/image36.png)

*Figura 15. Estructura general de un perceptrón multicapa (a) y red de dos capas con ReLU y sigmoide que resuelve XOR (b).*

#### Propagación hacia delante: un ejemplo resuelto

Calcular la predicción de la red para un ejemplo se llama **propagación hacia delante** (*forward pass*). Para verlo con números se retoma la conciliación banco-contabilidad del apartado 2.2: debe saltar una alerta ($y=1$ {eq-162}) solo si el pago aparece en un sistema y no en el otro. La red de la Figura 15b lo resuelve con dos neuronas ocultas ReLU y una neurona de salida sigmoide:

$h1=ReLU(x1+x2)$ {eq-163}

$h2=ReLU(x1+x2−1)$ {eq-164}

$z=4h1−8h2−2$ {eq-165}

$ŷ=σ(z)$ {eq-166}

Para un pago que figura en el banco pero no en contabilidad, $(x1,x2)=(1,0)$ {eq-167}, el cálculo avanza capa a capa:

- **Capa oculta:** $h1=ReLU(1+0)=1$ {eq-168} y $h2=ReLU(1+0−1)=ReLU(0)=0$ {eq-169}.

- **Capa de salida:** $z=4· 1−8· 0−2=2$ {eq-170}, y la sigmoide da $ŷ=σ(2)≈ 0.88$ {eq-171}.

La red estima un 88 % de probabilidad de descuadre y lanza la alerta. La Tabla 12 repite el cálculo para los cuatro casos. A diferencia de la red de la Tabla 6, que respondía con un 1 o un 0 rotundos, esta devuelve una probabilidad y usa activaciones con pendiente, que son las que permitirán entrenarla en el Módulo 8.

*Tabla 12. Propagación hacia delante de la red de la Figura 15b en los cuatro casos.*

| **x₁** | **x₂** | **h₁** | **h₂** | **z** | **ŷ = σ(z)** | **¿Alerta?** |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | −2 | 0.12 | No |
| 0 | 1 | 1 | 0 | 2 | 0.88 | Sí |
| 1 | 0 | 1 | 0 | 2 | 0.88 | Sí |
| 1 | 1 | 2 | 1 | −2 | 0.12 | No |

#### Qué hacen las capas ocultas: cambiar el punto de vista

La Tabla 12 esconde la idea central de las redes multicapa. Si en lugar de mirar las entradas $(x1,x2)$ {eq-172} se miran los valores de la capa oculta $(h1,h2)$ {eq-173}, los cuatro casos se convierten en solo tres puntos: (0, 0); (1, 0), donde caen a la vez los dos casos de descuadre; y (2, 1). En ese nuevo espacio, una sola recta separa las alertas del resto (Figura 16b): el problema que era imposible para un perceptrón (Figura 16a) se ha vuelto linealmente separable, y la neurona de salida, que no es más que un perceptrón con sigmoide, lo resuelve sin dificultad.

Es lo que hace cualquier red multicapa, a mayor escala: las capas ocultas **transforman los datos en una representación nueva** en la que el problema resulta sencillo para la capa de salida. Es lo mismo que hace un analista cuando crea variables nuevas a partir de las originales (ratios, indicadores, combinaciones) hasta que el patrón se ve con claridad. La diferencia es que la red construye esas variables por sí sola, aprendiéndolas a partir de los ejemplos, en lugar de que alguien las diseñe a mano.

![](media/image19.png)

*Figura 16. Los cuatro casos de XOR en el espacio de las entradas (a) y en el espacio de la capa oculta, donde una recta los separa (b).*

#### ¿Qué puede aprender una red? El teorema de aproximación universal

Cybenko (1989) y Hornik (1991) demostraron el **teorema de aproximación universal**: una red con una sola capa oculta y suficientes neuronas puede aproximar cualquier función continua con la precisión que se desee. Con ReLU la intuición es directa: cada neurona oculta aporta un «codo» (apartado 3.3), así que con $k$ {eq-174} neuronas la red puede construir una poligonal de $k$ {eq-175} tramos. En la Figura 17, una curva de demanda a lo largo del día, con picos por la mañana y por la tarde, se aproxima con 3 neuronas de forma tosca y con 12 casi a la perfección.

![](media/image26.png)

*Figura 17. Aproximación de una curva de demanda diaria con una capa oculta de 3 neuronas ReLU (a) y de 12 neuronas (b).*

Igual que el teorema de convergencia del perceptrón (apartado 2.2), este resultado tiene su letra pequeña:

- **Dice que la red existe, no cómo encontrarla:** garantiza que hay unos pesos adecuados, pero no que el entrenamiento llegue a ellos. De eso se ocupa el Módulo 8.

- **No dice cuántas neuronas hacen falta:** para relaciones complicadas, el número de neuronas necesarias en una sola capa puede ser enorme.

- **Aproximar no es generalizar:** una red capaz de ajustarse a cualquier cosa también puede memorizar el ruido de los datos de entrenamiento. Es el sobreajuste, que se trata en el Módulo 8.

#### Profundidad frente a anchura

Si una capa basta en teoría, ¿por qué usar varias? Porque en la práctica es mucho más eficiente repartir el trabajo en etapas. Con varias capas, cada una construye sobre lo que calcula la anterior: en una imagen, las primeras capas detectan bordes, las siguientes combinan bordes en formas y las últimas combinan formas en objetos (Módulo 9). Igual que una empresa no organiza a cien personas reportando todas al director, sino en equipos y niveles, una red profunda organiza sus neuronas en niveles que se apoyan unos en otros, y para muchos problemas necesita muchas menos neuronas que una red con una única capa muy ancha.

#### Cuántos parámetros tiene una red

Entre dos capas densas, una con $n$ {eq-176} neuronas y la siguiente con $m$ {eq-177}, hay un peso por cada conexión y un sesgo por cada neurona de destino:

$parámetros=n· m+m$ {eq-178}

La red de reconocimiento de dígitos que se usará en el apartado 5.3 recibe imágenes de 8 × 8 píxeles (64 entradas), tiene una capa oculta de 32 neuronas y una capa de salida de 10 neuronas, una por dígito. La Tabla 13 cuenta sus parámetros.

*Tabla 13. Parámetros de la red 64-32-10 de reconocimiento de dígitos.*

| **Conexión** | **Pesos (n · m)** | **Sesgos (m)** | **Total** |
|---|---|---|---|
| Entrada → oculta (64 → 32) | 2048 | 32 | 2080 |
| Oculta → salida (32 → 10) | 320 | 10 | 330 |
| **Red completa** | **2368** | **42** | **2410** |

Son 2410 valores que el entrenamiento debe ajustar. La cifra crece muy deprisa con el tamaño de la entrada: con imágenes de 28 × 28 píxeles (784 entradas) y 128 neuronas ocultas, la red supera los 100.000 parámetros, y una foto en color de 1000 × 1000 píxeles conectada a una capa densa de 1000 neuronas superaría los 3000 millones solo en esa capa. Ese crecimiento es la razón por la que, para imágenes, se usan otros tipos de capa.

### 4.2. Tipos de capa

Hasta aquí todas las capas eran iguales: densas y con el mismo cálculo. En la práctica, las capas se distinguen por dos criterios: el papel que cumplen dentro de la red (entrada, oculta o salida) y la forma en que conectan sus neuronas, que depende del tipo de dato.

#### Según su papel: entrada, ocultas y salida

La Tabla 14 resume qué hace cada capa y qué hay que decidir en cada una. Tres ideas prácticas la completan:

- **La capa de entrada exige datos preparados:** la red sólo admite números, así que las variables categóricas deben codificarse (por ejemplo, con one-hot) y las numéricas escalarse a rangos parecidos. Una red que recibe ingresos en euros, del orden de decenas de miles, junto a la antigüedad en años, del orden de unidades, aprende mucho peor.

- **El tamaño de las capas ocultas se elige probando:** el número de capas y de neuronas son hiperparámetros, y no hay fórmula para fijarlos. Una pauta razonable es empezar con una o dos capas de 32 a 64 neuronas, ampliar si la red no aprende lo suficiente y reducir o regularizar si memoriza los datos (Módulo 8), comparando siempre sobre datos de validación.

- **La capa de salida la dicta el problema:** su número de neuronas y su activación dependen de si se predice un número, una clase o varias etiquetas, como se vio en la Tabla 11.

*Tabla 14. Papel de cada tipo de capa en un perceptrón multicapa.*

| **Capa** | **Qué hace** | **Cuántas neuronas** | **Activación** | **Decisión clave** |
|---|---|---|---|---|
| Entrada | Recibe los datos; no calcula nada | Una por variable (tras codificar) | Ninguna | Codificar y escalar los datos |
| Ocultas | Transforman los datos en representaciones útiles | Hiperparámetro: típicamente de 16 a 512 por capa | ReLU (por defecto) | Cuántas capas y cuántas neuronas |
| Salida | Da la respuesta en el formato del problema | Una, o una por clase o etiqueta | Identidad, sigmoide o softmax | Elegir según la Tabla 11 |

#### Según cómo conectan: más allá de la capa densa

La capa densa es universal, pero no siempre la más adecuada. Con imágenes, su número de parámetros se dispara, y además ignora la estructura del dato: para ella, el píxel de al lado y el del otro extremo de la imagen son igual de «vecinos», y da igual que una palabra esté al principio o al final de la frase. Por eso existen capas especializadas que incorporan esa estructura (Figura 18):

- **Capa densa:** cada neurona está conectada a todas las entradas. Es la opción para datos tabulares y la que se usa al final de casi cualquier red para dar la respuesta.

- **Capa convolucional:** cada neurona mira solo una pequeña ventana de la entrada, unos pocos píxeles vecinos, y todas comparten los mismos pesos, que se desplazan por la imagen como una lupa (Figura 18b). Así detecta un mismo patrón, como un borde o una mancha, esté donde esté, y con muchísimos menos parámetros. Es la base de la visión por computador.

- **Capa recurrente:** procesa una secuencia elemento a elemento y guarda una **memoria** que pasa de un paso al siguiente (Figura 18c). Así, al leer «recibido», la red sabe que antes apareció «no». Sus variantes más conocidas son LSTM y GRU, usadas con texto y series temporales.

- **Capa de atención:** permite que cada elemento de una secuencia «consulte» directamente a todos los demás y decida a cuáles dar más importancia. Es la pieza central de la arquitectura Transformer (2017), en la que se basan los modelos de lenguaje actuales, y ha desplazado a las capas recurrentes en la mayoría de tareas de texto.

![](media/image30.png)

*Figura 18. Tres formas de conectar una capa: densa (a), convolucional, con una ventana de pesos compartidos (b), y recurrente, con memoria entre pasos (c).*

#### Capas auxiliares

Además de las capas que aprenden representaciones, las redes actuales incluyen capas auxiliares que preparan los datos o ayudan al entrenamiento:

- **Embedding:** convierte elementos discretos, como palabras o códigos de producto, en vectores de números que la red aprende, de modo que elementos parecidos acaban con vectores parecidos. Es la puerta de entrada del texto (apartado 5.4).

- **Pooling:** resume cada zona de una imagen, por ejemplo quedándose con el valor máximo de cada bloque de 2 × 2 píxeles, para reducir su tamaño. Acompaña a las capas convolucionales.

- **Dropout:** durante el entrenamiento, «apaga» al azar una parte de las neuronas en cada paso para que la red no dependa de ninguna en concreto. Es una técnica contra el sobreajuste (Módulo 8).

- **Normalización:** reescalan los valores que pasan de una capa a otra para mantenerlos en rangos estables, lo que acelera y estabiliza el entrenamiento.

*Tabla 15. Principales tipos de capa según cómo conectan sus neuronas.*

| **Tipo de capa** | **Cómo conecta** | **Datos típicos** | **Ejemplo (apartado 5)** | **Dónde se estudia** |
|---|---|---|---|---|
| Densa | Cada neurona con todas las entradas | Tabulares | Riesgo crediticio | Apartado 4 y Módulo 8 |
| Convolucional | Ventana local con pesos compartidos | Imágenes; también audio | Control de calidad, OCR | Módulo 9 |
| Recurrente (LSTM, GRU) | Paso a paso, con memoria | Secuencias: texto, series temporales | Previsión de demanda | Módulo 9 |
| Atención (Transformer) | Cada elemento con todos los demás | Texto; también imágenes y audio | Traducción, transcripción | Módulo 9 |
| Embedding | Asigna un vector aprendido a cada elemento | Palabras, categorías con muchos valores | Detección de spam | Apartado 5.4 y Módulo 9 |

En resumen, un perceptrón multicapa encadena capas de neuronas que transforman los datos paso a paso hasta que el problema se vuelve sencillo para la capa de salida. Con una sola capa oculta ya puede aproximar cualquier relación, pero apilar capas lo hace más eficiente, y elegir el tipo de capa según el dato (densa, convolucional, recurrente o de atención) permite aplicar la misma idea a tablas, imágenes, texto o audio. Queda por ver cómo se ajustan sus pesos, que es el objeto del Módulo 8.

## 5. Aplicaciones comunes

Las redes neuronales se aplican hoy en prácticamente cualquier sector. Este apartado recorre doce aplicaciones habituales agrupadas en cuatro familias. Conviene advertir que las familias combinan dos criterios distintos: clasificación y regresión hablan del **tipo de respuesta** que se busca, mientras que visión por computador y lenguaje y voz hablan del **tipo de dato** que se recibe. Por eso una aplicación puede pertenecer a dos familias a la vez: el OCR es visión por computador, pero lo que hace es clasificar caracteres. La Figura 23, al final del apartado, sitúa las doce aplicaciones según ambos criterios.

Para cada aplicación se indica qué datos recibe la red, cómo es su capa de salida (Tabla 11) y qué hay que vigilar al ponerla en marcha.

### 5.1. Clasificación y categorización

En clasificación, la red asigna cada ejemplo a una categoría. Con dos clases, la salida es una neurona sigmoide que devuelve la probabilidad de la clase positiva; con más de dos, una neurona por clase y softmax.

#### Evaluación de riesgo crediticio

Un banco quiere estimar la probabilidad de que un solicitante no devuelva un préstamo. Es la versión realista del ejemplo del apartado 2.1: en lugar de dos condiciones de sí o no, la red recibe variables como los ingresos, el ratio entre deuda e ingresos, la antigüedad laboral o los impagos previos, y su neurona de salida sigmoide devuelve la probabilidad de impago (Figura 19a).

La salida no es la decisión: la decisión la pone el **umbral**. En una cartera simulada de 4000 clientes, de los que alrededor del 10 % impaga, la red de la Figura 19 detecta con un umbral de 0.5 solo el 34 % de los impagos, a cambio de rechazar a apenas el 1 % de los buenos clientes; si el umbral baja a 0.2, detecta el 66 % de los impagos, pero rechaza al 9 % de los buenos (Figura 19b). Cuál conviene depende de lo que cueste cada tipo de error, y es exactamente el análisis de clases desbalanceadas, precision y recall del Módulo 6.

![](media/image24.png)

*Figura 19. Red para estimar la probabilidad de impago (a) y probabilidades que asigna a clientes que pagaron y que impagaron, con dos umbrales de decisión (b). Datos simulados.*

Hay dos advertencias propias de este caso. La primera, que con datos tabulares como estos los modelos de árboles suelen rendir igual o mejor (apartado 1.2). La segunda, que el banco debe poder explicar por qué deniega un crédito, algo difícil con una red de miles de pesos: el Reglamento europeo de IA considera de alto riesgo los sistemas que evalúan la solvencia de las personas y les exige transparencia y supervisión humana. Por eso, en banca se usan a menudo modelos más interpretables o técnicas de explicación añadidas al modelo.

#### Diagnóstico médico preliminar

La red recibe datos de un paciente, que pueden ser tabulares (resultados de una analítica, constantes vitales, síntomas) o imágenes (radiografías, fotografías de lesiones de la piel, imágenes del fondo de ojo), y devuelve la probabilidad de una o varias patologías. Con imágenes, las redes convolucionales alcanzan en tareas concretas una precisión comparable a la de los especialistas.

La palabra clave es **preliminar**: la red no diagnostica, sino que prioriza y avisa; por ejemplo, ordena las radiografías del día para que el radiólogo revise primero las sospechosas. Esto condiciona el diseño:

- **Prima el recall:** no detectar a un enfermo (falso negativo) es mucho más grave que una falsa alarma, que solo supone una prueba adicional. El umbral se fija bajo, aceptando más falsos positivos (Módulo 6).

- **Clases muy desbalanceadas:** la gran mayoría de los pacientes están sanos, así que una exactitud del 99 % puede no significar nada.

- **Validación y regulación:** un modelo puede funcionar bien en el hospital donde se entrenó y fallar en otro con equipos o pacientes distintos. En la UE, el software con finalidad diagnóstica se considera producto sanitario y necesita certificación.

#### Detección de spam

Es el ejemplo que acompaña al documento desde la Tabla 2, ahora a escala real. En lugar de tres variables elegidas a mano, la red recibe el texto completo del correo convertido en números (apartado 5.4), junto con datos del remitente y de los enlaces, y devuelve la probabilidad de spam con una neurona sigmoide. Tiene dos particularidades:

- **Coste asimétrico, pero al revés que en medicina:** enviar a la carpeta de spam una factura legítima es peor que dejar pasar un anuncio, así que el umbral se fija alto.

- **Un adversario que se adapta:** los emisores de spam modifican sus mensajes para esquivar el filtro («GR4TIS»), de modo que el modelo pierde eficacia con el tiempo y debe reentrenarse con los correos que marcan los usuarios, como en el paso 6 de la Tabla 2.

*Tabla 16. Aplicaciones de clasificación.*

| **Aplicación** | **Entradas** | **Capa de salida** | **Error más costoso** | **Red habitual** |
|---|---|---|---|---|
| Riesgo crediticio | Ingresos, deuda, historial de pagos | 1 neurona sigmoide: probabilidad de impago | Conceder el préstamo a quien no lo devolverá | Densa (a menudo superada por árboles) |
| Diagnóstico preliminar | Analíticas o imágenes médicas | Sigmoide por patología, o softmax | No detectar a un enfermo (falso negativo) | Densa (tabular) o convolucional (imagen) |
| Detección de spam | Texto, remitente, enlaces | 1 neurona sigmoide: probabilidad de spam | Bloquear un correo legítimo (falso positivo) | Embedding y densa, o Transformer |

### 5.2. Regresión y predicción numérica

En regresión, la red predice un número, por lo que la capa de salida es una sola neurona sin activación (identidad), que puede devolver cualquier valor (Tabla 11). El error se mide con las métricas de regresión ya conocidas, como MAE o RMSE (Módulo 6), y es en estas aplicaciones donde la red compite más directamente con los modelos clásicos.

#### Valoración inmobiliaria

Una agencia o un banco que concede hipotecas necesita estimar el precio de una vivienda a partir de sus características: superficie, número de habitaciones, zona, antigüedad o planta. La red capta relaciones no lineales que una regresión lineal no recoge, como que el valor de cada metro cuadrado depende de la zona o que la antigüedad penaliza más a las viviendas grandes.

En la Figura 20a, una red 7-32-16-1 entrenada con 1875 viviendas simuladas estima el precio de otras 625 que no había visto con un error medio de unos 22000 €, en torno al 7 % del precio medio. La ventaja diferencial de las redes aparece cuando se añaden datos no tabulares, como las fotos de la vivienda o el texto del anuncio: una misma red puede combinar una parte convolucional para las fotos, otra para el texto y otra densa para las variables, lo que se llama un modelo **multimodal**. Con solo variables tabulares, los modelos de árboles siguen siendo la referencia.

#### Previsión de demanda de recursos

Consiste en prever cuántos recursos harán falta: agentes por franja horaria en un centro de atención telefónica, consumo eléctrico de una planta, capacidad de los servidores de una aplicación o camas en un hospital. Es un problema de series temporales (Módulo 5): la red recibe los valores de los últimos días o semanas, las **variables de retardo**, junto con variables de calendario (día de la semana, festivos) y externas (temperatura, campañas), y predice el valor de los próximos periodos.

La Figura 20b muestra una red con una capa oculta de 16 neuronas que prevé la demanda de cada día de las tres últimas semanas a partir de los 14 días anteriores, con un error medio cercano al 6 %, y que reproduce el patrón semanal: picos los viernes y caídas el fin de semana. Frente a ARIMA (Módulo 5), la red no exige que la serie sea estacionaria y admite con facilidad muchas variables externas, pero necesita más datos y es menos interpretable. Con una única serie corta, un ARIMA bien ajustado suele ser suficiente.

![](media/image3.png)

*Figura 20. Precio estimado frente a precio real de las viviendas de prueba (a) y previsión de la demanda diaria en las tres últimas semanas (b). Datos simulados.*

#### Predicción de ventas

Parece el mismo problema que el anterior, pero suele tener una escala muy distinta: una cadena de distribución necesita prever las ventas de miles de productos en cientos de tiendas. Ajustar un modelo clásico por cada serie es inviable y, además, muchas series son cortas o irregulares, como las de productos nuevos o de venta esporádica. Aquí las redes aportan una ventaja real: un único modelo **global**, entrenado con todas las series a la vez, aprende patrones compartidos (el efecto de una promoción, la campaña de Navidad, el lanzamiento de un producto parecido) y los traslada a las series con pocos datos.

Las entradas combinan el histórico de ventas, el precio, las promociones, el calendario y datos del producto y de la tienda, estos últimos a menudo mediante embeddings. Más que un único número, conviene predecir un rango, por ejemplo las ventas que no se superarán en el 90 % de los casos, porque lo que se decide con la previsión es cuánto stock reponer: la capa de salida tiene entonces una neurona por cada límite del rango.

*Tabla 17. Aplicaciones de regresión.*

| **Aplicación** | **Entradas** | **Salida** | **Métrica habitual** | **Cuándo compensa una red** |
|---|---|---|---|---|
| Valoración inmobiliaria | Superficie, zona, antigüedad; fotos y texto del anuncio | Precio (1 neurona, identidad) | MAE en euros | Al combinar fotos o texto con las variables |
| Demanda de recursos | Retardos, calendario, temperatura, campañas | Demanda de los próximos periodos | MAE, RMSE, error porcentual | Muchas variables externas o relaciones no lineales |
| Predicción de ventas | Histórico, precio, promociones, producto y tienda | Ventas por producto y tienda, a menudo como rango | Error porcentual por producto | Miles de series relacionadas: un modelo global |

### 5.3. Visión por computador

Para una red, una imagen es una tabla de números: cada píxel es un valor de intensidad, o tres (rojo, verde y azul) si la imagen es en color. La Figura 21a muestra un dígito manuscrito escaneado de 8 × 8 píxeles, del conjunto de dígitos incluido en la librería scikit-learn: sus 64 valores, de 0 (blanco) a 16 (negro), son las 64 entradas de la red de la Tabla 13. Como se vio en el apartado 4.1, con imágenes reales el número de pesos de una red densa se dispara, por lo que en visión se usan redes **convolucionales** (apartado 4.2), que se estudiarán en el Módulo 9.

#### Control de calidad industrial

Una cámara fotografía cada pieza en la línea de producción y una red decide si es correcta o defectuosa (sigmoide) o qué tipo de defecto tiene (softmax): grietas, rayas, poros, soldaduras incompletas o etiquetas mal colocadas. Frente a la inspección manual, no se cansa, revisa el 100 % de las piezas y trabaja al ritmo de la línea.

Su dificultad típica es que los defectos son raros: puede haber decenas de miles de fotos de piezas buenas y solo unas decenas de piezas defectuosas. Se combate con **aumento de datos**, que genera variantes de las fotos defectuosas girándolas, cambiando su brillo o recortándolas, o planteando el problema como **detección de anomalías**: la red se entrena solo con piezas buenas y marca como sospechosa cualquier pieza que se aparte de lo aprendido. Además, la iluminación y la posición de la cámara deben mantenerse estables, porque un cambio en ellas puede degradar el modelo sin que nadie lo note.

#### Reconocimiento facial

Engloba dos tareas distintas: la **verificación** (¿es esta persona quien dice ser?, como al desbloquear el móvil) y la **identificación** (¿quién es esta persona?, buscándola en una base de datos). En ninguna de las dos se usa una salida con una neurona por persona, porque habría que reentrenar la red cada vez que se añadiera alguien. En su lugar, la red convierte cada cara en un vector de unos cientos de números, una especie de huella numérica de la cara (un embedding), entrenada para que las fotos de una misma persona den vectores cercanos y las de personas distintas, vectores lejanos. Verificar consiste en comprobar si la distancia entre dos vectores está por debajo de un umbral.

Es la aplicación de visión con más implicaciones legales. Los datos biométricos son una categoría especial en el RGPD, y el Reglamento europeo de IA prohíbe algunos usos, como crear bases de datos de caras recopilando imágenes de internet de forma indiscriminada, y considera de alto riesgo la mayoría de sistemas de identificación biométrica. Además, se ha documentado que muchos sistemas cometen más errores con unos grupos de población que con otros cuando los datos de entrenamiento no son representativos.

#### Digitalización de texto (OCR)

El reconocimiento óptico de caracteres (OCR, *Optical Character Recognition*) convierte la imagen de un documento, como una factura escaneada, un albarán o un DNI fotografiado, en texto editable. Es el ejemplo de clasificación multiclase del apartado 3.5: en su forma más sencilla, la red recibe la imagen de un carácter y devuelve, con softmax, la probabilidad de cada símbolo posible.

La red 64-32-10 de la Tabla 13, entrenada con 1347 dígitos escaneados, reconoce correctamente el 96 % de otros 450 que no había visto. La Figura 21b muestra su salida para el dígito de la Figura 21a: un 87 % de probabilidad de que sea un 8 y un 13 % de que sea un 9, los dos dígitos que más se parecen en esa imagen. Esa información es valiosa en la práctica: un sistema de OCR de facturas puede enviar a revisión humana solo los campos en los que la red duda.

![](media/image14.png)

*Figura 21. Dígito escaneado de 8 × 8 píxeles con la intensidad de cada píxel (a) y probabilidades que asigna la red 64-32-10 a cada dígito (b).*

Los sistemas actuales no leen carácter a carácter: una primera red localiza las zonas de texto en la página y otra lee cada línea completa como una secuencia, apoyándose en modelos de lenguaje, lo que les permite usar el contexto (si lee «fact_ra», casi seguro que es «factura»). El OCR suele ser además el primer paso de un proceso mayor: extraer importes, fechas o el NIF del emisor para registrarlos automáticamente.

*Tabla 18. Aplicaciones de visión por computador.*

| **Aplicación** | **Entrada** | **Salida** | **Principal dificultad** |
|---|---|---|---|
| Control de calidad | Foto de cada pieza | Correcta o defectuosa (sigmoide), o tipo de defecto (softmax) | Muy pocos ejemplos de piezas defectuosas |
| Reconocimiento facial | Foto de la cara | Vector (embedding) que se compara con otros | Privacidad, regulación y sesgos |
| OCR | Imagen del documento | Carácter (softmax) o línea de texto completa | Calidad del escaneo, letra manuscrita, formatos variados |

### 5.4. Procesamiento de lenguaje natural, audio y voz

El texto y la voz comparten un rasgo que no tienen las tablas ni las imágenes: son **secuencias** en las que el orden importa («el cliente no ha pagado» y «no, el cliente ha pagado» tienen casi las mismas palabras y significan lo contrario). Antes de entrar en una red, deben convertirse en números:

- **Texto:** se divide en fragmentos llamados **tokens** (palabras o trozos de palabra) y cada token se transforma en un vector mediante una capa de embedding (apartado 4.2). En ese espacio, palabras de significado parecido, como «factura» y «recibo», quedan cerca.

- **Audio:** la onda de sonido (Figura 22a) se convierte en un **espectrograma**, una imagen que muestra qué frecuencias suenan en cada instante (Figura 22b). Así, el audio puede procesarse con técnicas parecidas a las de visión.

![](media/image10.png)

*Figura 22. Onda de una señal de voz simulada (a) y su espectrograma, en el que las zonas más oscuras indican las frecuencias con más energía en cada instante (b).*

La mayoría de los sistemas actuales de texto y voz se basan en la arquitectura Transformer y sus capas de atención (apartado 4.2), que se estudiarán en el Módulo 9.

#### Traducción y corrección

Un traductor automático recibe una secuencia (la frase en español) y devuelve otra (la frase en inglés), que puede tener distinta longitud y distinto orden de palabras. Se resuelve con una arquitectura **codificador-decodificador**: una parte de la red lee la frase completa y la resume en una representación numérica, y otra genera la traducción token a token; en cada paso, la salida es una capa softmax sobre todo el vocabulario, que da la probabilidad de cada posible token siguiente.

La corrección de textos (ortografía, gramática, estilo) puede verse como una «traducción» del texto con errores al texto correcto, y se resuelve con la misma arquitectura. De hecho, la traducción automática fue el problema para el que se presentó el Transformer en 2017. Su principal riesgo es que la salida suena fluida aunque sea incorrecta, por lo que los textos con consecuencias legales o contractuales deben revisarse siempre.

#### Reconocimiento de comandos

Los asistentes de voz, los vehículos o la maquinaria que se maneja por voz reconocen un conjunto cerrado de órdenes («enciende», «para», «siguiente», «llamar»). No necesitan transcribir: es un problema de **clasificación**, con una salida softmax que tiene una neurona por comando más dos clases adicionales, «silencio» y «desconocido», para no reaccionar ante cualquier sonido. La red, normalmente convolucional, recibe el espectrograma de uno o dos segundos de audio.

El caso más extremo es la detección de la palabra de activación de un asistente: una red muy pequeña que escucha de forma continua en el propio dispositivo, con un consumo mínimo, y que solo despierta al sistema completo cuando detecta esa palabra. Aquí prima evitar las falsas activaciones, que el usuario percibe como un fallo muy molesto.

#### Transcripción automática

La transcripción (*speech-to-text*) convierte audio libre en texto: actas de reuniones, subtítulos, llamadas de un centro de atención al cliente para analizarlas después o dictado de informes. A diferencia de los comandos, la salida no es una clase de una lista cerrada, sino un texto de longitud libre, así que combina las dos ideas anteriores: una parte de la red «escucha» el espectrograma y otra «escribe» el texto, como en la traducción. Modelos abiertos como Whisper (OpenAI, 2022) transcriben decenas de idiomas con buena precisión.

Su calidad se mide con la **tasa de error por palabra** (WER, *Word Error Rate*): el porcentaje de palabras que hay que sustituir, borrar o añadir para llegar a la transcripción correcta. Empeora con el ruido de fondo, con varias personas hablando a la vez, con acentos poco representados en los datos de entrenamiento y con el vocabulario propio de la empresa, como nombres de productos o siglas internas.

*Tabla 19. Aplicaciones de lenguaje natural, audio y voz.*

| **Aplicación** | **Entrada** | **Salida** | **Tipo de problema** | **Métrica habitual** |
|---|---|---|---|---|
| Traducción y corrección | Texto convertido en tokens | Texto, token a token con softmax | Secuencia a secuencia | BLEU y revisión humana |
| Comandos de voz | Espectrograma de 1 o 2 segundos | Un comando, «silencio» o «desconocido» (softmax) | Clasificación multiclase | Acierto y falsas activaciones |
| Transcripción | Espectrograma del audio completo | Texto de longitud libre | Secuencia a secuencia | WER |

#### Visión de conjunto

La Figura 23 sitúa las doce aplicaciones según el tipo de dato que recibe la red (filas) y el tipo de respuesta que da (columnas), con el color del apartado en que se han estudiado. Se extraen dos conclusiones. La primera, que las redes son especialmente útiles en las filas de imágenes, texto y audio, donde los modelos clásicos apenas pueden competir, mientras que en la fila de datos tabulares deben compararse siempre con modelos de árboles (apartado 1.2). La segunda, que las aplicaciones que devuelven una secuencia, en la columna derecha, son las que requieren arquitecturas más específicas, que se verán en el Módulo 9.

![](media/image18.png)

*Figura 23. Las doce aplicaciones según el tipo de dato de entrada y el tipo de respuesta.*

En resumen, la misma pieza básica, la neurona del apartado 1, sirve para estimar un riesgo, valorar una vivienda, inspeccionar una pieza o transcribir una reunión. Lo que cambia de una aplicación a otra es cómo se convierten los datos en números (variables escaladas, píxeles, tokens o espectrogramas), qué tipo de capas los procesan y cómo es la capa de salida. En todos los casos queda pendiente la misma pregunta: cómo se ajustan los miles o millones de pesos de la red a partir de los ejemplos, que es el objeto del Módulo 8.

# Módulo 8. Entrenamiento de Redes Neuronales

## 1. Función de coste en redes neuronales

El Módulo 7 terminó con una pregunta pendiente: cómo se ajustan los miles o millones de pesos de una red a partir de los ejemplos. Antes de poder ajustarlos hace falta algo más básico: una forma de medir, con un solo número, lo mal que lo está haciendo la red. Ese número es la **función de coste**, y entrenar una red consiste exactamente en buscar los pesos que lo hacen lo más pequeño posible. Este apartado explica qué es, cómo se calcula y qué relación tiene con lo visto en la Parte I.

#### Pérdida de un ejemplo y coste de todo el conjunto

Conviene distinguir dos términos que a menudo se usan como sinónimos. La **pérdida** (*loss*) mide el error de la red en un solo ejemplo: compara la respuesta correcta $y$ {eq-179} con la predicción $ŷ$ {eq-180}. El **coste** es la media de las pérdidas de todos los ejemplos de entrenamiento:

$J(w)=1Ni=1NL(yi,ŷi)$ {eq-181}

donde $N$ {eq-182} es el número de ejemplos y $L$ {eq-183} la pérdida de cada uno. En la práctica, y en librerías como Keras o PyTorch, ambos se llaman simplemente *loss*. La notación $J(w)$ {eq-184} subraya la idea clave de todo el módulo: los datos de entrenamiento están fijos, así que el coste solo depende de los pesos $w$ {eq-185}. Cambiar un peso cambia las predicciones y, con ellas, el coste. Entrenar es buscar la combinación de pesos con el coste más bajo.

#### Un ejemplo: el coste de la red de conciliación

La red que detectaba descuadres entre banco y contabilidad (Figura 15b y Tabla 12 del Módulo 7) da una probabilidad de 0.88 en los dos casos de descuadre y de 0.12 en los dos casos sin descuadre. Acierta en los cuatro, pero no con total seguridad, y la función de coste lo refleja. Con la entropía cruzada, la pérdida más habitual en clasificación, que se explica en el apartado 1.1, cada caso aporta lo que recoge la Tabla 20.

*Tabla 20. Pérdida de la red de conciliación en los cuatro casos.*

| **x₁** | **x₂** | **Clase real y** | **Predicción ŷ** | **Probabilidad dada a la clase correcta** | **Pérdida** |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0.12 | 0.88 | 0.127 |
| 0 | 1 | 1 | 0.88 | 0.88 | 0.127 |
| 1 | 0 | 1 | 0.88 | 0.88 | 0.127 |
| 1 | 1 | 0 | 0.12 | 0.88 | 0.127 |
| **Coste J (media)** |  |  |  |  | **0.127** |

El coste vale 0.127. Si la red respondiera 0.99 y 0.01 en lugar de 0.88 y 0.12, bajaría a 0.010; si se equivocara en algún caso, subiría con rapidez. Ese número es la guía que seguirá el entrenamiento.

### 1.1. Relación con lo visto en la Parte I

Las funciones de coste no son nuevas. En la Parte I, los modelos de regresión y de clasificación ya se ajustaban minimizando una medida del error, y las redes neuronales utilizan exactamente las mismas. La razón es la conexión que se estableció en el Módulo 7: una neurona con activación sigmoide es una regresión logística, y una neurona sin activación es una regresión lineal. La función de coste se elige, por tanto, según la capa de salida, igual que su activación (Tabla 11 del Módulo 7).

#### Regresión: el error cuadrático medio

Cuando la red predice un número, como el precio de una vivienda o la demanda de un día, la pérdida estándar es el **error cuadrático medio** (ECM o MSE, *Mean Squared Error*), el mismo que se minimiza en la regresión lineal por mínimos cuadrados:

$ECM=1Ni=1N(yi−ŷi)2$ {eq-186}

Al elevar al cuadrado, un error de 20 000 € pesa cuatro veces más que uno de 10 000 €, de modo que la red se esfuerza sobre todo en evitar los errores grandes. Es la misma propiedad que se vio con el RMSE en el Módulo 6, y tiene el mismo inconveniente: unos pocos valores atípicos pueden dominar el entrenamiento. Cuando los datos los tienen, se usan alternativas como el error absoluto medio (MAE), que penaliza todos los errores en proporción a su tamaño, o la pérdida de **Huber**, que se comporta como el ECM con errores pequeños y como el MAE con errores grandes.

#### Clasificación: la entropía cruzada

Cuando la red devuelve una probabilidad, la pérdida estándar es la **entropía cruzada** (*cross-entropy*), la misma que se minimiza al ajustar una regresión logística, donde suele llamarse pérdida logarítmica (*log-loss*). Para dos clases:

$L=−yln(ŷ)+(1−y)ln(1−ŷ)$ {eq-187}

La fórmula parece complicada, pero su lectura es sencilla: como $y$ {eq-188} solo vale 0 o 1, uno de los dos términos se anula, y la pérdida es el logaritmo, cambiado de signo, de la probabilidad que la red ha dado a la clase correcta. Si la red da un 90 % a la clase correcta, la pérdida es $−ln(0.9)=0.105$ {eq-189}; si da un 10 %, $−ln(0.1)=2.303$ {eq-190}; y si da un 0 %, la pérdida se dispara hacia infinito.

La Tabla 21 compara ambas pérdidas con el correo de la Tabla 2 del Módulo 7, que en realidad no era spam ($y=0$ {eq-191}). Antes de corregir sus pesos, la neurona le daba un 73 % de probabilidad de spam; después, un 27 % (Tabla 9 del Módulo 7).

*Tabla 21. Pérdida y señal de corrección para un correo legítimo (y = 0) según la probabilidad de spam que da la red.*

| **ŷ** | **Situación** | **Pérdida ECM** | **Pérdida entropía cruzada** | **Corrección con ECM** | **Corrección con entropía cruzada** |
|---|---|---|---|---|---|
| 0.02 | Acierta con seguridad | 0.0004 | 0.020 | 0.001 | 0.02 |
| 0.27 | Acierta (correo tras corregir los pesos) | 0.073 | 0.315 | 0.106 | 0.27 |
| 0.50 | No sabe | 0.250 | 0.693 | 0.250 | 0.50 |
| 0.73 | Se equivoca (correo antes de corregir) | 0.533 | 1.309 | 0.288 | 0.73 |
| 0.98 | Se equivoca con seguridad | 0.960 | 3.912 | 0.038 | 0.98 |

Dos diferencias explican por qué en clasificación se prefiere la entropía cruzada (Figura 24):

- **Castiga mucho más la seguridad equivocada:** con el ECM, la pérdida nunca pasa de 1, aunque la red esté segura al 98 % de algo falso. Con la entropía cruzada, ese mismo error cuesta 3.912, casi doscientas veces más que acertar con seguridad (Figura 24a).

- **Da una señal de corrección útil:** las dos últimas columnas indican con qué fuerza se corrige la suma ponderada $z$ {eq-192} de la neurona de salida, una pendiente que se explicará en el apartado 2. Con entropía cruzada y sigmoide, esa señal es simplemente $ŷ−y$ {eq-193}: cuanto mayor es el error, mayor es la corrección. Con el ECM se cuela en la fórmula la pendiente de la sigmoide, que se satura (apartado 3.1 del Módulo 7), y en el peor caso, $ŷ=0.98$ {eq-194}, la señal cae a 0.038, unas 25 veces menos que con entropía cruzada (Figura 24b). La red aprendería más despacio justo de sus errores más graves.

![](media/image34.png)

*Figura 24. Pérdida de un correo legítimo según la probabilidad de spam que da la red (a) y fuerza de la corrección que recibe la neurona de salida (b), con entropía cruzada y con error cuadrático.*

Con más de dos clases, la salida es una capa softmax y se usa la **entropía cruzada categórica**, que de nuevo es el logaritmo, cambiado de signo, de la probabilidad asignada a la clase correcta:

$L=−ln(ŷc)$ {eq-195}

donde $c$ {eq-196} es la clase real. En el ticket de soporte de la Tabla 8 del Módulo 7, con probabilidades de 0.659 para facturación, 0.242 para incidencia técnica y 0.099 para consulta comercial, la pérdida sería 0.417 si el ticket era realmente de facturación, 1.419 si era una incidencia técnica y 2.313 si era una consulta comercial. Igual que en el caso binario, la señal de corrección de cada neurona de salida es la diferencia entre la probabilidad que da y la que debería dar, $ŷk−yk$ {eq-197}. La Tabla 22 resume qué coste corresponde a cada tipo de problema.

*Tabla 22. Función de coste según el tipo de problema.*

| **Tipo de problema** | **Capa de salida (Tabla 11, Módulo 7)** | **Función de coste** | **Modelo clásico equivalente** | **Nombre en Keras / PyTorch** |
|---|---|---|---|---|
| Regresión | 1 neurona, identidad | ECM (o MAE, Huber) | Regresión lineal | MeanSquaredError / MSELoss |
| Clasificación binaria | 1 neurona, sigmoide | Entropía cruzada binaria | Regresión logística | BinaryCrossentropy / BCEWithLogitsLoss |
| Clasificación multiclase | Softmax, una neurona por clase | Entropía cruzada categórica | Regresión logística multinomial | CategoricalCrossentropy / CrossEntropyLoss |
| Clasificación multietiqueta | Sigmoide en cada neurona | Entropía cruzada binaria por etiqueta | Una regresión logística por etiqueta | BinaryCrossentropy / BCEWithLogitsLoss |

Un detalle práctico que provoca muchos errores: en PyTorch, CrossEntropyLoss y BCEWithLogitsLoss esperan las puntuaciones $z$ {eq-198} de la última capa, sin aplicar softmax ni sigmoide, porque las aplican internamente de una forma numéricamente más estable. Si el modelo ya las aplica, la activación se duplica y el entrenamiento empeora sin que salte ningún error. En Keras, el mismo comportamiento se controla con el parámetro from_logits. Se volverá sobre ello en el Módulo 9.

#### Métrica y función de coste no son lo mismo

En el Módulo 6 se evaluaban los modelos con métricas como la exactitud, el F1 o el MAE. Cabe preguntarse por qué no se entrena directamente con ellas. La razón es la misma que obligó a abandonar la función escalón (Tabla 7 del Módulo 7): la exactitud solo cambia cuando un ejemplo pasa de estar mal clasificado a estar bien clasificado, así que un pequeño cambio en un peso casi nunca la modifica y no indica hacia dónde moverlo. La función de coste debe ser suave, para que cualquier mejora, por pequeña que sea, se note. Por eso se trabaja con dos números distintos: la **función de coste**, que guía el entrenamiento, y la **métrica**, que es la que interesa al negocio y con la que se decide si el modelo sirve.

#### Lo que cambia en una red: un paisaje con muchos valles

Hay una diferencia importante respecto a la Parte I. En la regresión lineal y en la regresión logística, el coste tiene forma de cuenco: un único valle, sin trampas, en el que cualquier camino cuesta abajo lleva al mismo mínimo (Figura 25a). En la regresión lineal, además, ese mínimo puede calcularse directamente con una fórmula. Cuando hay capas ocultas, nada de esto se cumple. El coste depende de los pesos de una forma mucho más enrevesada, y su «paisaje» tiene varios valles, zonas casi planas y **puntos de silla**: puntos donde el terreno sube en unas direcciones y baja en otras, como el centro de una silla de montar (Figura 25b).

![](media/image4.png)

*Figura 25. Coste de una regresión logística con dos pesos, con un único mínimo (a), y esquema del paisaje de coste de una red neuronal, con varios mínimos y un punto de silla (b). Las zonas más oscuras indican un coste menor.*

Parte de esos valles son inevitables y, además, inofensivos: si se intercambian dos neuronas de una capa oculta con todos sus pesos, la red calcula exactamente lo mismo, así que cada buena solución aparece repetida muchas veces. En la práctica, con redes grandes, la mayoría de los mínimos que se alcanzan dan un coste parecido, y el problema más frecuente no son los mínimos malos sino las mesetas y los puntos de silla, donde el terreno es tan plano que el entrenamiento avanza muy despacio. Sin fórmula directa y sin garantía de llegar al mejor valle, la única opción es descender paso a paso, que es lo que estudian los apartados 2 y 3. La Tabla 23 resume las diferencias.

*Tabla 23. Qué cambia al pasar de los modelos de la Parte I a una red neuronal.*

| **Aspecto** | **Regresión lineal y logística** | **Red neuronal con capas ocultas** |
|---|---|---|
| Forma del coste | Un único valle (convexo) | Varios valles, mesetas y puntos de silla |
| Cómo se encuentran los pesos | Fórmula directa (lineal) o un método iterativo que siempre llega al mínimo (logística) | Descenso paso a paso, sin garantía de llegar al mejor mínimo |
| Número de parámetros | Uno por variable, más el término independiente | De miles a miles de millones |
| Punto de partida | Indiferente: siempre se llega al mismo mínimo | Importa: pesos iniciales aleatorios y bien escalados (apartado 4.1) |
| Resultado de dos entrenamientos | Idéntico | Puede variar ligeramente con la semilla aleatoria |

En resumen, la función de coste convierte «lo bien que funciona la red» en un número que depende de los pesos: el error cuadrático medio en regresión y la entropía cruzada en clasificación, los mismos que en los modelos clásicos. Lo nuevo es que, en una red, el paisaje de ese coste es irregular y no tiene atajos. Para recorrerlo hace falta saber, en cada punto, hacia dónde baja el terreno, y eso es lo que calcula la retropropagación.

## 2. Backpropagation

Para reducir el coste hay que saber, para cada peso de la red, en qué sentido moverlo y cuánto influye en el resultado. Esa información la da el **gradiente**, y el algoritmo que lo calcula de forma eficiente es la retropropagación del error o **backpropagation**. Es la pieza que faltaba en el apartado 2.2 del Módulo 7, donde quedó claro que la regla del perceptrón sólo sabe corregir la neurona de salida. Este apartado explica primero la intuición del algoritmo y después cómo se propaga el error capa a capa en un ejemplo resuelto.

### 2.1. Intuición del algoritmo

#### El problema: repartir la responsabilidad del error

Cuando una red se equivoca, la culpa está repartida entre todos sus pesos. Unos han contribuido mucho al error, otros poco y algunos incluso lo han reducido. Es lo que ocurre en una empresa cuando un trimestre sale mal: la dirección no culpa a todos por igual, sino que analiza cuánto ha influido cada departamento en el resultado; cada departamento hace lo mismo con sus equipos, y así hasta llegar a cada persona. La retropropagación hace exactamente eso con la red: parte del error de la salida y lo reparte hacia atrás, capa a capa, en proporción a la influencia de cada peso.

La Figura 26 muestra el proceso en una red de seis capas ocultas. Primero, las señales viajan de la entrada a la salida; después, la predicción se compara con la respuesta correcta y el error recorre la red en sentido contrario. El brillo de cada neurona y el tamaño de los pulsos rojos indican cuánto error le llega, y el número bajo cada capa lo expresa respecto a la última capa oculta. Con activación ReLU y una inicialización adecuada, el error llega prácticamente entero hasta la primera capa (×1.08). La versión interactiva anima las dos pasadas y permite cambiar la activación, los pesos iniciales y el número de capas, y añadir atajos residuales; se volverá a ella en el apartado 4.1.

![](media/image20.png)

*Figura 26. Retropropagación en una red de seis capas ocultas con activación ReLU e inicialización de He: el error de la salida (rojo) recorre la red hacia atrás y llega a cada capa con un tamaño similar. Valores calculados con una red real; las neuronas se dibujan como biológicas solo como recurso visual, ya que el cerebro no aprende por retropropagación.*

#### Qué es el gradiente

La influencia de un peso se mide con una derivada: cuánto cambia el coste cuando ese peso cambia un poco. Se escribe $∂J/∂w$ {eq-199} (se lee «derivada parcial de J respecto a w») y aporta dos datos:

- **El signo indica el sentido:** si es positivo, aumentar el peso aumenta el coste, así que conviene reducirlo; si es negativo, conviene aumentarlo.

- **El tamaño indica la influencia:** un valor grande significa que el coste es muy sensible a ese peso; uno cercano a cero, que apenas le afecta.

El **gradiente** es la lista de estas derivadas para todos los pesos de la red. Apunta en la dirección en la que el coste sube más deprisa, así que basta con moverse en la dirección contraria para bajar.

#### La regla de la cadena: efectos que se encadenan

En una red, un peso no afecta al coste directamente, sino a través de una cadena de cálculos. En la neurona del correo (Tabla 2 del Módulo 7), el peso $w1$ {eq-200} afecta a la suma ponderada $z$ {eq-201}; $z$ {eq-202} afecta a la probabilidad $ŷ$ {eq-203}; y $ŷ$ {eq-204} afecta a la pérdida $L$ {eq-205}. La **regla de la cadena** dice que el efecto total es el producto de los efectos de cada eslabón:

$∂L∂w1=∂L∂ŷ·∂ŷ∂z·∂z∂w1$ {eq-206}

Funciona como un tren de engranajes: si el primero hace girar al segundo el doble de rápido y el segundo al tercero el triple, el primero hace girar al tercero seis veces más rápido. Cada eslabón solo necesita conocer su propia relación de transmisión, su pendiente local, y el efecto total se obtiene multiplicándolas.

Con los números del correo, que no era spam ($y=0$ {eq-207}) y al que la neurona daba $ŷ=0.73$ {eq-208}, con pérdida de entropía cruzada (Figura 27a):

- **Pérdida respecto a la probabilidad:** $∂L/∂ŷ=1/(1−ŷ)=3.72$ {eq-209}. Si la probabilidad de spam sube, la pérdida sube.

- **Probabilidad respecto a z:** es la pendiente de la sigmoide, $ŷ(1−ŷ)=0.197$ {eq-210} (apartado 3.1 del Módulo 7).

- **z respecto al peso:** como $z=w1x1+w2x2+w3x3+b$ {eq-211}, la pendiente es la entrada, $x1=1$ {eq-212}.

Multiplicando, $∂L/∂w1=3.72·0.197·1=0.73$ {eq-213}. El gradiente es positivo, así que hay que reducir el peso de «Gratis». Como las tres entradas valen 1, el cálculo es idéntico para $w2$ {eq-214}, $w3$ {eq-215} y el sesgo: todos deben bajar. Si se reducen en $η·0.73$ {eq-216}, con la misma tasa $η=0.5$ {eq-217} del ejemplo del perceptrón (apartado 2.1 del Módulo 7), $z$ {eq-218} pasa de 1 a −0.46 y la probabilidad de spam baja del 73 % al 39 %.

El resultado tiene una forma muy familiar. El producto de las dos primeras pendientes se simplifica siempre a $ŷ−y$ {eq-219}, la señal de corrección de la Tabla 21, de modo que la corrección de cada peso queda:

$wi←wi+η(y−ŷ)xi$ {eq-220}

Es exactamente la regla del perceptrón del Módulo 7, con una diferencia de fondo: $ŷ$ {eq-221} ya no es un 0 o un 1, sino una probabilidad, así que la corrección es proporcional a cuánto se ha equivocado la neurona, y no un simple «acierta o falla».

#### Por qué hacia atrás

Con una sola neurona, la cadena tiene tres eslabones. En una red con varias capas, la cadena de cada peso de la primera capa atraviesa todas las capas siguientes, y las cadenas de pesos distintos comparten la mayor parte de sus eslabones. La retropropagación aprovecha ese hecho: calcula las pendientes empezando por la salida y avanzando hacia la entrada, y guarda cada resultado intermedio para reutilizarlo en todos los pesos que dependen de él. Así obtiene el gradiente completo con una pasada hacia delante, para calcular las predicciones, y una pasada hacia atrás, para repartir el error.

La alternativa ingenua sería mover cada peso un poco, volver a calcular el coste y ver cuánto cambia: una pasada completa por la red por cada peso. Para la red de dígitos del Módulo 7, con 2410 parámetros, serían más de 2400 pasadas para una sola corrección; para un modelo de 1000 millones de parámetros, mil millones. La retropropagación cuesta, en cambio, el equivalente a unas pocas pasadas, del orden de tres, tenga la red el tamaño que tenga (Figura 27b). Sin ella, entrenar las redes actuales sería imposible.

![](media/image2.png)

*Figura 27. Regla de la cadena aplicada a un peso de la neurona del correo (a) y número de pasadas por la red necesarias para obtener todos los gradientes, perturbando cada peso o con retropropagación, en escala logarítmica (b).*

Tiene un precio: para ir hacia atrás hay que conservar en memoria los valores calculados en la pasada hacia delante. Por eso entrenar una red consume bastante más memoria que usarla para predecir, y es uno de los factores que limitan el tamaño de los lotes (apartado 3.3). La idea matemática, la diferenciación automática en modo inverso, se describió en 1970, pero fue el trabajo de Rumelhart, Hinton y Williams de 1986 el que la popularizó para redes neuronales (apartado 1.2 del Módulo 7).

### 2.2. Propagación del error

Para ver el algoritmo completo en una red con capa oculta se retoma la red de conciliación de la Figura 15b del Módulo 7, en el caso en que el pago figura en los dos sistemas, $(x1,x2)=(1,1)$ {eq-222}, y por tanto no hay descuadre ($y=0$ {eq-223}). La red responde $ŷ=0.12$ {eq-224}: acierta, pero no con total seguridad, y su pérdida es 0.127 (Tabla 20).

#### Paso 1: hacia delante

Se calculan y se guardan todos los valores intermedios, exactamente como en la Tabla 12 del Módulo 7 (Figura 28a): la neurona oculta $h1$ {eq-225} recibe $z=2$ {eq-226} y devuelve 2; $h2$ {eq-227} recibe $z=1$ {eq-228} y devuelve 1; y la neurona de salida recibe $z=4·2−8·1−2=−2$ {eq-229}, que la sigmoide convierte en $ŷ=0.12$ {eq-230}.

#### Paso 2: el error de la salida

El recorrido hacia atrás empieza por la neurona de salida. Su **error** $δ$ {eq-231} (delta), que indica cuánto cambiaría la pérdida si cambiara su suma ponderada $z$ {eq-232}, es la señal de corrección del apartado 1.1:

$δsalida=ŷ−y=0.119−0=0.119$ {eq-233}

Es positivo: la red da algo más de probabilidad de descuadre de la que debería. A partir de él salen directamente los gradientes de los pesos que llegan a la salida, porque cada uno es el error de su neurona de destino multiplicado por el valor que transporta la conexión: $0.119·h1=0.238$ {eq-234} para el peso 4, $0.119·h2=0.119$ {eq-235} para el peso −8 y 0.119 para el sesgo.

#### Paso 3: propagar el error a la capa oculta

Las neuronas ocultas no tienen una respuesta correcta con la que compararse; ese era precisamente el obstáculo del perceptrón. La retropropagación lo resuelve calculando su error a partir del error de la salida: cada neurona oculta recibe el error de las neuronas a las que alimenta, multiplicado por el peso de cada conexión, y lo multiplica a su vez por la pendiente de su propia activación:

$δj=f′(zj)kwkjδk$ {eq-236}

donde la suma recorre las neuronas $k$ {eq-237} de la capa siguiente a las que está conectada la neurona $j$ {eq-238}. En la red de conciliación, ambas neuronas ocultas usan ReLU y están en su zona positiva, así que su pendiente es 1:

- **Neurona **$h1$ {eq-239}**:** $δ1=1·(4·0.119)=0.477$ {eq-240}. Está conectada a la salida con un peso positivo, así que, si se activara menos, la probabilidad de descuadre bajaría.

- **Neurona **$h2$ {eq-241}**:** $δ2=1·(−8·0.119)=−0.954$ {eq-242}. Su peso hacia la salida es negativo, así que conviene que se active más.

Con esos errores se obtienen los gradientes de los pesos de la primera capa, con la misma regla de antes: error de la neurona de destino por valor que llega. Como las dos entradas valen 1, los pesos que llegan a $h1$ {eq-243} tienen gradiente 0.477 y los que llegan a $h2$ {eq-244}, −0.954 (Figura 28b). La Tabla 24 recoge el recorrido completo.

*Tabla 24. Retropropagación en la red de conciliación para el caso (1, 1).*

| **Paso** | **Qué se calcula** | **Cálculo** | **Resultado** |
|---|---|---|---|
| 1. Hacia delante | Valor de cada neurona | h₁ = ReLU(2), h₂ = ReLU(1), z = 4 · 2 − 8 · 1 − 2 | h₁ = 2, h₂ = 1, ŷ = σ(−2) = 0.119 |
| 2. Error de la salida | δ de la neurona de salida | ŷ − y = 0.119 − 0 | 0.119 |
| 3. Gradientes de la salida | Pesos 4 y −8 y sesgo | δ · h₁,  δ · h₂,  δ | 0.238, 0.119 y 0.119 |
| 4. Error de la capa oculta | δ de h₁ y de h₂ | 1 · (4 · 0.119),  1 · (−8 · 0.119) | 0.477 y −0.954 |
| 5. Gradientes de la capa oculta | Pesos y sesgos de h₁ y h₂ | δ₁ · xᵢ y δ₂ · xᵢ, con x₁ = x₂ = 1 | 0.477 (h₁) y −0.954 (h₂) |

![](media/image40.png)

*Figura 28. Paso hacia delante en la red de conciliación para el caso (1, 1), con el valor de cada neurona (a), y paso hacia atrás, con el error δ de cada neurona y el gradiente de cada peso (b).*

El signo de cada gradiente indica cómo corregir. El descenso por gradiente (apartado 3) mueve cada peso en sentido contrario a su gradiente: los pesos que llegan a $h1$ {eq-245} y el peso 4 bajan, los pesos que llegan a $h2$ {eq-246} suben y el peso −8 se hace todavía más negativo. Todos esos cambios empujan en la misma dirección: reducir $z$ {eq-247} y, con él, la probabilidad de descuadre en un caso en el que no lo hay.

#### La regla general

Lo que se ha hecho a mano con cinco neuronas es lo que hace cualquier red con millones, porque el algoritmo solo repite dos reglas:

- **Error de una neurona:** es la suma de los errores de las neuronas a las que alimenta, ponderados por los pesos de esas conexiones, multiplicada por la pendiente de su propia activación.

- **Gradiente de un peso:** es el error de la neurona a la que llega multiplicado por el valor que transporta.

En la primera regla está la clave del apartado 4: el error de cada capa se obtiene **multiplicando** por pesos y por pendientes de activación. Si esos factores son sistemáticamente pequeños, el error se encoge capa a capa al viajar hacia atrás; si son grandes, crece. Además, si una neurona ReLU está en su zona negativa, su pendiente es 0 y no deja pasar ningún error: es el mecanismo de las neuronas muertas (apartado 3.3 del Módulo 7).

#### Nadie lo programa a mano

En la práctica, la retropropagación no se programa. Los frameworks de deep learning (Módulo 9) incorporan **diferenciación automática**: registran las operaciones de la pasada hacia delante y calculan solos todos los gradientes. En PyTorch basta con una instrucción, loss.backward(); en TensorFlow el mecanismo se llama GradientTape, y Keras lo ejecuta automáticamente al llamar a fit(). Aun así, entender cómo funciona es imprescindible para interpretar los problemas del apartado 4.

En resumen, la retropropagación reparte el error de la salida entre todos los pesos de la red multiplicando pendientes locales hacia atrás, y obtiene el gradiente completo con un coste similar al de unas pocas predicciones. Con ella quedan resueltas las limitaciones del perceptrón que el Módulo 7 dejó pendientes (Tabla 25). Falta decidir qué hacer con el gradiente una vez calculado, que es el objeto del apartado 3.

*Tabla 25. Cómo se resuelven las limitaciones del perceptrón que la Tabla 7 del Módulo 7 remitía a este módulo.*

| **Limitación del perceptrón** | **Solución** | **Dónde se estudia** |
|---|---|---|
| La función escalón no indica en qué dirección corregir los pesos | Activaciones con pendiente y una función de coste suave: el gradiente indica dirección y tamaño de la corrección | Apartados 1 y 2.1 |
| Su regla solo puede corregir la capa de salida | La retropropagación calcula el error de cada neurona oculta a partir del de la salida | Apartado 2.2 |
| No converge si las clases no son separables | Minimizar el coste busca la frontera con menor error total, aunque no sea perfecta | Apartados 1 y 3 |

## 3. Optimización

La retropropagación indica hacia dónde baja el coste desde la posición actual, pero no cuánto hay que moverse ni con qué datos calcular cada paso. Esas decisiones corresponden al **optimizador**. Este apartado presenta el descenso por gradiente, su versión estocástica, que es la que realmente se usa, y la idea de lote que conecta ambas.

### 3.1. Descenso por gradiente

El **descenso por gradiente** repite un paso muy sencillo: calcular el gradiente del coste y mover todos los pesos un poco en sentido contrario. La imagen habitual es la de un excursionista que baja una montaña en plena niebla: no ve el valle, solo la inclinación del terreno bajo sus pies, así que da un paso hacia donde más baja, vuelve a mirar y repite. Para cada peso:

$w←w−η∂J∂w$ {eq-248}

donde $η$ {eq-249} es la **tasa de aprendizaje** (*learning rate*), la misma que aparecía en la regla del perceptrón. El gradiente decide la dirección y la tasa de aprendizaje, la longitud del paso. El proceso se repite hasta que el coste deja de bajar. Es la idea que, como recogía la Tabla 7 del Módulo 7, introdujo Adaline (Widrow y Hoff, 1960), y la que hoy usan, con variantes, todas las redes.

#### La tasa de aprendizaje: ni muy corta ni muy larga

La tasa de aprendizaje es probablemente el hiperparámetro más importante de una red. Para verlo sin distracciones se toma el caso más sencillo posible: un solo peso $w$ {eq-250}, con coste $J(w)=(w−2)2$ {eq-251}, cuyo mínimo está en $w=2$ {eq-252}, y punto de partida $w=−2$ {eq-253}. Su gradiente es $2(w−2)$ {eq-254}, de modo que cada paso multiplica la distancia al mínimo por $1−2η$ {eq-255}. La Tabla 26 muestra los primeros pasos con cuatro tasas distintas.

*Tabla 26. Primeros pasos del descenso por gradiente con cuatro tasas de aprendizaje, con coste J(w) = (w − 2)² e inicio en w = −2.*

| **Iteración** | **η = 0.1** / **w** | **η = 0.1** / **J(w)** | **η = 0.4** / **w** | **η = 0.4** / **J(w)** | **η = 0.9** / **w** | **η = 0.9** / **J(w)** | **η = 1.1** / **w** | **η = 1.1** / **J(w)** |
|---|---|---|---|---|---|---|---|---|
| 0 | −2 | 16 | −2 | 16 | −2 | 16 | −2 | 16 |
| 1 | −1.2 | 10.24 | 1.2 | 0.64 | 5.2 | 10.24 | 6.8 | 23.04 |
| 2 | −0.56 | 6.55 | 1.84 | 0.026 | −0.56 | 6.55 | −3.76 | 33.18 |
| 3 | −0.05 | 4.19 | 1.968 | 0.001 | 4.05 | 4.19 | 8.91 | 47.78 |
| 4 | 0.36 | 2.68 | 1.994 | 0.00004 | 0.36 | 2.68 | −6.29 | 68.80 |
| 5 | 0.69 | 1.72 | 1.999 | 0.000002 | 3.31 | 1.72 | 11.95 | 99.07 |

Las cuatro columnas cuentan cuatro historias (Figura 33):

- $η=0.1$ {eq-256}**, demasiado corta:** cada paso solo recorre el 20 % de la distancia que queda. Avanza en la dirección correcta, pero necesita 27 iteraciones para que el coste baje de 0.0001.

- $η=0.4$ {eq-257}**, adecuada:** cada paso recorre el 80 % de la distancia, y en cuatro iteraciones el coste ya es prácticamente cero.

- $η=0.9$ {eq-258}**, demasiado larga:** cada paso se pasa del mínimo y cae al otro lado del valle, en zigzag. Acaba llegando, pero tan despacio como con 0.1: los costes de ambas columnas coinciden.

- $η=1.1$ {eq-259}**, excesiva:** cada paso se pasa tanto que termina más lejos que antes, y el coste crece sin límite. El entrenamiento **diverge**; en una red real, la pérdida se convierte en infinito o en «NaN» (un valor no numérico) en pocas iteraciones.

![](media/image38.png)

*Figura 33. Recorrido del peso sobre la curva de coste con una tasa de aprendizaje pequeña y otra grande (a) y evolución del coste con las cuatro tasas de la Tabla 26, en escala logarítmica (b).*

En una red real no se conoce la forma del coste, así que la tasa se elige probando: se empieza con el valor por defecto del optimizador, se observa la curva de pérdida y se ajusta. También es habitual no mantenerla fija: se empieza con una tasa alta para avanzar deprisa y se reduce a medida que el entrenamiento se acerca al mínimo, lo que se conoce como **planificación de la tasa de aprendizaje** (*learning rate schedule*). En los modelos grandes actuales es frecuente, además, un breve calentamiento inicial (*warmup*) en el que la tasa sube progresivamente desde casi cero.

#### Más allá del descenso básico: momentum y Adam

El descenso por gradiente tiene un punto débil que el ejemplo de un solo peso no muestra. Cuando el coste forma un valle largo y estrecho, algo muy frecuente en redes, el gradiente apunta sobre todo hacia las paredes del valle y muy poco a lo largo de él. El optimizador rebota de pared a pared y avanza muy despacio hacia el fondo (Figura 34a). Dos mejoras resuelven buena parte del problema:

- **Momentum:** en lugar de seguir solo el gradiente actual, acumula los anteriores, como una bola que rueda cuesta abajo y gana inercia. Los rebotes de un lado a otro se compensan entre sí y el avance a lo largo del valle se acumula.

- **Tasas adaptativas (RMSProp, Adam):** cada peso recibe su propia tasa de aprendizaje, que se reduce si sus gradientes son grandes y se amplía si son pequeños. **Adam** (Kingma y Ba, 2014) combina esta idea con el momentum y es hoy el optimizador por defecto en la mayoría de proyectos.

![](media/image7.png)

*Figura 34. Trayectoria de tres optimizadores en un valle largo y estrecho durante las primeras 60 iteraciones (a) y evolución del coste en 100 iteraciones, en escala logarítmica (b).*

La pestaña «Descenso por gradiente» de la versión interactiva: reproduce los pasos de la Tabla 26 con cualquier tasa de aprendizaje y, sobre un paisaje de dos pesos, compara el descenso por gradiente con momentum y Adam desde el punto de partida que se elija, con o sin el ruido de los lotes pequeños del apartado 3.2 (Figura 35).

![](media/image35.png)

*Figura 35. Pestaña «Descenso por gradiente» de la versión interactiva: primeros pasos con la tasa η = 0.9 de la Tabla 26, que se pasan del mínimo en zigzag (a), y trayectoria del descenso por gradiente, momentum y Adam en un valle largo y estrecho durante 400 iteraciones (b).*

La Tabla 27 resume los optimizadores más utilizados. Una recomendación práctica razonable es empezar con Adam o AdamW con su tasa por defecto, 0.001 tanto en Keras como en PyTorch, y cambiar solo si hay un motivo. El campo sigue moviéndose: optimizadores recientes como Muon (2024) se han utilizado ya para entrenar algunos grandes modelos de lenguaje de código abierto, como Kimi K2 (2025), aunque AdamW sigue siendo la referencia.

*Tabla 27. Optimizadores más utilizados.*

| **Optimizador** | **Idea** | **Ventaja** | **Inconveniente** | **Uso habitual** |
|---|---|---|---|---|
| Descenso por gradiente (SGD) | Paso proporcional al gradiente | Sencillo y bien entendido | Lento en valles estrechos; muy sensible a la tasa | Base de todos los demás |
| SGD con momentum | Acumula los gradientes anteriores, como una inercia | Atraviesa valles estrechos y zonas planas | Un hiperparámetro más (la inercia, normalmente 0.9) | Visión por computador, cuando se ajusta con cuidado |
| RMSProp | Tasa propia para cada peso según el tamaño de sus gradientes | Se adapta a pesos con escalas distintas | No incluye momentum | Hoy sustituido en general por Adam |
| Adam | Momentum y tasa propia para cada peso | Funciona bien con poco ajuste | En algunos problemas generaliza algo peor que un SGD bien ajustado | Opción por defecto en la mayoría de proyectos |
| AdamW | Adam con el decaimiento de pesos aplicado aparte (apartado 4.2) | Regulariza mejor que Adam con penalización L2 | Los mismos que Adam | Estándar en Transformers y modelos de lenguaje |

### 3.2. Stochastic Gradient Descent (SGD)

El descenso por gradiente del apartado anterior tiene un problema de escala. Para dar un solo paso necesita el gradiente del coste, que es la media sobre **todos** los ejemplos de entrenamiento: con un millón de ejemplos, una pasada completa por los datos por cada pequeño paso. Es como si el excursionista tuviera que medir la pendiente en un millón de puntos antes de mover un pie.

#### La idea: estimar el gradiente con una muestra

El **descenso por gradiente estocástico** (SGD, *Stochastic Gradient Descent*) calcula el gradiente con un único ejemplo elegido al azar y actualiza los pesos inmediatamente. Ese gradiente es una estimación ruidosa del verdadero, pero acertada en promedio: igual que una encuesta a una muestra aleatoria permite conocer la opinión general sin preguntar a todo el país, el gradiente de un ejemplo al azar apunta, de media, hacia el mismo sitio que el de todos. A cambio de esa imprecisión, cada paso es muchísimo más barato, y en el tiempo de un paso completo se dan miles de pasos aproximados.

La idea procede de los métodos de aproximación estocástica de Robbins y Monro (1951). De hecho, la regla del perceptrón del Módulo 7 ya era estocástica, porque corregía los pesos después de cada ejemplo. En la práctica, los ejemplos se barajan al empezar cada época para que el orden no introduzca sesgos, como ocurriría si todos los impagos de una cartera aparecieran juntos al final del fichero.

#### El ruido: inconveniente y ventaja

La Figura 36a compara el recorrido de los pesos de una regresión logística con dos variables durante dos épocas. El batch completo da dos pasos limpios en la dirección exacta; el estocástico da 400 pasos pequeños y erráticos que, aun así, avanzan hacia el mínimo. Ese ruido tiene dos caras:

- **Inconveniente:** con una tasa de aprendizaje fija, SGD nunca se detiene del todo en el mínimo, sino que sigue rebotando a su alrededor. Por eso se combina con una tasa decreciente, que reduce poco a poco el tamaño de los pasos (Figura 36b).

- **Ventaja:** en el paisaje irregular de una red (apartado 1.1), las sacudidas ayudan a salir de mesetas y puntos de silla en los que un descenso perfectamente suave avanzaría muy despacio. Se considera, además, una de las razones por las que las redes entrenadas con SGD generalizan bien, aunque es una cuestión todavía en estudio.

![](media/image31.png)

*Figura 36. Recorrido de los pesos de una regresión logística durante dos épocas con batch completo, mini-batch de 20 ejemplos y un ejemplo por paso (a), y coste de SGD cerca del mínimo con una tasa de aprendizaje constante y con una tasa decreciente (b). Datos simulados.*

El SGD puro, con un ejemplo por paso, apenas se usa hoy. La razón no es matemática sino de hardware, y lleva directamente a la idea de lote.

### 3.3. Idea de batch y mini-batch

Entre los dos extremos, usar todos los ejemplos en cada paso o usar solo uno, está la opción que se emplea en la práctica: calcular cada paso con un **lote** (*batch*) de unos pocos ejemplos. Se habla de **mini-batch** para distinguirlo del batch completo, aunque en el día a día ambos términos se usan indistintamente. Los lotes de 10 ejemplos que usaba TensorFlow Playground en el apartado 3.4 del Módulo 7 eran exactamente esto.

#### Lote, iteración y época

Con lotes, el entrenamiento se organiza con tres términos que aparecen en cualquier framework (Figura 37 y Tabla 28). Con la red de dígitos del Módulo 7, entrenada con 1347 imágenes y lotes de 32, una época consta de 43 iteraciones: 42 lotes completos y un último lote con los 3 ejemplos restantes.

![](media/image44.png)

*Figura 37. Reparto de los 1347 ejemplos de entrenamiento de la red de dígitos en lotes de 32: cada lote da lugar a una iteración y el conjunto de los 43 lotes, a una época.*

*Tabla 28. Vocabulario del entrenamiento por lotes, con la red de dígitos del Módulo 7.*

| **Término** | **Qué significa** | **En la red de dígitos (lotes de 32)** |
|---|---|---|
| Tamaño de lote (*batch size*) | Número de ejemplos con los que se calcula cada gradiente | 32 imágenes |
| Iteración o paso | Un cálculo del gradiente con un lote y una actualización de los pesos | Se procesan 32 imágenes y se corrigen los 2410 parámetros |
| Época | Una pasada completa por todos los ejemplos de entrenamiento | 1347 / 32 → 43 iteraciones |
| Entrenamiento completo | Número de épocas que se repite el proceso | 30 épocas = 1290 iteraciones |

#### Por qué lotes: aprovechar el hardware

Las GPU, los procesadores que permitieron el despegue del deep learning (apartado 1.2 del Módulo 7), hacen miles de operaciones en paralelo. Procesar 32 ejemplos a la vez les cuesta casi lo mismo que procesar uno, porque los cálculos de todos los ejemplos se agrupan en una única multiplicación de matrices. Con un ejemplo por paso, la mayor parte de esa capacidad queda ociosa; con el batch completo, cada paso tarda mucho y los datos pueden no caber en memoria. El mini-batch aprovecha el hardware y, a la vez, da muchos pasos por época.

La Figura 38 lo muestra con la red 64-32-10 de reconocimiento de dígitos, entrenada con SGD y con la tasa de aprendizaje adecuada a cada tamaño de lote. Por época (Figura 38a), los lotes pequeños avanzan más: tras 30 épocas, la pérdida es de 0.02 con un ejemplo por paso, de 0.08 con lotes de 32 y de 0.43 con el batch completo, que en ese tiempo solo ha dado 30 pasos. Pero lo que cuenta en la práctica es el tiempo de cálculo (Figura 38b). En el mismo tiempo, 0.6 segundos en un ordenador sin GPU, el lote de 32 completa unas 180 épocas y alcanza la pérdida más baja (0.01); el batch completo hace unas 520 épocas y llega a 0.04; y el estocástico puro solo completa 10 épocas y se queda en 0.09, porque desaprovecha la capacidad de cálculo en paralelo. Las tres versiones reconocen correctamente entre el 95 % y el 98 % de los dígitos de prueba.

![](media/image37.png)

*Figura 38. Pérdida de la red de dígitos 64-32-10 con tres tamaños de lote, por época (a) y según el tiempo de cálculo en un ordenador sin GPU (b). Los tiempos exactos dependen del equipo.*

#### Cómo elegir el tamaño de lote

No hay un valor óptimo universal, pero sí pautas contrastadas:

- **Valores habituales:** entre 16 y 512, a menudo potencias de 2 por costumbre. Keras usa 32 por defecto si no se indica otro valor.

- **El límite lo pone la memoria:** con imágenes grandes o modelos de lenguaje, el lote máximo es el que cabe en la GPU, porque la retropropagación necesita guardar los valores intermedios de todos los ejemplos del lote (apartado 2.1).

- **Lote y tasa de aprendizaje van de la mano:** un lote mayor da un gradiente más preciso y admite pasos más largos, así que, si se aumenta mucho el lote, suele ser necesario subir la tasa de aprendizaje. Con lotes muy grandes, además, la red puede generalizar algo peor si no se reajusta el resto de hiperparámetros.

*Tabla 29. Comparativa entre batch completo, SGD y mini-batch.*

| **Aspecto** | **Batch completo** | **Estocástico (lote de 1)** | **Mini-batch (lote de 16 a 512)** |
|---|---|---|---|
| Ejemplos por paso | Todos | Uno | Unas decenas o cientos |
| Pasos por época | Uno | Tantos como ejemplos | Ejemplos / tamaño de lote |
| Calidad del gradiente | Exacto | Muy ruidoso | Ruido moderado |
| Aprovechamiento de la GPU | Alto, pero cada paso es lento | Muy bajo | Alto |
| Memoria necesaria | Puede no caber | Mínima | Ajustable con el tamaño del lote |
| Uso real | Datos pequeños y problemas sencillos | Casi nunca | La opción estándar |

En resumen, entrenar una red es descender a pasos por el paisaje del coste: el gradiente da la dirección, la tasa de aprendizaje la longitud del paso, el optimizador (habitualmente Adam o AdamW) la forma de combinarlos y el tamaño de lote cuántos ejemplos se usan para estimar cada paso.

## 4. Problemas comunes en el entrenamiento

Con la función de coste, la retropropagación y un optimizador ya se tiene todo lo necesario para entrenar una red. En la práctica, sin embargo, el entrenamiento puede fallar de varias maneras. Este apartado se centra en las dos más importantes: que la señal de corrección no llegue bien a todas las capas y que la red aprenda demasiado bien los datos de entrenamiento.

### 4.1. Vanishing / Exploding gradients

El apartado 2.2 terminó con una advertencia: el error de cada capa se obtiene multiplicando el de la capa siguiente por pesos y por pendientes de activación. En una red de dos capas eso no supone un problema, pero en una red profunda la señal de error atraviesa muchas multiplicaciones seguidas antes de llegar a las primeras capas, y una multiplicación repetida tiene un comportamiento extremo.

#### El efecto de multiplicar muchas veces

Si en cada capa la señal se multiplica, de media, por un factor algo menor que 1, al cabo de muchas capas se reduce a casi nada; si el factor es algo mayor que 1, crece sin control (Tabla 30 y Figura 39a). Son las dos caras del mismo problema:

- **Desvanecimiento del gradiente (vanishing gradient):** las primeras capas reciben una señal de corrección minúscula y apenas aprenden, aunque las últimas sí lo hagan. La pérdida se estanca y la red se comporta como si fuera mucho menos profunda.

- **Explosión del gradiente (exploding gradient):** las correcciones son enormes, los pesos dan saltos desproporcionados y la pérdida oscila violentamente o se convierte en «NaN». Es especialmente frecuente en las redes recurrentes, donde la misma operación se repite en cada paso de una secuencia larga.

*Tabla 30. Tamaño de la señal de error tras atravesar varias capas, según el factor por el que se multiplica en cada una.*

| **Factor por capa** | **5 capas** | **10 capas** | **20 capas** | **50 capas** |
|---|---|---|---|---|
| 0.25 (pendiente máxima de la sigmoide) | 0.001 | 0.000001 | 9 · 10⁻¹³ | 8 · 10⁻³¹ |
| 0.5 | 0.03 | 0.001 | 0.000001 | 9 · 10⁻¹⁶ |
| 0.9 | 0.59 | 0.35 | 0.12 | 0.005 |
| 1 | 1 | 1 | 1 | 1 |
| 1.1 | 1.61 | 2.59 | 6.73 | 117 |
| 1.5 | 7.6 | 57.7 | 3325 | 6 · 10⁸ |

El problema ya apareció en la práctica en el apartado 3.4 del Módulo 7: con seis capas ocultas y activación sigmoide, la red de TensorFlow Playground no conseguía aprender, porque la pendiente de la sigmoide vale como mucho 0.25 y, multiplicada capa a capa, apagaba la señal. La Figura 39b lo mide en una red de diez capas ocultas recién inicializada: con sigmoide, la señal que llega a la primera capa es más de 400 000 veces más pequeña que la de la última; con ReLU y una inicialización adecuada, se mantiene constante; y con ReLU pero pesos iniciales un 50 % más grandes, crece 40 veces.

![](media/image6.png)

*Figura 39. Tamaño de una señal que se multiplica capa a capa por distintos factores, en escala logarítmica (a), y señal de error medida en cada capa de una red de diez capas ocultas recién inicializada, con sigmoide, con ReLU bien inicializada y con ReLU con pesos iniciales demasiado grandes (b).*

La red de neuronas del apartado 2.1 permite ver este efecto (Figura 40). Con sigmoide y seis capas ocultas, el error se reduce en cada capa a algo menos de la cuarta parte y a la primera llega unas 1400 veces más débil que a la última (×0.0007): las primeras neuronas apenas se iluminan. Con ReLU pero pesos iniciales un 50 % más grandes, el error crece en cada capa y a la primera llega 8 veces más fuerte. En la versión interactiva puede aumentarse el número de capas para ver que el efecto crece de forma exponencial.

![](media/image13.png)

*Figura 40. Error que llega a cada capa de una red de seis capas ocultas con sigmoide, que se desvanece hacia la entrada (a), y con ReLU y pesos iniciales demasiado grandes, que crece hacia la entrada (b). Valores calculados con una red real.*

#### Cómo se combate

El desvanecimiento del gradiente se identificó a principios de los años noventa (Hochreiter, 1991; Bengio y otros, 1994) y frenó durante años el uso de redes profundas. Hoy no se resuelve con una única técnica, sino con varias piezas que se usan juntas y que los frameworks aplican casi por defecto (Tabla 31):

- **Activaciones sin saturación:** ReLU y sus variantes tienen pendiente 1 en la zona positiva, así que no encogen la señal por sí mismas (apartado 3.3 del Módulo 7).

- **Inicialización cuidadosa:** los pesos iniciales se eligen al azar, pero con una escala calculada según el número de entradas de cada capa, para que la señal ni crezca ni se apague al atravesarla. Es la inicialización de Glorot (o Xavier), pensada para sigmoide y tanh, y la de He, pensada para ReLU. Es exactamente la diferencia entre las dos curvas de ReLU de la Figura 39b.

- **Capas de normalización:** reescalan los valores que pasan de una capa a otra para mantenerlos en un rango estable durante todo el entrenamiento (apartado 4.2 del Módulo 7). La normalización por lotes (*batch normalization*) es habitual en visión; la normalización de capa (*layer normalization*) y variantes como RMSNorm, en los Transformers.

- **Conexiones residuales:** cada bloque de capas suma su entrada a su salida, de modo que la señal de error dispone de un atajo que no atraviesa las multiplicaciones del bloque (Figuras 41 y 42). Fueron la clave de las redes ResNet (2015), que pasaron de unas veinte capas a más de cien, y están presentes en todos los Transformers actuales.

- **Recorte del gradiente (gradient clipping):** si el gradiente supera un tamaño máximo, se reduce proporcionalmente antes de aplicarlo. Es la defensa estándar contra la explosión; en el entrenamiento de modelos de lenguaje es habitual limitar su tamaño a 1.

- **Puertas en las redes recurrentes:** las LSTM (1997) y las GRU (2014) incorporan mecanismos que dejan pasar la información y el error a lo largo de secuencias largas sin multiplicarlos en cada paso.

![](media/image39.png)

*Figura 41. Bloque de dos capas normal (a) y bloque residual, en el que un atajo suma la entrada del bloque a su salida (b).*

En la red de neuronas, los atajos residuales aparecen como arcos que se saltan dos capas (Figura 42). Con la misma activación sigmoide de la Figura 40a, las capas que reciben un atajo (la 2, la 4 y la 6) conservan el error completo, y las intermedias reciben en torno a una cuarta parte (×0.23), frente al ×0.0007 que llegaba a la primera capa sin atajos. El camino directo garantiza que la señal llegue, por muchas capas que tenga la red.

![](media/image27.png)

*Figura 42. La red de la Figura 40a con atajos residuales cada dos capas (arcos verdes): el error ya no se desvanece y llega a las primeras capas. Valores calculados con una red real.*

*Tabla 31. Técnicas contra el desvanecimiento y la explosión del gradiente.*

| **Técnica** | **Qué hace** | **Problema que ataca** | **Origen** |
|---|---|---|---|
| ReLU y variantes | Pendiente 1 en la zona positiva | Desvanecimiento | Nair y Hinton (2010); Glorot y otros (2011) |
| Inicialización de Glorot o de He | Escala los pesos iniciales según el tamaño de la capa | Ambos | Glorot y Bengio (2010); He y otros (2015) |
| Normalización por lotes o de capa | Mantiene estables los valores entre capas | Ambos | Ioffe y Szegedy (2015); Ba y otros (2016) |
| Conexiones residuales | Atajo que suma la entrada del bloque a su salida | Desvanecimiento en redes muy profundas | He y otros, ResNet (2015) |
| Recorte del gradiente | Limita el tamaño máximo del gradiente | Explosión | Mikolov (2012); Pascanu y otros (2013) |
| LSTM y GRU | Puertas que controlan el paso de la información | Ambos, en secuencias largas | Hochreiter y Schmidhuber (1997); Cho y otros (2014) |

Gracias a estas piezas, entrenar redes de decenas o cientos de capas es hoy rutinario. Aun así, el desvanecimiento del gradiente sigue siendo la primera sospecha cuando una red profunda no aprende.

### 4.2. Sobreajuste en redes neuronales

El **sobreajuste** (*overfitting*) es el problema clásico del aprendizaje automático: el modelo aprende los datos de entrenamiento, incluido su ruido, en lugar de los patrones generales, y falla con datos nuevos. En las redes neuronales es especialmente probable por una razón que se vio en el Módulo 7: el teorema de aproximación universal garantiza que una red suficientemente grande puede ajustarse a casi cualquier cosa (apartado 4.1 del Módulo 7). Un experimento muy citado (Zhang y otros, 2017) lo llevó al extremo: redes de visión habituales llegaron a acertar el 100 % de las imágenes de entrenamiento incluso después de sustituir sus etiquetas por otras aleatorias, es decir, memorizaron datos en los que no había ningún patrón que aprender.

#### Cómo se detecta: las curvas de aprendizaje

La herramienta básica de diagnóstico es la **curva de aprendizaje**: la pérdida en entrenamiento y en validación, medida al final de cada época. Mientras ambas bajan, la red está aprendiendo patrones generales. Cuando la de entrenamiento sigue bajando pero la de validación se estanca o empieza a subir, la red ha empezado a memorizar.

La Figura 43 lo muestra con una red 2-128-128-1, con más de 17 000 parámetros, entrenada con solo 80 ejemplos de un problema de clasificación con bastante ruido. La pérdida de validación es mínima en la época 35 y a partir de ahí no deja de crecer, mientras que la de entrenamiento llega prácticamente a cero (Figura 43a). Al final, la red acierta el 100 % de los ejemplos de entrenamiento pero solo el 78 % de los de validación, y su frontera de decisión se retuerce para rodear puntos aislados (Figura 43b). La misma red detenida en la época 35 acierta el 84 % en entrenamiento y el 86 % en validación: peor en los datos que ha visto y mejor en los que no.

![](media/image15.png)

*Figura 43. Pérdida en entrenamiento y en validación de una red 2-128-128-1 entrenada con 80 ejemplos (a) y fronteras de decisión al final del entrenamiento y en el punto de parada temprana (b). Datos simulados.*

#### Cómo se combate

Las técnicas contra el sobreajuste responden a tres ideas: dar a la red más información, limitar su capacidad de memorizar y vigilar cuándo parar.

- **Más datos y aumento de datos:** es la solución más eficaz cuando es posible. Si no hay más datos reales, se generan variantes de los existentes, como giros, recortes o cambios de brillo en imágenes, que es la técnica descrita para el control de calidad industrial (apartado 5.3 del Módulo 7).

- **Parada temprana (early stopping):** se vigila la pérdida de validación y se detiene el entrenamiento cuando lleva varias épocas sin mejorar (la paciencia), conservando los pesos de la mejor época. En la Figura 43 habría detenido la red en la época 35. En Keras se implementa con EarlyStopping; conviene activar su opción restore_best_weights=True, porque por defecto conserva los pesos de la última época, no los de la mejor.

- **Regularización L2 o decaimiento de pesos (weight decay):** se añade al coste una penalización proporcional al cuadrado de los pesos, $J+λw2$ {eq-260}, de modo que la red solo usa pesos grandes si compensan claramente. Es la misma idea que la regresión Ridge. En la red de la Figura 43, una penalización L2 sube el acierto en validación del 78 % al 86 %. AdamW (Tabla 27) aplica esta penalización de la forma más eficaz con optimizadores adaptativos.

- **Dropout:** en cada paso de entrenamiento se apaga al azar una fracción de las neuronas, habitualmente entre el 10 % y el 50 % (Figura 44). La red no puede depender de ninguna neurona concreta y se ve obligada a repartir lo aprendido. Al predecir, todas las neuronas vuelven a estar activas. Lo propusieron Hinton y su equipo en 2012 y sigue siendo de uso general (apartado 4.2 del Módulo 7).

- **Una red más pequeña:** reducir capas o neuronas limita la capacidad de memorizar. Es la pauta del apartado 4.2 del Módulo 7: empezar con un tamaño moderado y ampliar solo si la red no aprende lo suficiente.

- **Partir de un modelo preentrenado:** reutilizar una red ya entrenada con grandes volúmenes de datos y ajustarla al problema propio reduce drásticamente los datos necesarios. Es el *transfer learning*, que se verá en el Módulo 9.

![](media/image41.png)

*Figura 44. Red completa, tal como se usa al predecir (a), y la misma red en un paso de entrenamiento con dropout, en el que se han apagado al azar cuatro de sus doce neuronas ocultas (b).*

Estas técnicas pueden probarse en la pestaña «Entrenamiento y sobreajuste» de la versión interactiva, que entrena una red 2-64-64-1 en directo y dibuja a la vez su frontera de decisión y sus curvas de aprendizaje. Con 80 ejemplos y sin ninguna técnica, la pérdida de validación es mínima en la época 96 y después no deja de crecer; con parada temprana, el entrenamiento se detiene en la época 136 y recupera los pesos de la época 96, que aciertan el 86 % de la validación vs al 78 % del final del entrenamiento sin ella (Figura 45).

![](media/image17.png)

*Figura 45. Pestaña «Entrenamiento y sobreajuste» de la versión interactiva: red 2-64-64-1 entrenada con 80 ejemplos sin técnicas contra el sobreajuste, cuya pérdida de validación crece a partir de la época 96 (a), y la misma red con parada temprana, detenida en la época 136 con los pesos de la época 96 (b). Datos simulados.*

*Tabla 32. Técnicas contra el sobreajuste en redes neuronales.*

| **Técnica** | **Idea** | **Cómo se aplica** | **Valores de partida habituales** |
|---|---|---|---|
| Aumento de datos | Más variedad sin recoger datos nuevos | Transformaciones aleatorias de cada ejemplo en cada época | Giros, recortes y cambios de brillo en imágenes |
| Parada temprana | Detenerse antes de memorizar | Vigilar la pérdida de validación y conservar la mejor época | Paciencia de 5 a 20 épocas |
| Regularización L2 o weight decay | Penalizar los pesos grandes | Término añadido al coste o decaimiento en el optimizador (AdamW) | Entre 0.0001 y 0.1, según el modelo |
| Dropout | Impedir que la red dependa de neuronas concretas | Apagar neuronas al azar, solo durante el entrenamiento | Entre 0.1 y 0.5 |
| Red más pequeña | Menos capacidad de memorizar | Reducir capas o neuronas | 1 o 2 capas de 32 a 64 neuronas (Módulo 7) |
| Modelo preentrenado | Aprovechar lo aprendido con otros datos | Ajustar una red ya entrenada (Módulo 9) | Cuando hay pocos datos propios |

Una advertencia para no simplificar en exceso: en las redes muy grandes, la relación entre tamaño y sobreajuste no es tan directa como en los modelos clásicos. Se ha observado que, a partir de cierto punto, aumentar todavía más el tamaño de la red puede volver a reducir el error con datos nuevos, un fenómeno conocido como **doble descenso** (Belkin y otros, 2019; Nakkiran y otros, 2019). Es una de las razones por las que los grandes modelos actuales funcionan pese a tener muchos más parámetros que ejemplos. Para las redes de tamaño moderado y los datos habituales de empresa, sin embargo, la regla práctica no cambia: lo que decide es la pérdida de validación.

#### Diagnóstico rápido

La mayoría de los problemas de entrenamiento se reconocen en las curvas de pérdida. La Tabla 33 reúne los síntomas más frecuentes, su causa probable y qué conviene probar primero.

*Tabla 33. Diagnóstico rápido a partir de las curvas de pérdida.*

| **Síntoma** | **Causa probable** | **Qué probar primero** |
|---|---|---|
| La pérdida no baja desde el principio | Tasa de aprendizaje demasiado baja, desvanecimiento del gradiente o neuronas muertas | Subir la tasa; usar ReLU con inicialización de He; añadir normalización |
| La pérdida se dispara o aparece «NaN» | Tasa de aprendizaje demasiado alta o explosión del gradiente | Bajar la tasa; recortar el gradiente; revisar el escalado de los datos |
| La pérdida oscila mucho entre iteraciones | Tasa alta o lote muy pequeño | Bajar la tasa o aumentar el lote |
| Entrenamiento y validación altas y parecidas | Subajuste: la red no tiene capacidad suficiente o no ha entrenado bastante | Más épocas, más neuronas o capas; revisar las variables de entrada |
| Entrenamiento baja y validación sube | Sobreajuste | Parada temprana, dropout, L2 o más datos |
| Validación claramente mejor que entrenamiento | Dropout u otra regularización activa solo al entrenar, o validación poco representativa | Comprobar que la validación procede de la misma distribución; una pequeña diferencia es normal |

En resumen, entrenar una red consiste en minimizar una función de coste (apartado 1) descendiendo por su paisaje con los gradientes que calcula la retropropagación (apartado 2), mediante un optimizador que avanza por lotes (apartado 3). Los dos riesgos principales son que la señal de error no llegue bien a las primeras capas, algo que hoy se previene con ReLU, una buena inicialización, normalización y conexiones residuales, y que la red memorice los datos, que se detecta con las curvas de validación y se combate con más datos, parada temprana, regularización y dropout. Todo ello se configura en unas pocas líneas con los frameworks de deep learning, que son el punto de partida del Módulo 9.