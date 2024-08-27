import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

    const redirectAfterDelay = () => {
      if (isMobile) {
        router.push('/user');
      } else {
        router.push('/admin/login');
      }
    };

    const timeoutId = setTimeout(redirectAfterDelay, 3000); // 5초 후 리디렉션

    return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 클리어
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 relative overflow-hidden">
      <div className="relative text-center z-10">
        <h1 className="text-5xl font-bold text-black font-custom animate-universal">
          Universal
        </h1>
        <h1 className="text-5xl font-bold text-black font-custom animate-kiossgk">
          Kiossgk
        </h1>
      </div>
      <div className="absolute bg-teal-300 rounded-lg opacity-0 animate-fadeIn"></div>
      <style jsx>{`
        @font-face {
          font-family: 'CustomFont';
          src: url('/path/to/font.woff2') format('woff2');
        }

        .font-custom {
          font-family: 'CustomFont', sans-serif;
        }

        /* Universal이 왼쪽에서 날아오는 애니메이션 */
        @keyframes flyInLeft {
          0% {
            transform: translateX(-100vw) scaleX(1.2);
            opacity: 0;
          }
          70% {
            transform: translateX(0) scaleX(0.8);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scaleX(1);
          }
        }

        /* Kiossgk가 오른쪽에서 날아오는 애니메이션 */
        @keyframes flyInRight {
          0% {
            transform: translateX(100vw) scaleX(1.2);
            opacity: 0;
          }
          70% {
            transform: translateX(0) scaleX(0.8);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scaleX(1);
          }
        }

        /* 뒤의 박스가 커지면서 불투명해지는 애니메이션 */
        @keyframes fadeIn {
          0% {
            width: 100px;
            height: 50px;
            opacity: 0;
            transform: scale(1);
          }
          70% {
            opacity: 0.5;
          }
          100% {
            width: 200vw;
            height: 200vh;
            opacity: 1;
            transform: scale(10);
          }
        }

        .animate-universal {
          animation: flyInLeft 0.8s ease-out forwards;
          margin-bottom: 20px; /* 두 줄 사이에 여백 추가 */
        }

        .animate-kiossgk {
          animation: flyInRight 0.8s ease-out forwards;
          animation-delay: 0.3s; /* Kiossgk가 Universal 다음에 날아오도록 지연 */
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out forwards;
          animation-delay: 1s; /* 두 텍스트 애니메이션 후 시작 */
        }
      `}</style>
    </div>
  );
};

export default Home;
