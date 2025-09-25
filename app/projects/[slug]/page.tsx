import testIds from '@app/utils/test-ids';
import Image from 'next/image';

export default async function Project({ params }: any) {
  const project = {
    title: 'Projeto de Apoio à Esclerose Múltipla',
    shortDescription:
      'Iniciativa voltada para acolhimento, informação e suporte a pessoas com esclerose múltipla.',
    longDescription:
      'O projeto oferece grupos de apoio, palestras educativas e campanhas de conscientização sobre esclerose múltipla, promovendo inclusão e qualidade de vida.',
    cover: 'https://picsum.photos/1200/400?random=1',
    gallery: [
      { src: 'https://picsum.photos/500/300?random=2' },
      { src: 'https://picsum.photos/500/300?random=3' },
      { src: 'https://picsum.photos/500/300?random=4' },
    ],
  };

  return (
    <div
      className="relative"
      data-testid={testIds.PROJECT_DETAILS_PAGE.CONTAINER}
    >
      <div className="w-full h-[400px] relative">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20 text-center">
        <h1 className="py-8 font-site">{project.title}</h1>
        <p className="pt-6 max-w-3xl text-sm mx-auto">
          {project.shortDescription}
        </p>
        <p className="py-6 max-w-3xl text-sm mx-auto">
          {project.longDescription}
        </p>
        <a href="" className="btn-main">
          Doe agora
        </a>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 grid-flow-row mt-10">
          {project.gallery?.map((image: any, i: number) => (
            <div key={i} className="p-4 relative">
              <Image
                src={image.src}
                alt={`Imagem do projeto ${i + 1}`}
                width={500}
                height={300}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
