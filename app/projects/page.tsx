import Image from 'next/image';
import testIds from '@app/utils/test-ids';
export default async function Projects() {
  const items = [
    {
      _id: '1',
      title: 'Projeto 1',
      description: 'Descrição do projeto 1',
      cover: 'https://picsum.photos/370/320?random=1',
      shortDescription:
        'Apoio e informação para pessoas com esclerose múltipla.',
      slug: 'projeto-1',
    },
    {
      _id: '2',
      title: 'Projeto 2',
      description: 'Descrição do projeto 2',
      cover: 'https://picsum.photos/370/320?random=2',
      shortDescription:
        'Campanhas de conscientiza��ão sobre esclerose múltipla.',
      slug: 'projeto-2',
    },
  ];

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://static.wixstatic.com/media/0b340f_d146a1cff38b4503ae5e6ccc9aa86368~mv2_d_5184_3456_s_4_2.jpg/v1/fill/w_1920,h_492,al_b,q_85,usm_0.66_1.00_0.01,enc_auto/0b340f_d146a1cff38b4503ae5e6ccc9aa86368~mv2_d_5184_3456_s_4_2.jpg"
          alt="projects"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1
          className="text-center py-8 font-site"
          data-testid={testIds.PROJECTS_PAGE.HEADER}
        >
          Nossos Projetos
        </h1>
        <p className="pt-6 max-w-3xl text-sm text-center mx-auto">
          Conheça as iniciativas da nossa ONG voltadas para o acolhimento,
          informação e conscientização sobre esclerose múltipla. Trabalhamos
          para promover qualidade de vida, inclusão e apoio a pacientes e
          familiares.
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 grid-flow-row mt-10"
          data-testid={testIds.PROJECTS_PAGE.PROJECT_LIST}
        >
          {items!.map((item) => (
            <div
              key={item._id}
              className="p-4 relative"
              data-testid={testIds.PROJECTS_PAGE.PROJECT_ITEM_CONTAINER}
            >
              <div className="sm:w-[370px] h-[320px] relative">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="bg-white sm:mt-[-50px] border-t-4 relative mx-6 px-2 pt-3 border-blue-site text-center">
                <h2 className="mb-10 font-site">{item.title}</h2>
                <p className="text-sm mb-6">{item.shortDescription}</p>
                <a
                  data-testid={testIds.PROJECTS_PAGE.PROJECT_ITEM_CTA}
                  href={`/projects/${item.slug}`}
                  className="text-purple-site py-6 font-site"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
