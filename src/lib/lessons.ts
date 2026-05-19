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
  lessons: Lesson[];
}

export const INITIAL_DATA: Record<string, Module> = {
  "1": {
    id: "1",
    title: "Hospitalidad Cercana",
    subtitle: "Bienvenida y Servicio",
    lessons: [
      { id: "1-1", phrase_pt: "Sejam bem-vindos! Fiquem à vontade.", phrase_es: "¡Sean bienvenidos! Siéntanse a gusto.", context: "Recepción inicial.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-2", phrase_pt: "Mesa para quantos? Gostariam de uma mesa interna ou no terraço?", phrase_es: "¿Mesa para cuántos? ¿Terraza o adentro?", context: "Acomodación.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-3", phrase_pt: "O meu nome é [Nome], serei o seu garçom hoje.", phrase_es: "Mi nombre es [Nombre], seré su garzón hoy.", context: "Presentación.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-4", phrase_pt: "Posso trazer o cardápio ou gostariam de ver o QR code?", phrase_es: "¿Les traigo la carta o prefieren ver el código QR?", context: "Menú.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-5", phrase_pt: "Aceitam algo para beber enquanto decidem o prato?", phrase_es: "¿Aceptan algo para beber mientras deciden el plato?", context: "Aperitivos.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-6", phrase_pt: "Desejam água com ou sem gás? Com gelo e limão?", phrase_es: "¿Desean agua con o sin gas? ¿Con hielo y limón?", context: "Bebidas.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-7", phrase_pt: "Por aqui, por favor. Acompanhem-me.", phrase_es: "Por aquí, por favor. Acompáñenme.", context: "Guía a la mesa.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-8", phrase_pt: "Estão celebrando alguma ocasião especial hoje?", phrase_es: "¿Están celebrando alguna ocasión especial hoy?", context: "Cercanía.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-9", phrase_pt: "Qualquer coisa que precisarem, é só me chamar.", phrase_es: "Cualquier cosa que necesiten, solo llámenme.", context: "Servicio.", imageUrl: "/images/hospitalidad.avif" },
      { id: "1-10", phrase_pt: "Tenham um excelente jantar e desfrutem da comida.", phrase_es: "Tengan una excelente cena y disfruten la comida.", context: "Deseos.", imageUrl: "/images/hospitalidad.avif" }
    ]
  },
  "2": {
    id: "2",
    title: "Maestría Parrillera",
    subtitle: "Cortes y Términos",
    lessons: [
      { id: "2-1", phrase_pt: "O Lomo Vetado é o nosso Contrafilé, muito suculento.", phrase_es: "El Lomo Vetado es nuestro Contrafilé, muy jugoso.", context: "Equivalencia.", imageUrl: "/images/parrilla.avif" },
      { id: "2-2", phrase_pt: "A Punta de Ganso é a famosa Picanha brasileira.", phrase_es: "La Punta de Ganso es la famosa Picanha brasileña.", context: "Equivalencia.", imageUrl: "/images/parrilla.avif" },
      { id: "2-3", phrase_pt: "Como gostariam do ponto da carne?", phrase_es: "¿Cómo les gustaría el punto de la carne?", context: "Término.", imageUrl: "/images/parrilla.avif" },
      { id: "2-4", phrase_pt: "Mal passado: a carne fica bem vermelha e suculenta no centro.", phrase_es: "Poco cocida: la carne queda bien roja y jugosa al centro.", context: "Término.", imageUrl: "/images/parrilla.avif" },
      { id: "2-5", phrase_pt: "Ao ponto: rosada no centro, o ponto mais pedido.", phrase_es: "A punto: rosada al centro, el punto más pedido.", context: "Término.", imageUrl: "/images/parrilla.avif" },
      { id: "2-6", phrase_pt: "Bem passado: totalmente cozida, sem partes rosadas.", phrase_es: "Bien cocida: totalmente cocida, sin partes rosadas.", context: "Término.", imageUrl: "/images/parrilla.avif" },
      { id: "2-7", phrase_pt: "Desejam o Lomo Liso ou o Lomo Vetado? O Vetado tem mais gordura.", phrase_es: "¿Desean Lomo Liso o Lomo Vetado? El Vetado tiene más grasa.", context: "Elección.", imageUrl: "/images/parrilla.avif" },
      { id: "2-8", phrase_pt: "Os acompanhamentos são à parte ou prefere um prato combinado?", phrase_es: "¿Los acompañamientos son aparte o prefiere un plato combinado?", context: "Guarniciones.", imageUrl: "/images/parrilla.avif" },
      { id: "2-9", phrase_pt: "Esta carne é maturada por vinte e um dias.", phrase_es: "Esta carne es madurada por veintiún días.", context: "Calidad.", imageUrl: "/images/parrilla.avif" },
      { id: "2-10", phrase_pt: "Recomendo a nossa Parrillada para compartilhar.", phrase_es: "Recomiendo nuestra Parrillada para compartir.", context: "Recomendación.", imageUrl: "/images/parrilla.avif" }
    ]
  },
  "3": {
    id: "3",
    title: "Clásicos del Campo",
    subtitle: "Sabores Tradicionales",
    lessons: [
      { id: "3-1", phrase_pt: "Cuidado com o caroço na empanada de pino.", phrase_es: "Cuidado con el cuesco en la empanada de pino.", context: "Seguridad.", imageUrl: "/images/campo.avif" },
      { id: "3-2", phrase_pt: "O Pastel de Choclo é feito com milho fresco moído.", phrase_es: "El Pastel de Choclo está hecho con maíz fresco molido.", context: "Explicación.", imageUrl: "/images/campo.avif" },
      { id: "3-3", phrase_pt: "As Humitas são cozidas na própria palha do milho.", phrase_es: "Las Humitas son cocidas en la propia hoja del maíz.", context: "Explicación.", imageUrl: "/images/campo.avif" },
      { id: "3-4", phrase_pt: "O pino é uma mistura de carne picada, cebola e temperos.", phrase_es: "El pino es una mezcla de carne picada, cebolla y condimentos.", context: "Ingredientes.", imageUrl: "/images/campo.avif" },
      { id: "3-5", phrase_pt: "Gostariam de adicionar açúcar ou tomate no Pastel de Choclo?", phrase_es: "¿Gustarían de añadir azúcar o tomate en el Pastel de Choclo?", context: "Costumbre.", imageUrl: "/images/campo.avif" },
      { id: "3-6", phrase_pt: "A Cazuela é uma sopa tradicional com carne e legumes.", phrase_es: "La Cazuela es una sopa tradicional con carne y verduras.", context: "Plato.", imageUrl: "/images/campo.avif" },
      { id: "3-7", phrase_pt: "O Porotos con Riendas leva feijão e macarrão espaguete.", phrase_es: "Los Porotos con Riendas llevan porotos y fideos espagueti.", context: "Curiosidad.", imageUrl: "/images/campo.avif" },
      { id: "3-8", phrase_pt: "Acompanha uma taça de vinho tinto da casa?", phrase_es: "¿Acompaña una copa de vino tinto de la casa?", context: "Maridaje.", imageUrl: "/images/campo.avif" },
      { id: "3-9", phrase_pt: "Este prato é servido em uma tigela de greda quente.", phrase_es: "Este plato se sirve en un pocillo de greda caliente.", context: "Presentación.", imageUrl: "/images/campo.avif" },
      { id: "3-10", phrase_pt: "Desejam o molho pebre? É um pouco picante.", phrase_es: "¿Desean salsa pebre? Es un poco picante.", context: "Condimento.", imageUrl: "/images/campo.avif" }
    ]
  },
  "4": {
    id: "4",
    title: "Sandwichería y Mar",
    subtitle: "Sanguches y Mariscos",
    lessons: [
      { id: "4-1", phrase_pt: "O Chacarero é um sanduíche de carne com feijão verde.", phrase_es: "El Chacarero es un sándwich de carne con porotos verdes.", context: "Descripción.", imageUrl: "/images/mar.avif" },
      { id: "4-2", phrase_pt: "O Barros Luco leva carne grelhada e queijo derretido.", phrase_es: "El Barros Luco lleva carne a la plancha y queso derretido.", context: "Descripción.", imageUrl: "/images/mar.avif" },
      { id: "4-3", phrase_pt: "O Mariscal é um mix de mariscos crus com limão e cebola.", phrase_es: "El Mariscal es un mix de mariscos crudos con limón y cebolla.", context: "Descripción.", imageUrl: "/images/mar.avif" },
      { id: "4-4", phrase_pt: "Temos Machas à Parmesana, são gratinadas com queijo.", phrase_es: "Tenemos Machas a la Parmesana, son gratinadas con queso.", context: "Clásico.", imageUrl: "/images/mar.avif" },
      { id: "4-5", phrase_pt: "O Congro Frito é o peixe mais tradicional do Chile.", phrase_es: "El Congrio Frito es el pescado más tradicional de Chile.", context: "Pescado.", imageUrl: "/images/mar.avif" },
      { id: "4-6", phrase_pt: "Gostariam de pão com manteiga enquanto esperam?", phrase_es: "¿Gustarían de pan con mantequilla mientras esperan?", context: "Cortesía.", imageUrl: "/images/mar.avif" },
      { id: "4-7", phrase_pt: "O Caldillo de Congrio é uma sopa de peixe muito rica.", phrase_es: "El Caldillo de Congrio es una sopa de pescado muy rica.", context: "Poesía/Cultura.", imageUrl: "/images/mar.avif" },
      { id: "4-8", phrase_pt: "Temos cervejas artesanais chilenas muito boas.", phrase_es: "Tenemos cervezas artesanales chilenas muy buenas.", context: "Cerveza.", imageUrl: "/images/mar.avif" },
      { id: "4-9", phrase_pt: "O sanduíche é servido em pão frica ou marraqueta?", phrase_es: "¿El sándwich se sirve en pan frica o marraqueta?", context: "Pan.", imageUrl: "/images/mar.avif" },
      { id: "4-10", phrase_pt: "Desejam maionese caseira? É a nossa especialidade.", phrase_es: "¿Desean mayonesa casera? Es nuestra especialidad.", context: "Tip.", imageUrl: "/images/mar.avif" }
    ]
  }
};
