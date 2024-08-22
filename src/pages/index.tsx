import { GetServerSideProps } from 'next';

const Home = () => {
  return null; // 이 페이지에는 아무것도 렌더링되지 않음
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userAgent = context.req.headers['user-agent'] || '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  if (isMobile) {
    return {
      redirect: {
        destination: '/user',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};

export default Home;
