'use client';
import { Carousel } from 'flowbite-react';

export const CarouselClient = () => {
  const texts = [
    '“Conviver com a esclerose múltipla não é fácil, mas encontrar informação clara e apoio faz toda a diferença na minha jornada.”',
    '“Este espaço me mostrou que não estou sozinho. Conheci histórias inspiradoras e encontrei forças para seguir em frente.”',
    '“A comunidade me ajudou a entender melhor a doença e a buscar qualidade de vida com esperança e confiança.”',
  ];

  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 mt-20 sm:mt-40">
      <Carousel>
        {texts.map((text, i) => (
          <div
            key={i}
            className="flex flex-col gap-14 h-full items-center justify-center bg-orange-500 text-white p-8"
          >
            <h3 className="text-lg sm:text-4xl max-w-xs sm:max-w-3xl font-site">
              {text}
            </h3>
            <p>Depoimento de um participante</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
