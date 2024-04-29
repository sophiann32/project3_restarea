import {React,useState} from 'react';
import './login.css'; // CSS 파일을 import 합니다.
import axios from 'axios'
import { Link, useNavigate   } from 'react-router-dom';


////////////////////////////////////////////////////////////////////////////////////////////////////
// function Login() {
//     const handleSubmit = (event) => {
//         event.preventDefault(); // 폼 기본 동작 방지
//         // 로그인 처리 로직 작성
//     };
//     return (
//         <div>
//             <header>
//                 {/*<img src="images/header.png" alt="Header Image" />*/}
//             </header>
//             <form id="loginForm" onSubmit={handleSubmit}>
//                 <label htmlFor="username">Username:</label>
//                 <input type="text" id="username" name="username" required />
//                 <label htmlFor="password">Password:</label>
//                 <input type="password" id="password" name="password" required />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// }
// export default Login;
////////////////////////////////////////////////////////////////////////////////////////////////////


function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleSubmit = async (event) => {
        event.preventDefault(); // 폼 기본 동작 방지

        try {
            // Axios를 사용하여 POST 요청을 보냅니다.
            const response = await axios.post('http://localhost:3001/login1111', {
                username: username,
                password: password
            }).then(res=>{
                //post 요청을 보낸후에 then 을 통해서 서버에서 res로 보낸 데이터를 받아올수있습니다.
                console.log(res)
                // console.log('로그인 결과 : '+res.data.isLoginSucceed)
                //원빈님 방식으로
                console.log('로그인 성공결과 : '+res.data.loggedIn)
                console.log('로그인 결과 : '+res.data.loginId)

                if (res.data.loggedIn){
                    //현재 컴퍼넌트 안보이게 state 조정
                    props.setIsLoggedIn(true);
                    props.setLoginId(res.data.loginId);
                    props.setUserName(res.data.userName);
                    props.setUserRealName(res.data.userRealName);

                }else {
                    // 로그인 실패사유 보이겠금
                }
            });

            // 서버로부터의 응답 처리
            navigate('/');
            console.log('console위치 catch 전 : '+ username)

        } catch (error) {
            // 오류 처리
            console.error('오류 발생:', error);
            console.log('console위치  catch 후 : '+ username)
        }
    };

    return (
        <div>
            {/*<hr/>*/}
            {props.isLoggedIn == true ? <div>반갑습니다.{props.userRealName}</div> :

                <form id="loginForm">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="button" onClick={handleSubmit}>Login</button>
                </form>

            }



        </div>
    );
}

export default Login;