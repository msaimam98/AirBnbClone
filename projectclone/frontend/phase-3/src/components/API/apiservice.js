
export default class API {




        static SignUpUser(body){
            return fetch("http://127.0.0.1:8000/webpages/signup/",{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(resp => resp.json())
        }

        static LogOutUser() {
            localStorage.removeItem('token')



        }


}

