export const articles = [
  {
    slug: "osteoartritis-y-movilidad",
    title: "Osteoartritis: señales que afectan la movilidad",
    summary: "Cambios cotidianos que pueden indicar dolor articular y por qué conviene evaluarlos pronto.",
    source: "American College of Veterinary Surgeons",
    sourceUrl: "https://www.acvs.org/small-animal/osteoarthritis-in-dogs/",
    sections: [
      { title: "No siempre se ve como una cojera", paragraphs: ["La dificultad para levantarse, evitar escaleras o saltos, caminar con rigidez y reducir la actividad pueden acompañar la osteoartritis. Registrar cuándo aparecen estos cambios ayuda al equipo veterinario a valorar su evolución."] },
      { title: "El tratamiento es individual", paragraphs: ["El manejo suele combinar control de peso, actividad adaptada, rehabilitación y control veterinario del dolor. No existe una rutina universal: el plan depende de la causa, articulaciones afectadas y condición general del paciente."] },
      { title: "Cuándo solicitar una valoración", paragraphs: ["Consulta si notas dolor, pérdida de movilidad o cambios persistentes de comportamiento. No administres analgésicos humanos ni modifiques medicamentos sin indicación veterinaria."] },
    ],
  },
  {
    slug: "reconocer-dolor-en-mascotas",
    title: "Cómo reconocer cambios compatibles con dolor",
    summary: "La postura, el movimiento y la conducta ofrecen pistas que vale la pena documentar.",
    source: "AAHA Pain Management Guidelines",
    sourceUrl: "https://www.aaha.org/resources/2022-aaha-pain-management-guidelines-for-dogs-and-cats/chronic-pain-assessment-in-dogs/",
    sections: [
      { title: "Observa cambios respecto a su normalidad", paragraphs: ["Menor interés por jugar, cambios al dormir, dificultad para encontrar postura, irritabilidad o una manera distinta de caminar pueden justificar una revisión. Quien convive con la mascota suele detectar primero estas diferencias."] },
      { title: "Videos breves pueden ayudar", paragraphs: ["Graba movimientos habituales —levantarse, caminar o subir un escalón— sin forzar la actividad. Comparar videos en el tiempo puede complementar la exploración clínica."] },
      { title: "El dolor debe reevaluarse", paragraphs: ["La valoración no termina con una sola cifra. El equipo integra comportamiento, palpación, movilidad, respuesta al tratamiento y, cuando corresponde, estudios diagnósticos."] },
    ],
  },
  {
    slug: "primera-valoracion-de-rehabilitacion",
    title: "Qué esperar de una primera valoración",
    summary: "Cómo prepararte para que el equipo conozca el historial y la movilidad de tu mascota.",
    source: "AAHA Pain Management Guidelines",
    sourceUrl: "https://www.aaha.org/trends-magazine/april-2022/f2-pm-guidelines/",
    sections: [
      { title: "Historia y objetivos", paragraphs: ["Se revisan el motivo de consulta, diagnósticos previos, medicamentos, actividad cotidiana y objetivos realistas para el paciente y su familia."] },
      { title: "Evaluación funcional", paragraphs: ["El profesional puede observar postura y marcha, valorar dolor y medir el movimiento de articulaciones. Las pruebas se adaptan para no exigir más de lo seguro."] },
      { title: "Un plan que se ajusta", paragraphs: ["El protocolo inicial puede incluir ejercicio terapéutico, indicaciones para casa y reevaluaciones. La respuesta registrada en cada sesión permite ajustar el plan."] },
    ],
  },
] as const;

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
