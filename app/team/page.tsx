import Image from 'next/image';
import testIds from '@app/utils/test-ids';

const team = [
  {
    _id: '1',
    name: 'Dra. Ana Souza',
    about:
      'Neurologista especializada em esclerose múltipla, atua há mais de 10 anos no apoio a pacientes e familiares.',
    email: 'ana.souza@ongem.org',
    image: 'https://picsum.photos/300/220?random=1',
  },
  {
    _id: '2',
    name: 'Dra. Ana Souza',
    about:
      'Neurologista especializada em esclerose múltipla, atua há mais de 10 anos no apoio a pacientes e familiares.',
    email: 'ana.souza@ongem.org',
    image: 'https://picsum.photos/300/220?random=2',
  },
  {
    _id: '3',
    name: 'Dra. Ana Souza',
    about:
      'Neurologista especializada em esclerose múltipla, atua há mais de 10 anos no apoio a pacientes e familiares.',
    email: 'ana.souza@ongem.org',
    image: 'https://picsum.photos/300/220?random=3',
  },
  {
    _id: '4',
    name: 'Dra. Ana Souza',
    about:
      'Neurologista especializada em esclerose múltipla, atua há mais de 10 anos no apoio a pacientes e familiares.',
    email: 'ana.souza@ongem.org',
    image: 'https://picsum.photos/300/220?random=4',
  },
  {
    _id: '5',
    name: 'Dra. Ana Souza',
    about:
      'Neurologista especializada em esclerose múltipla, atua há mais de 10 anos no apoio a pacientes e familiares.',
    email: 'ana.souza@ongem.org',
    image: 'https://picsum.photos/300/220?random=5',
  },
];
const volunteers = [
  {
    _id: '1',
    name: 'Carlos Oliveira',
    about:
      'Voluntário dedicado à organização de eventos de conscientização sobre esclerose múltipla.',
    email: 'carlos.oliveira@ongem.org',
    image: 'https://picsum.photos/300/220?random=2',
  },
  {
    _id: '2',
    name: 'Carlos Oliveira',
    about:
      'Voluntário dedicado à organização de eventos de conscientização sobre esclerose múltipla.',
    email: 'carlos.oliveira@ongem.org',
    image: 'https://picsum.photos/300/220?random=3',
  },
  {
    _id: '3',
    name: 'Carlos Oliveira',
    about:
      'Voluntário dedicado à organização de eventos de conscientização sobre esclerose múltipla.',
    email: 'carlos.oliveira@ongem.org',
    image: 'https://picsum.photos/300/220?random=4',
  },
  {
    _id: '4',
    name: 'Carlos Oliveira',
    about:
      'Voluntário dedicado à organização de eventos de conscientização sobre esclerose múltipla.',
    email: 'carlos.oliveira@ongem.org',
    image: 'https://picsum.photos/300/220?random=5',
  },
];

export default function Team() {
  return (
    <div className="relative" data-testid={testIds.TEAM_PAGE.CONTAINER}>
      <div className="w-full h-[400px] relative">
        <Image
          src="https://static.wixstatic.com/media/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg/v1/fill/w_1920,h_492,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg"
          alt="Equipe da ONG Esclerose Múltipla"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 text-site font-site">Nossa Equipe</h1>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          Acreditamos que o acolhimento, a informação e o suporte são
          fundamentais para quem convive com esclerose múltipla. Nossa equipe é
          formada por profissionais comprometidos em promover qualidade de vida,
          inclusão e conscientização sobre a doença. Conheça quem faz parte
          dessa missão!
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-4 gap-5 grid-flow-row mt-10"
          data-testid={testIds.TEAM_PAGE.TEAM_MEMBERS}
        >
          {team.map((item) => (
            <div
              key={item._id}
              className="p-4 relative flex flex-col items-center justify-center"
            >
              <div className="w-[300px] h-[220px] relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="bg-white sm:mt-[-48px] border-t-4 relative mx-6 px-1 pt-3 border-orange-500 flex flex-col items-center justify-center text-center">
                <h2 className="mb-4 font-site w-full flex justify-center">
                  {item.name}
                </h2>
                <p className="text-slate-500 text-sm mb-2 w-full flex justify-center">
                  {item.about}
                </p>
                <span className="text-slate-500 w-full flex justify-center">
                  {item.email}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-center py-8 text-site font-site">
          Nossos Voluntários
        </h1>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          O trabalho voluntário é essencial para ampliar o alcance das nossas
          ações. Nossos voluntários contribuem com dedicação em campanhas
          educativas, eventos de apoio e atividades de integração para pessoas
          com esclerose múltipla e seus familiares.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 grid-flow-row mt-10">
          {volunteers.map((item) => (
            <div
              key={item._id}
              className="p-4 relative flex flex-col items-center justify-center"
            >
              <div className="w-[300px] h-[220px] relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="bg-white sm:mt-[-48px] border-t-4 relative mx-6 px-1 pt-3 border-orange-500 flex flex-col items-center justify-center text-center">
                <h2 className="mb-4 font-site w-full flex justify-center">
                  {item.name}
                </h2>
                <p className="text-slate-500 text-sm mb-2 w-full flex justify-center">
                  {item.about}
                </p>
                <span className="text-slate-500 w-full flex justify-center">
                  {item.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
