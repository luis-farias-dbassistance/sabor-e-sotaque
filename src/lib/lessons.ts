export interface Lesson {
  id: string;
  phrase_pt: string;
  phrase_es: string;
  context: string;
  imageUrl: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  category: 'gastronomy' | 'logistics' | 'adventure';
  lessons: Lesson[];
}

export const INITIAL_DATA: Record<string, Module> = {
  "1": {
    id: "1",
    title: "Hospitalidad Cercana",
    subtitle: "Bienvenida y Servicio",
    category: "gastronomy",
    lessons: [
      { id: "1-1", phrase_pt: "Sejam bem-vindos! Fiquem à vontade.", phrase_es: "¡Sean bienvenidos! Siéntanse a gusto.", context: "Recepción inicial.", imageUrl: "https://images.unsplash.com/photo-1719142525293-370d84487306?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaG9zdCUyMGdyZWV0aW5nJTIwZ3Vlc3RzJTIwd2FybWx5fGVufDB8MHx8fDE3Nzk3MzkyODJ8MA&ixlib=rb-4.1.0" },
      { id: "1-2", phrase_pt: "Mesa para quantos? Gostariam de uma mesa interna ou no terraço?", phrase_es: "¿Mesa para cuántos? ¿Terraza o adentro?", context: "Acomodación.", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
      { id: "1-3", phrase_pt: "O meu nome é [Nome], serei o seu garçom hoje.", phrase_es: "Mi nombre es [Nombre], seré su garzón hoy.", context: "Presentación.", imageUrl: "/images/lessons/1-3-waiter-intro.png" },
      { id: "1-4", phrase_pt: "Posso trazer o cardápio ou gostariam de ver o QR code?", phrase_es: "¿Les traigo la carta o prefieren ver el código QR?", context: "Menú.", imageUrl: "https://images.unsplash.com/photo-1556742205-e10c9486e506?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGlnaXRhbCUyMG1lbnUlMjBRUiUyMGNvZGUlMjB0YWJsZXR8ZW58MHwwfHx8MTc3OTczOTI4M3ww&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80" },
      { id: "1-5", phrase_pt: "Aceitam algo para beber enquanto olham o cardápio?", phrase_es: "¿Desean algo para beber mientras revisan la carta?", context: "Aperitivos.", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80" },
      { id: "1-6", phrase_pt: "Desejam água com ou sem gás? Com gelo e limão?", phrase_es: "¿Desean agua con o sin gas? ¿Con hielo y limón?", context: "Bebidas.", imageUrl: "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=800&q=80" },
      { id: "1-7", phrase_pt: "Por aqui, por favor. Acompanhem-me.", phrase_es: "Por aquí, por favor. Acompáñenme.", context: "Guía a la mesa.", imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80" },
      { id: "1-8", phrase_pt: "Estão celebrando alguma ocasião especial hoje?", phrase_es: "¿Están celebrando alguna ocasión especial hoy?", context: "Cercanía.", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80" },
      { id: "1-9", phrase_pt: "Qualquer coisa que precisarem, é só me chamar.", phrase_es: "Cualquier cosa que necesiten, solo llámenme.", context: "Servicio.", imageUrl: "/images/lessons/1-9-waiter-service.png" },
      { id: "1-10", phrase_pt: "Tenham um excelente jantar e desfrutem da comida.", phrase_es: "Tengan una excelente cena y disfruten la comida.", context: "Deseos.", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "2": {
    id: "2",
    title: "Maestría Parrillera",
    subtitle: "Cortes y Términos",
    category: "gastronomy",
    lessons: [
      { id: "2-1", phrase_pt: "O Lomo Vetado é o nosso Contrafilé, muito suculento.", phrase_es: "El Lomo Vetado es nuestro Contrafilé, muy jugoso.", context: "Equivalencia.", imageUrl: "https://images.unsplash.com/photo-1690983330536-3b0089d07cf9?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyYXclMjBiZWVmJTIwc2lybG9pbiUyMHN0ZWFrJTIwY3V0fGVufDB8MHx8fDE3Nzk3MzkyODR8MA&ixlib=rb-4.1.0" },
      { id: "2-2", phrase_pt: "A Punta de Ganso é a famosa Picanha brasileira.", phrase_es: "La Punta de Ganso es la famosa Picanha brasileña.", context: "Equivalencia.", imageUrl: "https://images.unsplash.com/photo-1723893905879-0e309c2a8e06?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxwaWNhbmhhJTIwYnJhemlsaWFuJTIwYmVlZiUyMGZhdCUyMGNhcHxlbnwwfDB8fHwxNzc5NzM5Mjg1fDA&ixlib=rb-4.1.0" },
      { id: "2-3", phrase_pt: "Qual o ponto da carne que vocês preferem?", phrase_es: "¿Qué punto de cocción prefieren para la carne?", context: "Término.", imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80" },
      { id: "2-4", phrase_pt: "Mal passado: a carne fica bem vermelha e suculenta no centro.", phrase_es: "Poco cocida: la carne queda bien roja y jugosa al centro.", context: "Término.", imageUrl: "/images/lessons/2-4-rare-steak.png" },
      { id: "2-5", phrase_pt: "Ao ponto: rosada no centro, o ponto mais pedido.", phrase_es: "A punto: rosada al centro, el punto más pedido.", context: "Término.", imageUrl: "/images/lessons/2-5-medium-steak.png" },
      { id: "2-6", phrase_pt: "Bem passado: totalmente cozida, sem partes rosadas.", phrase_es: "Bien cocida: totalmente cocida, sin partes rosadas.", context: "Término.", imageUrl: "/images/lessons/2-6-well-done-steak.png" },
      { id: "2-7", phrase_pt: "Desejam o Lomo Liso ou o Lomo Vetado? O Vetado tem mais gordura.", phrase_es: "¿Desean Lomo Liso o Lomo Vetado? El Vetado tiene más grasa.", context: "Elección.", imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80" },
      { id: "2-8", phrase_pt: "Os acompanhamentos são à parte ou prefere um prato combinado?", phrase_es: "¿Los acompañamientos son aparte o prefiere un plato combinado?", context: "Guarniciones.", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxzaWRlJTIwZGlzaGVzJTIwdmVnZXRhYmxlcyUyMHNlcGFyYXRlJTIwYm93bHN8ZW58MHwwfHx8MTc3OTczOTI4N3ww&ixlib=rb-4.1.0" },
      { id: "2-9", phrase_pt: "Esta carne é maturada por vinte e um dias.", phrase_es: "Esta carne es madurada por veintiún días.", context: "Calidad.", imageUrl: "https://images.unsplash.com/photo-1626132662510-34c4b521e0a0?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxkcnklMjBhZ2VkJTIwYmVlZiUyMG1lYXQlMjBoYW5naW5nfGVufDB8MHx8fDE3Nzk3MzkyODh8MA&ixlib=rb-4.1.0" },
      { id: "2-10", phrase_pt: "Recomendo a nossa Parrillada para compartilhar.", phrase_es: "Recomiendo nuestra Parrillada para compartir.", context: "Recomendación.", imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "3": {
    id: "3",
    title: "Clásicos del Campo",
    subtitle: "Sabores Tradicionales",
    category: "gastronomy",
    lessons: [
      { id: "3-1", phrase_pt: "Cuidado com o caroço na empanada de pino.", phrase_es: "Cuidado con el cuesco en la empanada de pino.", context: "Seguridad.", imageUrl: "/images/lessons/3-1-empanada-pino.png" },
      { id: "3-2", phrase_pt: "O Pastel de Choclo é feito com milho fresco moído.", phrase_es: "El Pastel de Choclo está hecho con maíz fresco molido.", context: "Explicación.", imageUrl: "/images/lessons/3-2-pastel-choclo.png" },
      { id: "3-3", phrase_pt: "As Humitas são cozidas na própria palha do milho.", phrase_es: "Las Humitas son cocidas en la propia hoja del maíz.", context: "Explicación.", imageUrl: "/images/lessons/3-3-humitas.png" },
      { id: "3-4", phrase_pt: "O pino é uma mistura de carne picada, cebola e temperos.", phrase_es: "El pino es una mezcla de carne picada, cebolla y condimentos.", context: "Ingredientes.", imageUrl: "/images/lessons/3-4-pino.png" },
      { id: "3-5", phrase_pt: "Gostariam de adicionar açúcar ou tomate no Pastel de Choclo?", phrase_es: "¿Les gustaría agregarle azúcar o tomate al Pastel de Choclo?", context: "Costumbre.", imageUrl: "/images/lessons/3-5-pastel-choclo.png" },
      { id: "3-6", phrase_pt: "A Cazuela é uma sopa tradicional com carne e legumes.", phrase_es: "La Cazuela es una sopa tradicional con carne y verduras.", context: "Plato.", imageUrl: "/images/lessons/3-6-cazuela.png" },
      { id: "3-7", phrase_pt: "O Porotos con Riendas leva feijão e macarrão espaguete.", phrase_es: "Los Porotos con Riendas llevan porotos y fideos espagueti.", context: "Curiosidad.", imageUrl: "/images/lessons/3-7-porotos.png" },
      { id: "3-8", phrase_pt: "Gostariam de acompanhar com uma taça de vinho tinto da casa?", phrase_es: "¿Desean acompañarlo con una copa de vino tinto de la casa?", context: "Maridaje.", imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80" },
      { id: "3-9", phrase_pt: "Este prato é servido em uma tigela de greda quente.", phrase_es: "Este plato se sirve en un pocillo de greda caliente.", context: "Presentación.", imageUrl: "/images/lessons/3-9-pocillo.png" },
      { id: "3-10", phrase_pt: "Desejam o molho pebre? É um pouco picante.", phrase_es: "¿Desean salsa pebre? Es un poco picante.", context: "Condimento.", imageUrl: "/images/lessons/3-10-pebre.png" }
    ]
  },
  "4": {
    id: "4",
    title: "Sandwichería y Mar",
    subtitle: "Sanguches y Mariscos",
    category: "gastronomy",
    lessons: [
      { id: "4-1", phrase_pt: "O Chacarero é um sanduíche de carne com feijão verde.", phrase_es: "El Chacarero es un sándwich de carne con porotos verdes.", context: "Descripción.", imageUrl: "/images/lessons/4-1-chacarero.png" },
      { id: "4-2", phrase_pt: "O Barros Luco leva carne grelhada e queijo derretido.", phrase_es: "El Barros Luco lleva carne a la plancha y queso derretido.", context: "Descripción.", imageUrl: "/images/lessons/4-2-barros-luco.png" },
      { id: "4-3", phrase_pt: "O Mariscal é um mix de mariscos crus com limão e cebola.", phrase_es: "El Mariscal es un mix de mariscos crudos con limón y cebolla.", context: "Descripción.", imageUrl: "/images/lessons/4-3-mariscal.png" },
      { id: "4-4", phrase_pt: "Temos Machas à Parmesana, são gratinadas com queijo.", phrase_es: "Tenemos Machas a la Parmesana, son gratinadas con queso.", context: "Clásico.", imageUrl: "/images/lessons/4-4-machas.png" },
      { id: "4-5", phrase_pt: "O Congro Frito é o peixe mais tradicional do Chile.", phrase_es: "El Congrio Frito es el pescado más tradicional de Chile.", context: "Pescado.", imageUrl: "/images/lessons/4-5-congrio.png" },
      { id: "4-6", phrase_pt: "Gostariam de um pouco de pão com manteiga enquanto esperam?", phrase_es: "¿Les gustaría un poco de pan con mantequilla mientras esperan?", context: "Cortesía.", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80" },
      { id: "4-7", phrase_pt: "O Caldillo de Congrio é uma sopa de peixe muito rica.", phrase_es: "El Caldillo de Congrio es una sopa de pescado muy rica.", context: "Poesía/Cultura.", imageUrl: "/images/lessons/4-7-caldillo-congrio.png" },
      { id: "4-8", phrase_pt: "Temos cervejas artesanais chilenas muito boas.", phrase_es: "Tenemos cervezas artesanales chilenas muy buenas.", context: "Cerveza.", imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80" },
      { id: "4-9", phrase_pt: "O sanduíche é servido em pão frica ou marraqueta?", phrase_es: "¿El sándwich se sirve en pan frica o marraqueta?", context: "Pan.", imageUrl: "/images/lessons/4-9-marraqueta.png" },
      { id: "4-10", phrase_pt: "Desejam maionese caseira? É a nossa especialidade.", phrase_es: "¿Desean mayonesa casera? Es nuestra especialidad.", context: "Tip.", imageUrl: "/images/lessons/4-10-mayonesa.png" },
    ]
  },
  "5": {
    id: "5",
    title: "Alojamiento Turístico",
    subtitle: "Hotelería y Recepción",
    category: "logistics",
    lessons: [
      { id: "5-1", phrase_pt: "Gostaria de fazer o check-in? Preciso do seu passaporte.", phrase_es: "¿Le gustaría hacer el check-in? Necesito su pasaporte.", context: "Entrada del pasajero.", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
      { id: "5-2", phrase_pt: "A senha do Wi-Fi é [senha], o sinal é gratuito.", phrase_es: "La contraseña del Wi-Fi es [contraseña], la señal es gratuita.", context: "Conectividad.", imageUrl: "https://images.unsplash.com/photo-1613368034176-1c00bfe88e5d?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHdpZmklMjBwYXNzd29yZCUyMHNpZ258ZW58MHwwfHx8MTc3OTczOTI5M3ww&ixlib=rb-4.1.0" },
      { id: "5-3", phrase_pt: "O café da manhã é servido das sete às dez da manhã.", phrase_es: "El desayuno se sirve de las siete a las diez de la mañana.", context: "Horario desayuno.", imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80" },
      { id: "5-4", phrase_pt: "Deseja que limpemos o seu quarto hoje?", phrase_es: "¿Desea que limpiemos su habitación hoy?", context: "Servicio de mucama.", imageUrl: "/images/lessons/5-4-limpieza.png" },
      { id: "5-5", phrase_pt: "Vou pedir para trazerem mais toalhas ao seu quarto.", phrase_es: "Voy a pedir que lleven más toallas a su habitación.", context: "Amenidades.", imageUrl: "https://images.unsplash.com/photo-1664227431098-1289c13695c1?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGV4dHJhJTIwdG93ZWxzJTIwYmF0aHJvb218ZW58MHwwfHx8MTc3OTczOTI5NHww&ixlib=rb-4.1.0" },
      { id: "5-6", phrase_pt: "O horário de check-out é até o meio-dia.", phrase_es: "El horario de salida es hasta el mediodía.", context: "Salida del hotel.", imageUrl: "https://images.unsplash.com/photo-1553369728-15ec6971afaf?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGNoZWNrJTIwb3V0JTIwcmVjZXB0aW9uJTIwZGVza3xlbnwwfDB8fHwxNzc5NzM5Mjk1fDA&ixlib=rb-4.1.0" },
      { id: "5-7", phrase_pt: "Podemos guardar as suas malas na recepção.", phrase_es: "Podemos guardar sus maletas en la recepción.", context: "Custodia de equipaje.", imageUrl: "https://images.unsplash.com/photo-1580256081112-e49377338b7f?auto=format&fit=crop&w=800&q=80" },
      { id: "5-8", phrase_pt: "Aceitamos cartão de crédito e pagamento por aproximação.", phrase_es: "Aceptamos tarjeta de crédito y pago por contacto.", context: "Métodos de pago.", imageUrl: "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxjcmVkaXQlMjBjYXJkJTIwcGF5bWVudCUyMHRlcm1pbmFsJTIwaGFuZHxlbnwwfDB8fHwxNzc5NzM5Mjk2fDA&ixlib=rb-4.1.0" },
      { id: "5-9", phrase_pt: "Está muito frio, vou conseguir um cobertor extra para você.", phrase_es: "Hace mucho frío, voy a conseguir una manta extra para usted.", context: "Confort del pasajero.", imageUrl: "https://images.unsplash.com/photo-1630660664869-c9d3cc676880?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxleHRyYSUyMHdhcm0lMjBibGFua2V0JTIwaG90ZWwlMjBiZWR8ZW58MHwwfHx8MTc3OTczOTI5N3ww&ixlib=rb-4.1.0" },
      { id: "5-10", phrase_pt: "Vou enviar o técnico para consertar o chuveiro quente.", phrase_es: "Voy a enviar al técnico a reparar la ducha de agua caliente.", context: "Resolución de fallas.", imageUrl: "https://images.unsplash.com/photo-1613849925362-38fb4c16ff36?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxzaG93ZXIlMjByZXBhaXIlMjBwbHVtYmVyJTIwYmF0aHJvb218ZW58MHwwfHx8MTc3OTczOTI5OHww&ixlib=rb-4.1.0" }
    ]
  },
  "6": {
    id: "6",
    title: "Transporte Turístico",
    subtitle: "Transfers y Rutas",
    category: "logistics",
    lessons: [
      { id: "6-1", phrase_pt: "O motorista vai passar para te buscar às oito horas.", phrase_es: "El chofer pasará a buscarlo a las ocho en punto.", context: "Coordinación de salida.", imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" },
      { id: "6-2", phrase_pt: "A viagem até o destino leva aproximadamente duas horas.", phrase_es: "El viaje hasta el destino toma aproximadamente dos horas.", context: "Duración del trayecto.", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
      { id: "6-3", phrase_pt: "Por favor, usem o cinto de segurança durante todo o trajeto.", phrase_es: "Por favor, usen el cinturón de seguridad durante todo el trayecto.", context: "Norma de seguridad.", imageUrl: "https://images.unsplash.com/photo-1605647381739-9bba88b1c5d1?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxjYXIlMjBzZWF0YmVsdCUyMHNhZmV0eSUyMGJ1Y2tsZXxlbnwwfDB8fHwxNzc5NzM5Mjk5fDA&ixlib=rb-4.1.0" },
      { id: "6-4", phrase_pt: "Por favor, coloque a bagagem de mão no compartimento superior.", phrase_es: "Por favor, coloque el equipaje de mano en el compartimento superior.", context: "Orden de equipaje.", imageUrl: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80" },
      { id: "6-5", phrase_pt: "Se precisarem usar o banheiro, podemos parar no próximo posto.", phrase_es: "Si necesitan usar el baño, podemos parar en la próxima estación de servicio.", context: "Necesidad técnica.", imageUrl: "https://images.unsplash.com/photo-1689265002579-48d6f0797275?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwcmVzdCUyMHN0b3AlMjByb2FkJTIwdHJpcHxlbnwwfDB8fHwxNzc5NzM5MzAwfDA&ixlib=rb-4.1.0" },
      { id: "6-6", phrase_pt: "A tarifa até o aeroporto é um valor fixo.", phrase_es: "La tarifa hacia el aeropuerto es un precio fijo.", context: "Explicación de cobro.", imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" },
      { id: "6-7", phrase_pt: "A estação de metrô mais próxima fica a duas quadras daqui.", phrase_es: "La estación de metro más cercana queda a dos cuadras de aquí.", context: "Ubicación e indicaciones.", imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80" },
      { id: "6-8", phrase_pt: "O embarque será realizado pelo portão número três.", phrase_es: "El embarque se realizará por la puerta número tres.", context: "Terminal.", imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80" },
      { id: "6-9", phrase_pt: "Motorista, por favor, vá com calma e respeite o limite de velocidade.", phrase_es: "Chofer, por favor vaya con cuidado y respete el límite de velocidad.", context: "Seguridad vial.", imageUrl: "https://images.unsplash.com/photo-1657844389497-166c81c6ee5b?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxzcGVlZCUyMGxpbWl0JTIwc2lnbiUyMHJvYWR8ZW58MHwwfHx8MTc3OTczOTMwMXww&ixlib=rb-4.1.0" },
      { id: "6-10", phrase_pt: "Há um pouco de trânsito no centro devido a obras na pista.", phrase_es: "Hay un poco de tráfico en el centro debido a obras en la calle.", context: "Estado de la ruta.", imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "7": {
    id: "7",
    title: "Agencia de Viajes",
    subtitle: "Reservas y Paquetes",
    category: "logistics",
    lessons: [
      { id: "7-1", phrase_pt: "A sua reserva está confirmada para o dia quinze.", phrase_es: "Su reserva está confirmada para el día quince.", context: "Reserva de servicio.", imageUrl: "https://images.unsplash.com/photo-1655722724447-2d2a3071e7f8?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBib29raW5nJTIwY29uZmlybWF0aW9uJTIwdGlja2V0fGVufDB8MHx8fDE3Nzk3MzkzMDJ8MA&ixlib=rb-4.1.0" },
      { id: "7-2", phrase_pt: "Temos passeios disponíveis pela manhã e pela tarde.", phrase_es: "Tenemos paseos disponibles por la mañana y por la tarde.", context: "Disponibilidad.", imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
      { id: "7-3", phrase_pt: "O pacote inclui o transporte, o guia e o almoço completo.", phrase_es: "El paquete incluye el transporte, el guía y el almuerzo completo.", context: "Servicios incluidos.", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" },
      { id: "7-4", phrase_pt: "Em caso de cancelamento, avise-nos com vinte e quatro horas de antecedência.", phrase_es: "En caso de cancelación, avísenos con veinticuatro horas de anticipación.", context: "Políticas.", imageUrl: "https://images.unsplash.com/photo-1522199873717-bc67b1a5e32b?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxjYW5jZWxsYXRpb24lMjBwb2xpY3klMjBkb2N1bWVudCUyMHRyYXZlbHxlbnwwfDB8fHwxNzc5NzM5MzAzfDA&ixlib=rb-4.1.0" },
      { id: "7-5", phrase_pt: "O reembolso será creditado no mesmo cartão em cinco dias.", phrase_es: "El reembolso será acreditado en la misma tarjeta en cinco días.", context: "Devoluciones.", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZWZ1bmQlMjBtb25leSUyMGNyZWRpdCUyMGNhcmQlMjB0cmFuc2FjdGlvbnxlbnwwfDB8fHwxNzc5NzM5MzA0fDA&ixlib=rb-4.1.0" },
      { id: "7-6", phrase_pt: "Por favor, apresente este comprovante impresso ou no celular.", phrase_es: "Por favor, presente este comprobante impreso o en el celular.", context: "Chequeo de ticket.", imageUrl: "https://images.unsplash.com/photo-1593871097805-09627f52f4bb?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB2b3VjaGVyJTIwdGlja2V0JTIwcHJpbnRlZHxlbnwwfDB8fHwxNzc5NzM5MzA1fDA&ixlib=rb-4.1.0" },
      { id: "7-7", phrase_pt: "Se chover muito, o passeio pode ser remarcado ou cancelado.", phrase_es: "Si llueve mucho, el paseo puede ser reprogramado o cancelado.", context: "Clima.", imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80" },
      { id: "7-8", phrase_pt: "Recomendamos fortemente contratar um seguro de viagem internacional.", phrase_es: "Recomendamos encarecidamente contratar un seguro de viaje internacional.", context: "Consejo de viaje.", imageUrl: "https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBpbnN1cmFuY2UlMjBkb2N1bWVudCUyMHBhc3Nwb3J0fGVufDB8MHx8fDE3Nzk3MzkzMDZ8MA&ixlib=rb-4.1.0" },
      { id: "7-9", phrase_pt: "Podemos montar um itinerário sob medida para a sua família.", phrase_es: "Podemos armar un itinerario a la medida para su familia.", context: "Personalización.", imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80" },
      { id: "7-10", phrase_pt: "Qualquer dúvida, pode nos contatar por WhatsApp neste número.", phrase_es: "Cualquier duda, puede contactarnos por WhatsApp a este número.", context: "Atención post-venta.", imageUrl: "https://images.unsplash.com/photo-1729860649405-96dec89ec58b?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHx3aGF0c2FwcCUyMGNoYXQlMjBtb2JpbGUlMjBwaG9uZXxlbnwwfDB8fHwxNzc5NzM5MzA2fDA&ixlib=rb-4.1.0" }
    ]
  },
  "8": {
    id: "8",
    title: "Guiado Turístico",
    subtitle: "Tours y Atractivos",
    category: "adventure",
    lessons: [
      { id: "8-1", phrase_pt: "Olá a todos! Eu serei o seu guia turístico hoje.", phrase_es: "¡Hola a todos! Yo seré su guía turístico hoy.", context: "Bienvenida.", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHx0b3VyJTIwYnVzJTIwdm91Y2hlciUyMHRpY2tldCUyMGJvYXJkaW5nfGVufDB8MHx8fDE3Nzk3MzkzMDl8MA&ixlib=rb-4.1.0" },
      { id: "8-2", phrase_pt: "Esta igreja foi construída no século dezoito e é patrimônio nacional.", phrase_es: "Esta iglesia fue construida en el siglo dieciocho y es patrimonio nacional.", context: "Dato histórico.", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=800&q=80" },
      { id: "8-3", phrase_pt: "Por favor, fiquem juntos para não se perderem na multidão.", phrase_es: "Por favor, permanezcan juntos para no perderse en la multitud.", context: "Control de grupo.", imageUrl: "/images/lessons/8-3-tour-guide.png" },
      { id: "8-4", phrase_pt: "Nosso ponto de encontro será em frente ao museu às quatro horas.", phrase_es: "Nuestro punto de encuentro será frente al museo a las cuatro en punto.", context: "Coordinación.", imageUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=800&q=80" },
      { id: "8-5", phrase_pt: "Teremos quinze minutos para tirar fotos nesta bela vista.", phrase_es: "Tendremos quince minutos para tomar fotos en esta hermosa vista.", context: "Tiempo libre.", imageUrl: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=800&q=80" },
      { id: "8-6", phrase_pt: "Nesta reserva podemos ver condores e raposas nativas.", phrase_es: "En esta reserva podemos ver cóndores y zorros nativos.", context: "Naturaleza.", imageUrl: "/images/lessons/8-6-condor.png" },
      { id: "8-7", phrase_pt: "Se tiverem alguma dúvida sobre a história local, fiquem à vontade para perguntar.", phrase_es: "Si tienen alguna duda sobre la historia local, siéntanse libres de preguntar.", context: "Interacción.", imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" },
      { id: "8-8", phrase_pt: "Agora vocês têm uma hora livre para caminhar pelo parque.", phrase_es: "Ahora tienen una hora libre para caminar por el parque.", context: "Recreación.", imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80" },
      { id: "8-9", phrase_pt: "Recomendo comprar artesanato local na feira que fica logo ali.", phrase_es: "Recomiendo comprar artesanías locales en la feria que queda justo allí.", context: "Sugerencia de compras.", imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80" },
      { id: "8-10", phrase_pt: "Muito obrigado pela companhia de todos! Espero que tenham gostado.", phrase_es: "¡Muchas gracias por la compañía de todos! Espero que les haya gustado.", context: "Cierre del tour.", imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "9": {
    id: "9",
    title: "Tour Operador",
    subtitle: "Operación y Logística",
    category: "adventure",
    lessons: [
      { id: "9-1", phrase_pt: "Confirmamos o seu horário de saída direto no seu hotel.", phrase_es: "Confirmamos su horario de salida directo en su hotel.", context: "Pick-up.", imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
      { id: "9-2", phrase_pt: "Preciso ver o voucher de cada família antes de entrar no ônibus.", phrase_es: "Necesito ver el voucher de cada familia antes de subir al bus.", context: "Control de abordaje.", imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80" },
      { id: "9-3", phrase_pt: "Distribuiremos garrafas de água e lanches leves durante o percurso.", phrase_es: "Distribuiremos botellas de agua y colaciones ligeras durante el trayecto.", context: "Servicio a bordo.", imageUrl: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80" },
      { id: "9-4", phrase_pt: "Temos um cronograma apertado, por favor respeitem os horários.", phrase_es: "Tenemos un cronograma apretado, por favor respeten los horarios.", context: "Puntualidad.", imageUrl: "https://images.unsplash.com/photo-1580674287405-80cd77a2fee2?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjBlcXVpcG1lbnQlMjByZXR1cm4lMjBzaG9wJTIwc3RvcmV8ZW58MHwwfHx8MTc3OTczOTMyMHww&ixlib=rb-4.1.0" },
      { id: "9-5", phrase_pt: "Faremos uma parada técnica para ir ao banheiro em dez minutos.", phrase_es: "Haremos una parada técnica para ir al baño en diez minutos.", context: "Descanso.", imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80" },
      { id: "9-6", phrase_pt: "Siga sempre as instruções de segurança do nosso coordenador de grupo.", phrase_es: "Siga siempre las instrucciones de seguridad de nuestro coordinador de grupo.", context: "Orden de grupo.", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" },
      { id: "9-7", phrase_pt: "Em caso de emergência, meu número está no verso do crachá.", phrase_es: "En caso de emergencia, mi número está al reverso de la credencial.", context: "Seguridad.", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
      { id: "9-8", phrase_pt: "Os ingressos para o parque já estão inclusos no seu pacote.", phrase_es: "Las entradas al parque ya están incluidas en su paquete.", context: "Inclusiones.", imageUrl: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80" },
      { id: "9-9", phrase_pt: "Temos um passeio opcional de barco, o valor é pago diretamente na bilheteria.", phrase_es: "Tenemos un paseo opcional en bote, el valor se paga directamente en la boletería.", context: "Servicio extra.", imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80" },
      { id: "9-10", phrase_pt: "Esperamos que tenham tido uma experiência fantástica. Avaliem-nos no site!", phrase_es: "Esperamos que hayan tenido una experiencia fantástica. ¡Califíquenos en el sitio!", context: "Encuesta de satisfacción.", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "10": {
    id: "10",
    title: "Trekking y Senderismo",
    subtitle: "Senderos y Seguridad",
    category: "adventure",
    lessons: [
      { id: "10-1", phrase_pt: "É fundamental usar calçado adequado com boa aderência para a caminhada.", phrase_es: "Es fundamental usar calzado adecuado con buen agarre para la caminata.", context: "Calzado técnico.", imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80" },
      { id: "10-2", phrase_pt: "Este sendero tem dificuldade média e leva três horas de subida.", phrase_es: "Este sendero tiene dificultad media y toma tres horas de subida.", context: "Esfuerzo físico.", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
      { id: "10-3", phrase_pt: "Beba água constantemente, mesmo que não sinta muita sede.", phrase_es: "Beba agua constantemente, aunque no sienta mucha sed.", context: "Hidratación.", imageUrl: "https://images.unsplash.com/photo-1530711654140-23ef9ad45094?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxoaWtpbmclMjB3YXRlciUyMGJvdHRsZSUyMGRyaW5rJTIwdHJhaWx8ZW58MHwwfHx8MTc3OTczOTMxMHww&ixlib=rb-4.1.0" },
      { id: "10-4", phrase_pt: "Por favor, nunca saia da trilha marcada para preservar a natureza.", phrase_es: "Por favor, nunca se salga del sendero marcado para preservar la naturaleza.", context: "Ecología.", imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80" },
      { id: "10-5", phrase_pt: "Leve todo o seu lixo de volta com você, não deixe nada no caminho.", phrase_es: "Lleve toda su basura de vuelta con usted, no deje nada en el camino.", context: "Cuidado ambiental.", imageUrl: "https://images.unsplash.com/photo-1543255773-ad33ae7efd7e?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxsZWF2ZSUyMG5vJTIwdHJhY2UlMjBoaWtpbmclMjBwYWNrJTIwdHJhc2h8ZW58MHwwfHx8MTc3OTczOTMxMXww&ixlib=rb-4.1.0" },
      { id: "10-6", phrase_pt: "O vento na cordilheira está muito forte hoje, usem casaco corta-vento.", phrase_es: "El viento en la cordillera está muy fuerte hoy, usen chaqueta cortavientos.", context: "Clima extremo.", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
      { id: "10-7", phrase_pt: "Use protetor solar e boné, o sol da tarde queima bastante.", phrase_es: "Use protector solar y gorra, el sol de la tarde quema bastante.", context: "Salud e higiene.", imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80" },
      { id: "10-8", phrase_pt: "Não alimente os animais silvestres que encontrar pelo caminho.", phrase_es: "No alimente a los animales silvestres que encuentre en el camino.", context: "Fauna local.", imageUrl: "https://images.unsplash.com/photo-1765885615225-6ab530277c28?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxkbyUyMG5vdCUyMGZlZWQlMjB3aWxkbGlmZSUyMHNpZ24lMjB0cmFpbHxlbnwwfDB8fHwxNzc5NzM5MzEyfDA&ixlib=rb-4.1.0" },
      { id: "10-9", phrase_pt: "Faremos uma pausa curta para descansar e comer barras de cereal.", phrase_es: "Haremos una pausa corta para descansar y comer barras de cereal.", context: "Recuperación.", imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80" },
      { id: "10-10", phrase_pt: "Chegamos ao cume! A vista lá de cima compensa todo o esforço.", phrase_es: "¡Llegamos a la cumbre! La vista desde allá arriba compensa todo el esfuerzo.", context: "Logro.", imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "11": {
    id: "11",
    title: "Cabalgatas",
    subtitle: "Caballos y Naturaleza",
    category: "adventure",
    lessons: [
      { id: "11-1", phrase_pt: "O uso do capacete é obrigatório para realizar a cavalgada.", phrase_es: "El uso de casco es obligatorio para realizar la cabalgata.", context: "Norma de seguridad.", imageUrl: "https://images.unsplash.com/photo-1598711033236-3e0b403a14e8?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJpZGluZyUyMGhlbG1ldCUyMHNhZmV0eXxlbnwwfDB8fHwxNzc5NzM5MzEzfDA&ixlib=rb-4.1.0" },
      { id: "11-2", phrase_pt: "Suba no cavalo pelo lado esquerdo, apoiando o pé no estribo.", phrase_es: "Suba al caballo por el lado izquierdo, apoyando el pie en el estribo.", context: "Montura.", imageUrl: "https://images.unsplash.com/photo-1522575196731-217bd9006602?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3JzZXMlMjB0cmFpbCUyMHJpZGluZyUyMGRpc3RhbmNlfGVufDB8MHx8fDE3Nzk3MzkzMTV8MA&ixlib=rb-4.1.0" },
      { id: "11-3", phrase_pt: "Segure as rédeas com firmeza, mas sem puxar muito forte.", phrase_es: "Sostenga las riendas con firmeza, pero sin tirar muy fuerte.", context: "Instrucciones básicas.", imageUrl: "https://images.unsplash.com/photo-1607273225241-035d579b8452?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxob3JzZSUyMHJlaW5zJTIwaGFuZHMlMjBob2xkaW5nfGVufDB8MHx8fDE3Nzk3MzkzMTR8MA&ixlib=rb-4.1.0" },
      { id: "11-4", phrase_pt: "Mantenha sempre uma distância segura do cavalo que vai na frente.", phrase_es: "Mantenga siempre una distancia segura del caballo que va adelante.", context: "Orden de cabalgata.", imageUrl: "/images/lessons/11-4-horses.png" },
      { id: "11-5", phrase_pt: "Puxe a rédea para a direita para virar o cavalo para esse lado.", phrase_es: "Tire de la rienda hacia la derecha para girar el caballo hacia ese lado.", context: "Conducción.", imageUrl: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=800&q=80" },
      { id: "11-6", phrase_pt: "Para parar o cavalo, puxe as duas rédeas suavemente para trás e diga 'ôpa'.", phrase_es: "Para detener al caballo, tire de ambas riendas suavemente hacia atrás y diga 'opa'.", context: "Freno.", imageUrl: "https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxjYWxtJTIwaG9yc2UlMjByaWRpbmclMjBiYWxhbmNlJTIwcmlkZXJ8ZW58MHwwfHx8MTc3OTczOTMxNnww&ixlib=rb-4.1.0" },
      { id: "11-7", phrase_pt: "Fique calmo e mantenha o equilíbrio, o cavalo conhece bem este caminho.", phrase_es: "Mantenga la calma y el equilibrio, el caballo conoce bien este camino.", context: "Confianza.", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80" },
      { id: "11-8", phrase_pt: "Durante as descidas íngremes, incline o corpo um pouco para trás.", phrase_es: "Durante las bajadas empinadas, incline el cuerpo un poco hacia atrás.", context: "Técnica de descenso.", imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80" },
      { id: "11-9", phrase_pt: "Não dê comida aos cavalos sem a autorização do guia responsável.", phrase_es: "No le dé comida a los caballos sin la autorización del guía responsable.", context: "Alimentación animal.", imageUrl: "https://images.unsplash.com/photo-1706384447818-ae16960ebfba?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxmZWVkaW5nJTIwaG9yc2UlMjBoYW5kJTIwdHJlYXR8ZW58MHwwfHx8MTc3OTczOTMxN3ww&ixlib=rb-4.1.0" },
      { id: "11-10", phrase_pt: "Para descer do cavalo, espere que ele pare completamente e solte os pés dos estribos.", phrase_es: "Para bajar del caballo, espere que se detenga por completo y saque los pies de los estribos.", context: "Finalización.", imageUrl: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  "12": {
    id: "12",
    title: "Arriendo de Equipamiento",
    subtitle: "Alquiler y Garantía",
    category: "adventure",
    lessons: [
      { id: "12-1", phrase_pt: "Qual o seu tamanho de calçado para as botas de esqui?", phrase_es: "¿Cuál es su talla de calzado para las botas de esquí?", context: "Medida del equipo.", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80" },
      { id: "12-2", phrase_pt: "É necessário deixar um documento ou cartão de crédito como garantia.", phrase_es: "Es necesario dejar un documento o tarjeta de crédito como garantía.", context: "Garantía de arriendo.", imageUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxpZCUyMGNhcmQlMjBkZXBvc2l0JTIwcmVudGFsJTIwZG9jdW1lbnR8ZW58MHwwfHx8MTc3OTczOTMxOXww&ixlib=rb-4.1.0" },
      { id: "12-3", phrase_pt: "O aluguel é cobrado por dia ou por hora de uso?", phrase_es: "¿El arriendo se cobra por día o por hora de uso?", context: "Consulta de tarifa.", imageUrl: "https://images.unsplash.com/photo-1590986201364-ce95ab280ca2?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjBwcmljZSUyMHNpZ24lMjBzaG9wJTIwZXF1aXBtZW50fGVufDB8MHx8fDE3Nzk3MzkzMTl8MA&ixlib=rb-4.1.0" },
      { id: "12-4", phrase_pt: "Qualquer dano ou perda do equipamento será cobrado na devolução.", phrase_es: "Cualquier daño o pérdida del equipo será cobrado en la devolución.", context: "Políticas de daño.", imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80" },
      { id: "12-5", phrase_pt: "As botas estão confortáveis ou deseja experimentar um número maior?", phrase_es: "¿Las botas están cómodas o desea probar un número más grande?", context: "Ajuste.", imageUrl: "https://images.unsplash.com/photo-1605548230624-8d2d0419c517?auto=format&fit=crop&w=800&q=80" },
      { id: "12-6", phrase_pt: "O equipamento deve ser devolvido até as dezoito horas na loja.", phrase_es: "El equipo debe ser devuelto antes de las dieciocho horas en la tienda.", context: "Límite de devolución.", imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80" },
      { id: "12-7", phrase_pt: "Não é permitido sublocar ou emprestar o equipamento alugado.", phrase_es: "No está permitido subarrendar o prestar el equipo arrendado.", context: "Normativa de uso.", imageUrl: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjBhZ3JlZW1lbnQlMjBjb250cmFjdCUyMHNpZ25pbmd8ZW58MHwwfHx8MTc3OTczOTMyMXww&ixlib=rb-4.1.0" },
      { id: "12-8", phrase_pt: "Por favor, limpe a areia ou neve antes de entregar o equipamento.", phrase_es: "Por favor, limpie la arena o nieve antes de entregar el equipo.", context: "Cuidado del equipo.", imageUrl: "/images/lessons/12-8-skiing.png" },
      { id: "12-9", phrase_pt: "O aluguel da prancha já inclui os óculos de proteção e o capacete.", phrase_es: "El arriendo de la tabla ya incluye las gafas de protección y el casco.", context: "Accesorios incluidos.", imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80" },
      { id: "12-10", phrase_pt: "Guarde este recibo para poder retirar o seu depósito na saída.", phrase_es: "Guarde este recibo para poder retirar su depósito a la salida.", context: "Recibo técnico.", imageUrl: "https://images.unsplash.com/photo-1648823161626-0e839927401b?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwZGVwb3NpdCUyMHJlZnVuZCUyMHBhcGVyfGVufDB8MHx8fDE3Nzk3MzkzMjN8MA&ixlib=rb-4.1.0" }
    ]
  },
  "13": {
    id: "13",
    title: "Alimentación Turística",
    subtitle: "Cafés y Viñedos",
    category: "gastronomy",
    lessons: [
      { id: "13-1", phrase_pt: "Desejam fazer a degustação de vinhos tintos ou brancos hoje?", phrase_es: "¿Desean hacer la degustación de vinos tintos o blancos hoy?", context: "Catas.", imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80" },
      { id: "13-2", phrase_pt: "Alguém na mesa tem alguma alergia ou restrição alimentar?", phrase_es: "¿Alguien en la mesa tiene alguna alergia o restricción alimentaria?", context: "Salud alimentaria.", imageUrl: "/images/lessons/13-2-alergia.png" },
      { id: "13-3", phrase_pt: "O prato do dia de hoje é massa fresca com molho de cogumelos.", phrase_es: "El plato del día de hoy es pasta fresca con salsa de champiñones.", context: "Sugerencia del día.", imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80" },
      { id: "13-4", phrase_pt: "Nosso café espresso é preparado com grãos torrados localmente.", phrase_es: "Nuestro café espresso es preparado con granos tostados localmente.", context: "Servicio de cafetería.", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" },
      { id: "13-5", phrase_pt: "A taxa de serviço de dez por cento não está incluída no preço do prato.", phrase_es: "La tasa de servicio del diez por ciento no está incluida en el precio del plato.", context: "Propinas.", imageUrl: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGlwJTIwc2VydmljZSUyMGNoYXJnZSUyMGJpbGx8ZW58MHwwfHx8MTc3OTczOTMyNXww&ixlib=rb-4.1.0" },
      { id: "13-6", phrase_pt: "Temos azeite de oliva extra virgem de produção local para acompanhar.", phrase_es: "Tenemos aceite de oliva extra virgen de producción local para acompañar.", context: "Condimentos.", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80" },
      { id: "13-7", phrase_pt: "Podem pedir a conta diretamente para mim quando estiverem prontos.", phrase_es: "Pueden pedir la cuenta directamente a mí cuando estén listos.", context: "Cobro.", imageUrl: "https://images.unsplash.com/photo-1714974528823-7f13bd3bf148?ixid=M3w5NjA4MDJ8MHwxfHNlYXJjaHwxfHxhc2tpbmclMjBmb3IlMjBiaWxsJTIwY2hlY2slMjByZXN0YXVyYW50JTIwd2FpdGVyfGVufDB8MHx8fDE3Nzk3MzkzMjZ8MA&ixlib=rb-4.1.0" },
      { id: "13-8", phrase_pt: "Aceitamos todos os cartões de crédito e carteiras digitais.", phrase_es: "Aceptamos todas las tarjetas de crédito y billeteras digitales.", context: "Medios de pago.", imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80" },
      { id: "13-9", phrase_pt: "Recomendo provar a nossa torta de mil-folhas com doce de leite.", phrase_es: "Les recomiendo probar nuestra torta de milhojas con manjar.", context: "Postres recomendados.", imageUrl: "/images/lessons/13-9-milhojas.png" },
      { id: "13-10", phrase_pt: "O serviço de pães de boas-vindas é cortesia da casa.", phrase_es: "El servicio de pan de bienvenida es cortesía de la casa.", context: "Cortesías.", imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80" }
    ]
  }
};
