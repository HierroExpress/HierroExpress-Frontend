'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCache } from '@/app/contexts/CacheContext';
import { getCategoryUrlPath } from '@/lib/urlUtils';

const groups = [
  {
    title: 'Barras y perfiles',
    number: '01',
    image: '/materiales/canos.jpeg',
    description: 'Caños, vigas, ángulos y varillas.',
    names: ['CAÑOS', 'VIGAS', 'ANGULOS', 'TEE', 'PLANCHUELAS', 'VARILLAS'],
  },
  {
    title: 'Chapas y mallas',
    number: '02',
    image: '/materiales/malla.png',
    description: 'Chapas, planchas y mallas de hierro.',
    names: [
      'CHAPAS',
      'CHAPA',
      'PLANCHAS',
      'PLANCHA',
      'MALLALUR',
      'METAL DESPLEGADO',
    ],
  },
  {
    title: 'Insumos y accesorios',
    number: '03',
    image: '/materiales/electrodos.png',
    description: 'Pintura, electrodos, discos y herrajes.',
    names: [
      'PINTURA',
      'ELECTRODOS',
      'DISCOS',
      'CERRADURAS',
      'HERRAJES',
      'ACCESORIOS',
    ],
  },
];
export const CategoryFilter = () => {
  const { categories } = useCache();
  return (
    <div className="he-category-grid">
      {groups.map((group) => (
        <article className="he-category-card" key={group.number}>
          <div className="he-category-photo">
            <span>{group.number}</span>
            <img src={group.image} alt={group.title} />
          </div>
          <div className="he-category-body">
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="he-category-links">
              {group.names.map((name) => {
                const category = categories.find(
                  (cat) => cat.name.trim().toUpperCase() === name,
                );
                return category ? (
                  <Link key={name} href={getCategoryUrlPath(category)}>
                    {category.name.toLocaleLowerCase('es')}
                    <ArrowRight aria-hidden="true" size={22} />
                  </Link>
                ) : null;
              })}
            </div>
            <Link className="he-category-all" href="/menu2">
              Ver productos <ArrowRight aria-hidden="true" size={22} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
