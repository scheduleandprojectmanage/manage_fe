import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import userRouter from './userRouter';


const Loading = <div className="bg-red-700">Loading..</div>;

const root = createBrowserRouter([
    {
        children: [
            // { path: 'main', element: <MainPage /> },
            // { path: '', element: <MainPage /> },
            { path: 'user', children: userRouter() },
        ],
    },
]);

export default root;
