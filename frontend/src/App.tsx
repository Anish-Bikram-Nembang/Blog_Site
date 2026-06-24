import { BrowserRouter, Route, Routes } from "react-router-dom";
import FeedScreen from "./feed/Feed";
import Layout from "./Layout";
import PostScreen from "./post/PostScreen";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<FeedScreen />} />
                    <Route path="/posts/:slug" element={<PostScreen />} />
                </Route>
            </Routes>
        </BrowserRouter >

    )
}
