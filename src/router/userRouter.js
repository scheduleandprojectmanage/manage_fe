import {Suspense, lazy} from "react";
const Loading = <div>Loading..</div>

const SignUp = lazy(()=>import("../pages/user/SignUpPage"))
const SignIn = lazy(() => import("../pages/user/SignInPage"))
// const Modify  = lazy(() => import("../pages/user/ModifyPage"))

const userRouter = () => {
    return [
        {
            path: "signup",
            element : <Suspense fallback={Loading}><SignUp/></Suspense>
        },{
            path: "signin",
            element:<Suspense fallback={Loading}><SignIn/></Suspense>
        }

        // ,{
        //     path: "modify",
        //     element:<Suspense fallback={Loading}><Modify/></Suspense>
        // }
    ]
}

export default userRouter