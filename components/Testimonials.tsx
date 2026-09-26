import { StarIcon } from '@/components/Icons'
import { T } from '@/lib/i18n'

// Testimonios DE EJEMPLO. Reemplázalos por opiniones reales de tus clientes.
const testimonials = [
  {
    name: 'Cliente de ejemplo · Ana',
    es: 'Los mangos llegaron perfectos, dulces como nunca. Ya pedí la caja Paraíso para el cumpleaños de mi mamá.',
    en: 'The mangoes arrived perfect, sweeter than ever. I already ordered the Paradise box for my mom’s birthday.',
  },
  {
    name: 'Cliente de ejemplo · Luis',
    es: 'El Club Familiar nos cambió los desayunos. Cada semana probamos algo nuevo y los niños esperan la caja.',
    en: 'The Family Club changed our breakfasts. We try something new every week and the kids wait for the box.',
  },
  {
    name: 'Cliente de ejemplo · Sofía',
    es: 'Regalé la caja Atardecer Exótico a mi equipo y fue un éxito. La tarjeta con el mensaje fue un gran detalle.',
    en: 'I gave the Exotic Sunset box to my team and it was a hit. The card with the message was a lovely touch.',
  },
]

export function Testimonials() {
  return (
    <section aria-labelledby="testimonios" className="container-page py-20">
      <div className="text-center">
        <p className="eyebrow">
          <T es="Lo que dicen en la isla" en="What the island says" />
        </p>
        <h2 id="testimonios" className="mt-2 text-3xl font-bold text-leaf-900 sm:text-4xl">
          <T es="Clientes felices, fruta feliz" en="Happy customers, happy fruit" />
        </h2>
        <p className="mx-auto mt-3 inline-block rounded-full bg-mango-100 px-4 py-1 text-sm font-semibold text-ink/80">
          <T es="Testimonios de ejemplo — reemplázalos por opiniones reales" en="Sample testimonials — replace them with real reviews" />
        </p>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <li key={item.name} className="card flex flex-col p-8">
            <div className="flex gap-1 text-mango-400" role="img" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} width={20} height={20} />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink/80">
              “<T es={item.es} en={item.en} />”
            </blockquote>
            <p className="mt-6 font-bold text-leaf-700">{item.name}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-coral-700">
              <T es="Ejemplo" en="Sample" />
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
