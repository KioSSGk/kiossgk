import { useEffect, useState } from 'react';
import { jwtDecode, JwtPayload} from 'jwt-decode';

interface User extends JwtPayload{
id:string,
email:string
}
const useAuth = () => {
    const [user, setUser] = useState<JwtPayload | null | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('use auth에서 로컬 스토리지에서 읽은 토큰:', token);

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                setUser(decoded);
            } catch (error) {
                console.error('토큰 디코딩 실패:', error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return { user };
};

export default useAuth;
